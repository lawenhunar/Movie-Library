import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class MovieDetailPage extends StatefulWidget {
  final int movieId;

  MovieDetailPage({required this.movieId});

  @override
  _MovieDetailPageState createState() => _MovieDetailPageState();
}

class _MovieDetailPageState extends State<MovieDetailPage> {
  Map<String, dynamic>? movieDetails;
  List<dynamic> actors = [];
  List<dynamic> comments = [];
  bool isLoading = true;

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchMovieDetails();
  }

  Future<void> fetchMovieDetails() async {
    final movieResponse = await http.get(
      Uri.parse('http://10.0.2.2:5000/movieDetail/${widget.movieId}'),
    );
    final actorResponse = await http.get(
      Uri.parse('http://10.0.2.2:5000/actor/${widget.movieId}'),
    );
    final commentResponse = await http.get(
      Uri.parse('http://10.0.2.2:5000/all-comments/${widget.movieId}'),
    );

    if (movieResponse.statusCode == 200 &&
        actorResponse.statusCode == 200 &&
        commentResponse.statusCode == 200) {
      setState(() {
        movieDetails =
            jsonDecode(movieResponse.body)[0]; // Assuming single movie returned
        actors = jsonDecode(actorResponse.body);
        comments = jsonDecode(commentResponse.body);
        isLoading = false;
      });
    }
  }

  Future<void> addComment() async {
    if (_usernameController.text.isEmpty || _commentController.text.isEmpty) {
      return;
    }

    final response = await http.post(
      Uri.parse('http://10.0.2.2:5000/add-comment/${widget.movieId}'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "UserName": _usernameController.text,
        "CommentText": _commentController.text,
      }),
    );

    if (response.statusCode == 200) {
      setState(() {
        comments.add({
          "UserName": _usernameController.text,
          "CommentText": _commentController.text,
        });
        _usernameController.clear();
        _commentController.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Movie Details'),
        backgroundColor: Color.fromARGB(255, 173, 223, 255),
      ),
      backgroundColor: const Color.fromARGB(255, 225, 246, 255),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : Padding(
              padding: EdgeInsets.all(16.0),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      movieDetails?['Title'] ?? '',
                      style:
                          TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 10),
                    Text('Description: ${movieDetails?['Description'] ?? ''}'),
                    Text('Release Year: ${movieDetails?['ReleaseYear'] ?? ''}'),
                    Text('Genre: ${movieDetails?['Genre'] ?? ''}'),
                    Text('Directors: ${movieDetails?['Directors'] ?? ''}'),
                    Text('Likes: ${movieDetails?['LikeNumber'] ?? 0}'),
                    SizedBox(height: 20),
                    Text(
                      'Actors',
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    ...actors.map((actor) {
                      return ListTile(
                        title: Text(actor['Name']),
                        subtitle: Text(
                            'Age: ${actor['Age']}, Country: ${actor['Country']}'),
                      );
                    }).toList(),
                    SizedBox(height: 20),
                    Text(
                      'Comments',
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    ...comments.map((comment) {
                      return ListTile(
                        title: Text(comment['UserName']),
                        subtitle: Text(comment['CommentText']),
                      );
                    }).toList(),
                    SizedBox(height: 20),
                    TextField(
                      controller: _usernameController,
                      decoration: InputDecoration(labelText: 'Your Name'),
                    ),
                    TextField(
                      controller: _commentController,
                      decoration: InputDecoration(labelText: 'Your Comment'),
                    ),
                    SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: addComment,
                      child: Text('Add Comment'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}