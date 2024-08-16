const express = require("express");
const path=require('path')
const sqlite3=require('sqlite3');
const cors=require('cors')

db= new sqlite3.Database('database.db')
const app=express()

app.use(cors())
app.use(express.json())

const port=5000

app.post('/movies',(req,res)=>{
    db.run(
        `
        INSERT INTO Movies
        (
            Title,
            Description,
            ReleaseYear,
            Genre,
            Directors
        )
        VALUES
        (
            "${req.body.Title}",
            "${req.body.Description}",
            "${req.body.ReleaseYear}",
            "${req.body.Genre}",
            "${req.body.Directors}"
        )
        `,()=>{
            res.send('Done!! movie was added')
        }
    )
})

app.get('/movies',(req,res)=>{
    console.log(req.body);
    db.all(
        `
        SELECT * FROM Movies
        `
        ,
        (error,rows)=>{
            console.log(rows);
            res.send(rows)
    })
    
})

app.get('/movies/:id', (req, res) => {
    res.sendFile(path.join(__dirname,'movie-details.html'))
});

// Add comment API
app.post('/movies/:id/comments', (req, res) => {
    const movieId = req.params.id;
    const { username, comment } = req.body;

    db.run(`
        INSERT INTO Comments
        (
            MovieID,
            UserName,
            CommentText
        )
        VALUES
        (
            ${req.params.id},
            "${req.body.UserName}",
            "${req.body.CommentText}"
        )
        `,()=>{
            res.send('Done!! comment was added')
        });
});
// Fetch movie details API
app.get('/api/movies/:id', (req, res) => {
    db.get(`SELECT * FROM Movies WHERE MovieID = ?`, [movieId], (err, movie) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching movie details" });
        }
        res.json(movie);
    });
});

// Fetch comments API
app.get('/movies/:id/comments', (req, res) => {
    const movieId = req.params.id;
    db.all(`SELECT * FROM Comments  `, (err, comments) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching comments" });
        }
        res.json(comments);
    });
});

app.get('/test1',(req,res)=>{
    console.log(req.body);
    db.all(
        `
        SELECT * FROM Comments
        `
        ,
        (error,rows)=>{
            console.log(rows);
            res.send(rows)
    })
    
});


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})

app.get('/add-movie',(req,res)=>{
    res.sendFile(path.join(__dirname,'add-movie.html'))
})


app.listen(port,()=>{
    console.log(`port listening on port ${port}`)
})

app.use("/assets", express.static(__dirname + "/assets"));