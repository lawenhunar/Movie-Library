const sqlite3 = require('sqlite3');

function seedDatabase() {
    const db = new sqlite3.Database('database.db');
    
    // Check if movies already exist
    db.get("SELECT COUNT(*) as count FROM Movies", (err, row) => {
        if (err) {
            console.error("Error checking movies count:", err);
            return;
        }
        
        if (row.count === 0) {
            console.log("Database is empty, adding sample movies...");
            
            // Add sample movies if database is empty
            const sampleMovies = [
                {
                    Title: "The Shawshank Redemption",
                    Description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                    ReleaseYear: 1994,
                    Genre: "Drama",
                    Directors: "Frank Darabont"
                },
                {
                    Title: "The Godfather",
                    Description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
                    ReleaseYear: 1972,
                    Genre: "Crime",
                    Directors: "Francis Ford Coppola"
                },
                {
                    Title: "Pulp Fiction",
                    Description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
                    ReleaseYear: 1994,
                    Genre: "Crime",
                    Directors: "Quentin Tarantino"
                },
                {
                    Title: "The Dark Knight",
                    Description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                    ReleaseYear: 2008,
                    Genre: "Action",
                    Directors: "Christopher Nolan"
                },
                {
                    Title: "Inception",
                    Description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                    ReleaseYear: 2010,
                    Genre: "Sci-Fi",
                    Directors: "Christopher Nolan"
                },
                {
                    Title: "Forrest Gump",
                    Description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
                    ReleaseYear: 1994,
                    Genre: "Drama",
                    Directors: "Robert Zemeckis"
                }
            ];
            
            let completed = 0;
            sampleMovies.forEach((movie, index) => {
                db.run(`
                    INSERT INTO Movies (Title, Description, ReleaseYear, Genre, Directors, LikeNumber)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [movie.Title, movie.Description, movie.ReleaseYear, movie.Genre, movie.Directors, Math.floor(Math.random() * 100)], (err) => {
                    if (err) {
                        console.error(`Error inserting movie ${movie.Title}:`, err);
                    } else {
                        console.log(`✓ Added: ${movie.Title}`);
                    }
                    
                    completed++;
                    if (completed === sampleMovies.length) {
                        console.log("🎬 Sample movies successfully added to database!");
                        
                        // Add some sample actors for the first few movies
                        addSampleActors(db);
                    }
                });
            });
        } else {
            console.log(`Database already contains ${row.count} movies`);
        }
    });
}

function addSampleActors(db) {
    const sampleActors = [
        { MovieID: 1, Name: "Tim Robbins", Age: 65, Country: "USA" },
        { MovieID: 1, Name: "Morgan Freeman", Age: 87, Country: "USA" },
        { MovieID: 2, Name: "Marlon Brando", Age: 80, Country: "USA" },
        { MovieID: 2, Name: "Al Pacino", Age: 84, Country: "USA" },
        { MovieID: 3, Name: "John Travolta", Age: 70, Country: "USA" },
        { MovieID: 3, Name: "Samuel L. Jackson", Age: 75, Country: "USA" },
        { MovieID: 4, Name: "Christian Bale", Age: 50, Country: "UK" },
        { MovieID: 4, Name: "Heath Ledger", Age: 28, Country: "Australia" },
        { MovieID: 5, Name: "Leonardo DiCaprio", Age: 49, Country: "USA" },
        { MovieID: 5, Name: "Marion Cotillard", Age: 48, Country: "France" },
        { MovieID: 6, Name: "Tom Hanks", Age: 68, Country: "USA" },
        { MovieID: 6, Name: "Robin Wright", Age: 58, Country: "USA" }
    ];
    
    console.log("🎭 Adding sample actors...");
    
    let actorCompleted = 0;
    sampleActors.forEach(actor => {
        db.run(`
            INSERT INTO Actors (Name, Age, Country, MovieID)
            VALUES (?, ?, ?, ?)
        `, [actor.Name, actor.Age, actor.Country, actor.MovieID], (err) => {
            if (err) {
                console.error(`Error inserting actor ${actor.Name}:`, err);
            } else {
                console.log(`✓ Added actor: ${actor.Name}`);
            }
            
            actorCompleted++;
            if (actorCompleted === sampleActors.length) {
                console.log("🎬 Database seeding completed successfully!");
            }
        });
    });
}

module.exports = { seedDatabase };
