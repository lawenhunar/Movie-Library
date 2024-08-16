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
        Name TEXT NOT NULL,
        Age INTEGER,
        Country TEXT
    );

    CREATE TABLE MovieActors (
        MovieID INTEGER,
        ActorID INTEGER,
        PRIMARY KEY (MovieID, ActorID),
        FOREIGN KEY (MovieID) REFERENCES Movies(MovieID),
        FOREIGN KEY (ActorID) REFERENCES Actors(ActorID)
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