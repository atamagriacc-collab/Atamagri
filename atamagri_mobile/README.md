# ATAMAGRI Mobile Application

## Overview
ATAMAGRI Mobile is a Flutter-based Android application for smart agriculture IoT monitoring and control. The app provides real-time monitoring of weather stations, drone detection and control, AI-powered recommendations, and comprehensive farm management tools.

## Features

### Core Features
- **Weather Station Monitoring**: Real-time weather data tracking and analysis
- **Drone Detection & Control**: Live drone tracking, mission planning, and control interface
- **IoT Dashboard**: Monitor and control all connected IoT devices
- **AI Recommendations**: Smart farming suggestions powered by Google AI
- **Product Marketplace**: Browse and purchase agricultural products and packages
- **User Authentication**: Secure login with Firebase Authentication
- **Real-time Notifications**: Push notifications for alerts and updates

### Technical Features
- Offline data caching and synchronization
- Real-time data updates via WebSocket
- Google Maps integration for field mapping
- Multi-language support
- Dark/Light theme support

## Prerequisites
- Flutter SDK (>=3.0.0 <4.0.0)
- Android Studio or VS Code with Flutter extension
- Android SDK (minimum API level 21)
- Firebase project setup
- Google Maps API key

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ATAMAGRI-V2.git
cd ATAMAGRI-V2/atamagri_mobile
```

### 2. Install dependencies
```bash
flutter pub get
```

### 3. Configure environment variables
1. Copy `.env.example` to `.env`
```bash
cp .env.example .env
```
2. Update the `.env` file with your API keys and configuration

### 4. Firebase setup
1. Create a new Firebase project at https://console.firebase.google.com
2. Add an Android app with package name: `com.atamagri.mobile`
3. Download `google-services.json` and place it in `android/app/`
4. Enable required Firebase services:
   - Authentication
   - Cloud Firestore
   - Realtime Database
   - Cloud Storage
   - Cloud Messaging

### 5. Google Maps setup
1. Get a Google Maps API key from Google Cloud Console
2. Add the key to `android/local.properties`:
```
maps.api.key=YOUR_GOOGLE_MAPS_API_KEY
```

## Running the App

### Development
```bash
flutter run
```

### Build for different flavors
```bash
# Development build
flutter run --flavor dev -t lib/main.dart

# Staging build
flutter run --flavor staging -t lib/main.dart

# Production build
flutter run --flavor prod -t lib/main.dart
```

### Build APK
```bash
# Debug APK
flutter build apk --debug

# Release APK
flutter build apk --release

# Split APKs by ABI
flutter build apk --split-per-abi
```

### Build App Bundle (for Google Play)
```bash
flutter build appbundle --release
```

## Project Structure
```
lib/
├── config/          # App configuration files
├── constants/       # Constants and enums
├── models/          # Data models
├── providers/       # State management providers
├── screens/         # App screens/pages
├── services/        # API and external services
├── utils/           # Utility functions
├── widgets/         # Reusable widgets
└── main.dart        # App entry point

android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml
│   │       └── kotlin/
│   ├── build.gradle
│   └── google-services.json
├── build.gradle
└── settings.gradle
```

## State Management
The app uses Provider for state management with the following providers:
- `AuthProvider`: User authentication state
- `SensorDataProvider`: IoT sensor data management
- `ThemeProvider`: App theme management

## API Integration
The app connects to the ATAMAGRI backend API for:
- User authentication
- Sensor data retrieval
- Drone control commands
- AI recommendations
- Product information

## Testing

### Unit Tests
```bash
flutter test
```

### Widget Tests
```bash
flutter test test/widget_test.dart
```

### Integration Tests
```bash
flutter drive --target=test_driver/app.dart
```

## Troubleshooting

### Common Issues

1. **Build fails with "SDK not found"**
   - Ensure Flutter SDK is properly installed
   - Run `flutter doctor` to check installation

2. **Google Maps not showing**
   - Verify Google Maps API key is correctly set
   - Check API key restrictions in Google Cloud Console

3. **Firebase connection issues**
   - Ensure `google-services.json` is in the correct location
   - Verify Firebase project configuration

4. **App crashes on startup**
   - Check if all required permissions are granted
   - Verify `.env` file is properly configured

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Security
- Never commit API keys or sensitive data
- Use environment variables for configuration
- Enable ProGuard for release builds
- Implement certificate pinning for production

## Performance Optimization
- Images are cached using `cached_network_image`
- Lazy loading for lists and grids
- Code splitting for better initial load time
- Background services for data sync

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For issues and questions:
- Create an issue in the GitHub repository
- Contact support at support@atamagri.com

## Acknowledgments
- Flutter team for the amazing framework
- Firebase for backend services
- Google Maps for mapping services
- OpenWeather for weather data
- All contributors to this project