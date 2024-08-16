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

app.post('/add-actor/:id',(req,res)=>{
    db.run(
        `
        INSERT INTO Actors
        (
            Name,
            Age,
            Country,
            MovieID
        )
        VALUES
        (
            "${req.body.Name}",
            ${req.body.Age},
            "${req.body.Country}",
            ${req.params.id}
        )
        `,()=>{
            res.send('Done!! Actor was added')
        }
    )
})

app.put('/edit-movies/:id', (req, res) => {
    const movieId = req.params.id;
    const { title, description, releaseYear, genre, directors } = req.body;
    
    // Update query
    db.run(
        `UPDATE Movies 
        SET Title = "${req.body.Title}", 
        Description = "${req.body.Description}", 
        ReleaseYear = ${req.body.ReleaseYear}, 
        Genre = "${req.body.Genre}", 
        Directors = "${req.body.Directors}"
        WHERE MovieID = ${req.params.id}
        `
        ,function (err) {
            if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Movie updated successfully', changes: this.changes });
    });
});

app.delete('/edit-movies/:id',(req,res)=>{
    db.run(`
            DELETE FROM Movies WHERE MovieID = ${req.params.id}
        `),
        res.send("deleted")
})



//all the gets r here
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})

app.get('/add-movie',(req,res)=>{
    res.sendFile(path.join(__dirname,'add-movie.html'))
})

app.get('/edit-movies/:id', (req, res) => {
    res.sendFile(path.join(__dirname,'editMoviePage.html'))
});

app.get('/view-movie/:id', (req,res)=>{
    res.sendFile(path.join(__dirname,'viewMovie.html'))
})

app.get('/movieDetail/:id',(req,res)=>{
    console.log(req.body);
    db.all(
        `
        SELECT * FROM Movies
        WHERE MovieID = ${req.params.id}
        `
        ,
        (error,rows)=>{
            console.log(rows);
            res.send(rows)
    })
    
})

//movie database query
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

app.get('/actor/:id',(req,res)=>{
    console.log(req.body);
    db.all(
        `
        SELECT * FROM Actors
        WHERE MovieID = ${req.params.id}
        `
        ,
        (error,rows)=>{
            console.log(rows);
            res.send(rows)
    })
    
})

//this is to test u can remove later
app.get('/actorsAll',(req,res)=>{
    console.log(req.body);
    db.all(
        `
        SELECT * FROM Actors
        `
        ,
        (error,rows)=>{
            console.log(rows);
            res.send(rows)
    })
    
})

app.listen(port,()=>{
    console.log(`port listening on port ${port}`)
})

app.use("/assets", express.static(__dirname + "/assets"));