import 'package:provider/provider.dart';
import 'package:provider/single_child_widget.dart';
import 'package:sociocon/core/notifiers/auth.notifier.dart';
import 'package:sociocon/core/notifiers/posts.notifier.dart';
import 'package:sociocon/core/notifiers/user.notifier.dart';

List<SingleChildWidget> providers = [...remoteProviders];

//Independent Providers
List<SingleChildWidget> remoteProviders = [
  ChangeNotifierProvider(
    create: (context) => PostsNotifier(),
  ),
  ChangeNotifierProvider(
    create: (context) => AuthenticationNotifier(),
  ),
  ChangeNotifierProvider(
    create: (context) => UserNotifier(),
  ),
];
