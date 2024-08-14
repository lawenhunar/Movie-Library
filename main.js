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
    // console.log(req.body);
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
    // res.send("gaisht")
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