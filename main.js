const express = require("express");
const path = require('path')
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv');
const { seedDatabase } = require('./seedData');

// Import models
const Movie = require('./models/Movie');
const Actor = require('./models/Actor');
const Comment = require('./models/Comment');

// Load environment variables
dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())

// Connect to MongoDB
console.log('🔗 Attempting to connect to MongoDB...');
console.log('DB_URI exists:', !!process.env.DB_URI);

mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/movie-library', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Connected to MongoDB');
    // Seed database with sample data after connection
    console.log('🌱 Starting database seeding...');
    seedDatabase();
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 Make sure to set DB_URI in your .env file');
    // Don't exit, continue with local fallback
    console.log('🔄 Continuing without MongoDB connection...');
    
    // Try to seed anyway after a delay (in case connection succeeds later)
    setTimeout(() => {
        console.log('🔄 Attempting delayed seeding...');
        seedDatabase();
    }, 2000);
});

const port = process.env.PORT || 5001

app.post('/movies', async (req, res) => {
    try {
        const movie = new Movie({
            title: req.body.Title,
            description: req.body.Description,
            releaseYear: req.body.ReleaseYear,
            genre: req.body.Genre,
            directors: req.body.Directors,
            likeNumber: 0
        });
        
        await movie.save();
        res.send('Done!! movie was added');
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).send('Error adding movie');
    }
})

app.post('/add-actor/:id', async (req, res) => {
    try {
        const actor = new Actor({
            name: req.body.Name,
            age: req.body.Age,
            country: req.body.Country,
            movieId: req.params.id
        });
        
        await actor.save();
        res.send('Done!! Actor was added');
    } catch (error) {
        console.error('Error adding actor:', error);
        res.status(500).send('Error adding actor');
    }
})

app.post('/add-comment/:id', async (req, res) => {
    try {
        const comment = new Comment({
            movieId: req.params.id,
            userName: req.body.UserName,
            commentText: req.body.CommentText
        });
        
        await comment.save();
        res.send('Done!! Comment was added');
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send('Error adding comment');
    }
})

app.put('/edit-movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.Title,
                description: req.body.Description,
                releaseYear: req.body.ReleaseYear,
                genre: req.body.Genre,
                directors: req.body.Directors
            },
            { new: true }
        );
        
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        res.json({ message: 'Movie updated successfully', movie });
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/likeMovie/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            { $inc: { likeNumber: 1 } },
            { new: true }
        );
        
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        res.json({ message: 'Movie liked successfully', likeNumber: movie.likeNumber });
    } catch (error) {
        console.error('Error liking movie:', error);
        res.status(500).json({ error: error.message });
    }
})

app.delete('/edit-movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        // Also delete related actors and comments
        await Actor.deleteMany({ movieId: req.params.id });
        await Comment.deleteMany({ movieId: req.params.id });
        
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: error.message });
    }
})


//all the gets r here
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/add-movie', (req, res) => {
    res.sendFile(path.join(__dirname, 'add-movie.html'))
})

app.get('/edit-movies/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'editMoviePage.html'))
});

app.get('/view-movie/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'viewMovie.html'))
})

app.get('/movieDetail/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json([movie]);
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({ error: error.message });
    }
})

app.get('/all-comments/:id', async (req, res) => {
    try {
        const comments = await Comment.find({ movieId: req.params.id });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: error.message });
    }
})

//movie database query
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: error.message });
    }
})

app.get('/actor/:id', async (req, res) => {
    try {
        const actors = await Actor.find({ movieId: req.params.id });
        res.json(actors);
    } catch (error) {
        console.error('Error fetching actors:', error);
        res.status(500).json({ error: error.message });
    }
})

app.get('/movies/:name', async (req, res) => {
    try {
        const movies = await Movie.find({
            title: { $regex: req.params.name, $options: 'i' }
        });
        res.json(movies);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: error.message });
    }
})

// Manual seeding endpoint for debugging
app.post('/seed-database', async (req, res) => {
    try {
        console.log('🌱 Manual seeding triggered...');
        await seedDatabase();
        res.json({ message: 'Database seeding completed' });
    } catch (error) {
        console.error('Error in manual seeding:', error);
        res.status(500).json({ error: error.message });
    }
})




app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📱 Movie Library API is ready!`);
})

app.use("/assets", express.static(__dirname + "/assets"));