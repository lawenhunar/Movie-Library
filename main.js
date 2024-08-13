const express = require("express");
const path=require('path')
const sqlite3=require('sqlite3');
const cors=require('cors')

db= new sqlite3.Database('database.db')
const app=express()

app.use(cors())
app.use(express.json())

const port=5000

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})





app.listen(port,()=>{
    console.log(`port listening on port ${port}`)
})