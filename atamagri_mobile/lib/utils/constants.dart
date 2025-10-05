import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF2E7D32);
  static const Color primaryDark = Color(0xFF1B5E20);
  static const Color primaryLight = Color(0xFF66BB6A);
  static const Color secondary = Color(0xFFFFC107);
  static const Color accent = Color(0xFF03A9F4);

  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFF9800);
  static const Color error = Color(0xFFF44336);
  static const Color info = Color(0xFF2196F3);

  static const Color background = Color(0xFFF5F5F5);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);

  static const Map<String, Color> sensorColors = {
    'temperature': Color(0xFFFF6B6B),
    'humidity': Color(0xFF4ECDC4),
    'wind': Color(0xFF95E1D3),
    'rain': Color(0xFF5C7CFA),
    'light': Color(0xFFFFA502),
    'solar': Color(0xFF00B894),
  };
}

class AppStrings {
  static const String appName = 'ATAMAGRI';
  static const String tagline = 'Smart Agriculture IoT Solution';

  static const String welcomeMessage = 'Welcome to ATAMAGRI';
  static const String loginPrompt = 'Sign in to continue';
  static const String signupPrompt = 'Create your account';

  static const String emailHint = 'Enter your email';
  static const String passwordHint = 'Enter your password';
  static const String nameHint = 'Enter your full name';

  static const String noDataMessage = 'No sensor data available';
  static const String loadingMessage = 'Loading...';
  static const String errorMessage = 'Something went wrong';
  static const String retryMessage = 'Tap to retry';
}

class AppConfig {
  static const Duration dataRefreshInterval = Duration(seconds: 30);
  static const Duration connectionTimeout = Duration(seconds: 10);
  static const int maxDataPoints = 100;
  static const int maxChartPoints = 24;

  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;

  static const double borderRadius = 12.0;
  static const double cardElevation = 2.0;
}