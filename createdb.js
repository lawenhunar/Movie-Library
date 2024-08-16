const sqlite3=require('sqlite3');
db= new sqlite3.Database('database.db')

db.run(
    `
    CREATE TABLE Movies (
        MovieID INTEGER PRIMARY KEY AUTOINCREMENT,
        Title TEXT NOT NULL,
        Description TEXT,
        ReleaseYear INTEGER,
        Genre TEXT,
        Directors TEXT
    );

    CREATE TABLE Actors (
    ActorID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Age INTEGER,
    Country TEXT,
    MovieID INTEGER,
    FOREIGN KEY (MovieID) REFERENCES Movies(MovieID)
);

    CREATE TABLE Comments (
        CommentID INTEGER PRIMARY KEY AUTOINCREMENT,
        MovieID INTEGER NOT NULL,
        UserName TEXT NOT NULL,
        CommentText TEXT NOT NULL,
        FOREIGN KEY (MovieID) REFERENCES Movies(MovieID)
    );
    `

)