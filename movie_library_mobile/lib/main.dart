import 'package:flutter/material.dart';
import 'dart:convert';
import 'AddMoviePage.dart'; 
import 'EditMoviePage.dart';

import 'package:http/http.dart' as http;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Movie Library',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MovieHomePage(),
    );
  }
}

class MovieHomePage extends StatefulWidget {
  @override
  _MovieHomePageState createState() => _MovieHomePageState();
}

class _MovieHomePageState extends State<MovieHomePage> {
  List movies = [];

  @override
  void initState() {
    super.initState();
    fetchMovies();
  }

  Future<void> fetchMovies() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/movies'));
    if (response.statusCode == 200) {
      setState(() {
        movies = json.decode(response.body);
      });
    } else {
      throw Exception('Failed to load movies');
    }
  }

  void addMovie() async {
    final response = await http.post(
      Uri.parse('http://10.0.2.2:5000/movies'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'Title': 'New Movie',
        'Description': 'A movie description',
        'ReleaseYear': '2024',
        'Genre': 'Action',
        'Directors': 'John Doe',
      }),
    );
    if (response.statusCode == 200) {
      fetchMovies();
    }
  }

  void addActor(int movieId) async {
    final response = await http.post(
      Uri.parse('http://10.0.2.2:5000/add-actor/$movieId'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'Name': 'New Actor',
        'Age': 30,
        'Country': 'USA',
      }),
    );
    if (response.statusCode == 200) {
      print('Actor added');
    }
  }

  void addComment(int movieId, String userName, String commentText) async {
    final response = await http.post(
      Uri.parse('http://10.0.2.2:5000/add-comment/$movieId'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'UserName': userName,
        'CommentText': commentText,
      }),
    );
    if (response.statusCode == 200) {
      print('Comment added');
    }
  }

  void likeMovie(int movieId) async {
    final response = await http.put(
      Uri.parse('http://10.0.2.2:5000/likeMovie/$movieId'),
    );
    if (response.statusCode == 200) {
      print('Movie liked');
    }
  }

  void deleteMovie(int movieId) async {
    final response = await http.delete(
      Uri.parse('http://10.0.2.2:5000/edit-movies/$movieId'),
    );
    if (response.statusCode == 200) {
      fetchMovies();
    }
  }

  void navigateToEditMovie(int movieId, Map<String, dynamic> movieDetails) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EditMoviePage(movieId: movieId, movieDetails: movieDetails),
      ),
    );
    if (result == true) {
      fetchMovies(); // Refresh movie list after returning from EditMoviePage
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Movie Library'),
      ),
      body: ListView.builder(
        itemCount: movies.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(movies[index]['Title']),
            subtitle: Text(movies[index]['Description']),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: Icon(Icons.edit),
                  onPressed: () => navigateToEditMovie(movies[index]['MovieID'], movies[index]),
                ),
                IconButton(
                  icon: Icon(Icons.thumb_up),
                  onPressed: () => likeMovie(movies[index]['MovieID']),
                ),
                IconButton(
                  icon: Icon(Icons.delete),
                  onPressed: () => deleteMovie(movies[index]['MovieID']),
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => AddMoviePage()),
          ).then((value) {
            fetchMovies(); // Refresh movie list after returning from AddMoviePage
          });
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
