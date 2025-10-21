const Movie = require('./models/Movie');
const Actor = require('./models/Actor');
const Comment = require('./models/Comment');

async function seedDatabase() {
    try {
        console.log("🔍 Checking if database needs seeding...");
        
        // Check if movies already exist
        const movieCount = await Movie.countDocuments();
        console.log(`📊 Found ${movieCount} movies in database`);
        
        if (movieCount === 0) {
            console.log("🌱 Database is empty, adding sample movies...");
            
            // Add sample movies
            const sampleMovies = [
                {
                    title: "The Shawshank Redemption",
                    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                    releaseYear: 1994,
                    genre: "Drama",
                    directors: "Frank Darabont",
                    likeNumber: Math.floor(Math.random() * 100)
                },
                {
                    title: "The Godfather",
                    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
                    releaseYear: 1972,
                    genre: "Crime",
                    directors: "Francis Ford Coppola",
                    likeNumber: Math.floor(Math.random() * 100)
                },
                {
                    title: "Pulp Fiction",
                    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
                    releaseYear: 1994,
                    genre: "Crime",
                    directors: "Quentin Tarantino",
                    likeNumber: Math.floor(Math.random() * 100)
                },
                {
                    title: "The Dark Knight",
                    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                    releaseYear: 2008,
                    genre: "Action",
                    directors: "Christopher Nolan",
                    likeNumber: Math.floor(Math.random() * 100)
                },
                {
                    title: "Inception",
                    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                    releaseYear: 2010,
                    genre: "Sci-Fi",
                    directors: "Christopher Nolan",
                    likeNumber: Math.floor(Math.random() * 100)
                },
                {
                    title: "Forrest Gump",
                    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
                    releaseYear: 1994,
                    genre: "Drama",
                    directors: "Robert Zemeckis",
                    likeNumber: Math.floor(Math.random() * 100)
                }
            ];
            
            const createdMovies = await Movie.insertMany(sampleMovies);
            console.log(`✓ Added ${createdMovies.length} sample movies`);
            
            // Add sample actors
            const sampleActors = [
                { movieId: createdMovies[0]._id, name: "Tim Robbins", age: 65, country: "USA" },
                { movieId: createdMovies[0]._id, name: "Morgan Freeman", age: 87, country: "USA" },
                { movieId: createdMovies[1]._id, name: "Marlon Brando", age: 80, country: "USA" },
                { movieId: createdMovies[1]._id, name: "Al Pacino", age: 84, country: "USA" },
                { movieId: createdMovies[2]._id, name: "John Travolta", age: 70, country: "USA" },
                { movieId: createdMovies[2]._id, name: "Samuel L. Jackson", age: 75, country: "USA" },
                { movieId: createdMovies[3]._id, name: "Christian Bale", age: 50, country: "UK" },
                { movieId: createdMovies[3]._id, name: "Heath Ledger", age: 28, country: "Australia" },
                { movieId: createdMovies[4]._id, name: "Leonardo DiCaprio", age: 49, country: "USA" },
                { movieId: createdMovies[4]._id, name: "Marion Cotillard", age: 48, country: "France" },
                { movieId: createdMovies[5]._id, name: "Tom Hanks", age: 68, country: "USA" },
                { movieId: createdMovies[5]._id, name: "Robin Wright", age: 58, country: "USA" }
            ];
            
            await Actor.insertMany(sampleActors);
            console.log(`✓ Added ${sampleActors.length} sample actors`);
            
            // Add sample comments
            const sampleComments = [
                {
                    movieId: createdMovies[0]._id,
                    userName: "MovieFan123",
                    commentText: "One of the greatest films ever made. Tim Robbins and Morgan Freeman deliver outstanding performances."
                },
                {
                    movieId: createdMovies[1]._id,
                    userName: "CinemaLover",
                    commentText: "A masterpiece of storytelling. Marlon Brando's performance is legendary."
                },
                {
                    movieId: createdMovies[2]._id,
                    userName: "FilmCritic",
                    commentText: "Quentin Tarantino's masterpiece. The non-linear narrative is brilliant."
                },
                {
                    movieId: createdMovies[3]._id,
                    userName: "ActionFan",
                    commentText: "Heath Ledger's Joker is absolutely terrifying. A perfect superhero film."
                }
            ];
            
            await Comment.insertMany(sampleComments);
            console.log(`✓ Added ${sampleComments.length} sample comments`);
            
            console.log("🎬 Database seeding completed successfully!");
        } else {
            console.log(`Database already contains ${movieCount} movies`);
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

module.exports = { seedDatabase };
