import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'providers/auth_provider.dart';
import 'providers/sensor_data_provider.dart';
import 'providers/theme_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/weather_dashboard_screen.dart';
import 'screens/iot_dashboard_screen.dart';
import 'screens/ai_settings_screen.dart';
import 'screens/device_assignment_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/about_screen.dart';
import 'screens/products_screen.dart';
import 'screens/drone_detection_screen.dart';
import 'utils/theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: ".env");
  await Firebase.initializeApp();

  runApp(const AtagriApp());
}

class AtagriApp extends StatelessWidget {
  const AtagriApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => SensorDataProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return MaterialApp.router(
            title: 'ATAMAGRI',
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.themeMode,
            debugShowCheckedModeBanner: false,
            routerConfig: _router,
          );
        },
      ),
    );
  }
}

final GoRouter _router = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardScreen(),
      routes: [
        GoRoute(
          path: 'weather',
          builder: (context, state) => const WeatherDashboardScreen(),
        ),
        GoRoute(
          path: 'iot',
          builder: (context, state) => const IotDashboardScreen(),
        ),
        GoRoute(
          path: 'ai-settings',
          builder: (context, state) => const AiSettingsScreen(),
        ),
        GoRoute(
          path: 'device-assignment',
          builder: (context, state) => const DeviceAssignmentScreen(),
        ),
        GoRoute(
          path: 'profile',
          builder: (context, state) => const ProfileScreen(),
        ),
        GoRoute(
          path: 'about',
          builder: (context, state) => const AboutScreen(),
        ),
        GoRoute(
          path: 'products',
          builder: (context, state) => const ProductsScreen(),
        ),
        GoRoute(
          path: 'drone-detection',
          builder: (context, state) => const DroneDetectionScreen(),
        ),
      ],
    ),
  ],
  redirect: (BuildContext context, GoRouterState state) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final isLoggedIn = authProvider.isAuthenticated;
    final isLoggingIn = state.matchedLocation == '/login';
    final isSplash = state.matchedLocation == '/splash';

    if (!isLoggedIn && !isLoggingIn && !isSplash) {
      return '/login';
    }

    if (isLoggedIn && isLoggingIn) {
      return '/dashboard';
    }

    return null;
  },
);