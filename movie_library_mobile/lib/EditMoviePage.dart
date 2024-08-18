import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class EditMoviePage extends StatefulWidget {
  final int movieId;
  final Map<String, dynamic> movieDetails;

  EditMoviePage({required this.movieId, required this.movieDetails});

  @override
  _EditMoviePageState createState() => _EditMoviePageState();
}

class _EditMoviePageState extends State<EditMoviePage> {
  late TextEditingController titleController;
  late TextEditingController descriptionController;
  late TextEditingController releaseYearController;
  late TextEditingController genreController;
  late TextEditingController directorsController;

  @override
  void initState() {
    super.initState();
    titleController = TextEditingController(text: widget.movieDetails['Title']);
    descriptionController = TextEditingController(text: widget.movieDetails['Description']);
    releaseYearController = TextEditingController(text: widget.movieDetails['ReleaseYear'].toString());
    genreController = TextEditingController(text: widget.movieDetails['Genre']);
    directorsController = TextEditingController(text: widget.movieDetails['Directors']);
  }

  void editMovie() async {
    final response = await http.put(
      Uri.parse('http://10.0.2.2:5000/edit-movies/${widget.movieId}'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'Title': titleController.text,
        'Description': descriptionController.text,
        'ReleaseYear': releaseYearController.text,
        'Genre': genreController.text,
        'Directors': directorsController.text,
      }),
    );
    if (response.statusCode == 200) {
      Navigator.pop(context, true); // Return to the previous page with a success result
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Edit Movie'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: titleController,
              decoration: InputDecoration(labelText: 'Title'),
            ),
            TextField(
              controller: descriptionController,
              decoration: InputDecoration(labelText: 'Description'),
            ),
            TextField(
              controller: releaseYearController,
              decoration: InputDecoration(labelText: 'Release Year'),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: genreController,
              decoration: InputDecoration(labelText: 'Genre'),
            ),
            TextField(
              controller: directorsController,
              decoration: InputDecoration(labelText: 'Directors'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: editMovie,
              child: Text('Save Changes'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AddActorPage(movieId: widget.movieId),
                  ),
                );
              },
              child: Text('Add Actor'),
            ),
          ],
        ),
      ),
    );
  }
}

class AddActorPage extends StatefulWidget {
  final int movieId;

  AddActorPage({required this.movieId});

  @override
  _AddActorPageState createState() => _AddActorPageState();
}

class _AddActorPageState extends State<AddActorPage> {
  final _formKey = GlobalKey<FormState>();
  String name = '';
  String age = '';
  String country = '';

  void addActor() async {
    final response = await http.post(
      Uri.parse('http://10.0.2.2:5000/add-actor/${widget.movieId}'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'Name': name,
        'Age': age,
        'Country': country,
      }),
    );
    if (response.statusCode == 200) {
      Navigator.pop(context); // Return to the previous page
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Add Actor'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: InputDecoration(labelText: 'Name'),
                onChanged: (value) {
                  setState(() {
                    name = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the actor\'s name';
                  }
                  return null;
                },
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Age'),
                onChanged: (value) {
                  setState(() {
                    age = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the actor\'s age';
                  }
                  return null;
                },
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Country'),
                onChanged: (value) {
                  setState(() {
                    country = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the actor\'s country';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    addActor();
                  }
                },
                child: Text('Add Actor'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
