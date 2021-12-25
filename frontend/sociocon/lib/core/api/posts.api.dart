import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:sociocon/app/routes/api_routes.dart';

class PostsAPI {
  final client = http.Client();
  final headers = {
    "Content-type": "application/json",
    "Accept": "application/json",
    "Access-Control-Allow-Origin": '*',
  };

  Future fetchMembersPosts({required String userMail}) async {
    final postsURL = POST_URL + "/$userMail";
    final Uri uri = Uri.parse(postsURL);
    final http.Response response = await client.get(
      uri,
      headers: headers,
    );
    final dynamic body = response.body;
    final Map<String, dynamic> parsedPosts = await jsonDecode(body);
    return parsedPosts;
  }
}
