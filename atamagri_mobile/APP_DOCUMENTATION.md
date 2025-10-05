# ATAMAGRI Mobile Application Documentation

## Overview
ATAMAGRI Mobile is a Flutter-based cross-platform mobile application that mirrors the functionality of the ATAMAGRI web platform (atamagri.app). This app provides farmers and agricultural professionals with real-time IoT monitoring, AI-powered recommendations, and comprehensive farm management tools.

## Tech Stack
- **Framework**: Flutter 3.35.1
- **Language**: Dart 3.9.0
- **State Management**: Provider
- **Backend**: Firebase
- **Navigation**: GoRouter
- **UI Components**: Material Design 3
- **Charts**: FL Chart & Syncfusion Charts
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database & Firestore
- **Cloud Storage**: Firebase Storage

## Features

### 1. Authentication & User Management
- **Login Screen** (`lib/screens/login_screen.dart`)
  - Email/password authentication
  - Social login integration
  - Password recovery
  - Remember me functionality

- **Profile Screen** (`lib/screens/profile_screen.dart`)
  - User profile management
  - Avatar upload
  - Personal information editing
  - Account settings

### 2. Main Dashboard
- **Dashboard Screen** (`lib/screens/dashboard_screen.dart`)
  - Real-time sensor data visualization
  - Quick stats overview
  - Weather information
  - Recent activity feed
  - Navigation to all features

### 3. IoT Monitoring
- **IoT Dashboard** (`lib/screens/iot_dashboard_screen.dart`)
  - Real-time sensor readings
  - Device status monitoring
  - Historical data charts
  - Alert notifications
  - Device control interface

### 4. Weather Monitoring
- **Weather Dashboard** (`lib/screens/weather_dashboard_screen.dart`)
  - Current weather conditions
  - 7-day forecast
  - Agricultural weather indicators
  - Precipitation tracking
  - Temperature trends

### 5. AI-Powered Features
- **AI Settings Screen** (`lib/screens/ai_settings_screen.dart`)
  - AI recommendation configuration
  - Crop prediction models
  - Disease detection settings
  - Irrigation optimization
  - Yield prediction

### 6. Device Management
- **Device Assignment Screen** (`lib/screens/device_assignment_screen.dart`)
  - Device registration
  - Field assignment
  - Device configuration
  - Maintenance scheduling
  - Performance monitoring

### 7. Drone Integration
- **Drone Detection Screen** (`lib/screens/drone_detection_screen.dart`)
  - Aerial surveillance controls
  - Flight path planning
  - Image capture and analysis
  - Field mapping
  - Crop health assessment

### 8. Products & Services
- **Products Screen** (`lib/screens/products_screen.dart`)
  - Product catalog
  - Service listings
  - Pricing information
  - Order management

### 9. About & Information
- **About Screen** (`lib/screens/about_screen.dart`)
  - Company information
  - Feature overview
  - Contact details
  - Support resources

## Project Structure

```
atamagri_mobile/
├── android/                 # Android-specific configuration
│   ├── app/
│   │   ├── build.gradle     # App-level build configuration
│   │   └── google-services.json  # Firebase configuration for Android
│   └── ...
├── lib/
│   ├── main.dart            # Application entry point
│   ├── screens/             # All screen widgets
│   │   ├── login_screen.dart
│   │   ├── dashboard_screen.dart
│   │   ├── iot_dashboard_screen.dart
│   │   ├── weather_dashboard_screen.dart
│   │   ├── ai_settings_screen.dart
│   │   ├── device_assignment_screen.dart
│   │   ├── drone_detection_screen.dart
│   │   ├── products_screen.dart
│   │   ├── profile_screen.dart
│   │   ├── about_screen.dart
│   │   └── splash_screen.dart
│   ├── providers/           # State management providers
│   │   ├── auth_provider.dart
│   │   ├── sensor_data_provider.dart
│   │   └── theme_provider.dart
│   ├── models/              # Data models
│   ├── services/            # API and service integrations
│   ├── widgets/             # Reusable widgets
│   ├── utils/               # Utility functions and helpers
│   │   └── theme.dart       # App theme configuration
│   └── config/              # App configuration
├── web/                     # Web-specific configuration
│   └── index.html           # Web app entry point with Firebase SDK
├── assets/                  # Static assets
│   ├── images/
│   ├── icons/
│   └── animations/
├── .env                     # Environment configuration
├── pubspec.yaml             # Flutter dependencies
└── README.md                # Basic project information
```

## Configuration

### Firebase Configuration
The app is configured to use the following Firebase project:
- **Project ID**: atamagri-iot
- **Database URL**: https://atamagri-iot-default-rtdb.asia-southeast1.firebasedatabase.app
- **Storage Bucket**: atamagri-iot.firebasestorage.app

### Environment Variables (.env)
```env
API_URL=https://atamagri-iot.web.app
WEBSOCKET_URL=wss://atamagri-iot.web.app
FIREBASE_PROJECT_ID=atamagri-iot
FIREBASE_API_KEY=[configured]
GOOGLE_AI_API_KEY=[configured for Gemini AI]
ENVIRONMENT=development
```

## Running the Application

### Prerequisites
1. Flutter SDK 3.35.1 or later
2. Android Studio with Android SDK
3. Android Emulator or physical device
4. Chrome browser (for web testing)

### Setup Instructions

1. **Install Dependencies**
```bash
cd atamagri_mobile
flutter pub get
```

2. **Run on Android Emulator**
```bash
# Start the emulator
flutter emulators --launch Medium_Phone_API_36.0

# Run the app
flutter run -d emulator-5554
```

3. **Run on Chrome (Web)**
```bash
flutter run -d chrome
```

4. **Build APK**
```bash
flutter build apk --release
```

5. **Build iOS** (Mac only)
```bash
flutter build ios --release
```

## Known Issues & Solutions

### 1. Gradle Build Issues
If you encounter Gradle wrapper corruption errors:
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
```

### 2. Firebase Initialization on Web
The web version requires proper Firebase SDK initialization in `web/index.html`. This has been configured with the necessary Firebase scripts.

### 3. Import Conflicts
Some screens may have import conflicts with Firebase packages. These have been resolved using import aliases (e.g., `import '...auth_provider.dart' as app_auth`).

## API Integrations

### Backend Services
- **Authentication**: Firebase Auth
- **Real-time Database**: Firebase Realtime Database
- **Document Storage**: Cloud Firestore
- **File Storage**: Firebase Storage
- **Push Notifications**: Firebase Cloud Messaging
- **AI Services**: Google Gemini AI API

### IoT Integration
- ESP32 sensor nodes
- Real-time data streaming via WebSocket
- MQTT protocol support
- Device management API

## Testing

### Running Tests
```bash
# Unit tests
flutter test

# Integration tests
flutter test integration_test

# Test coverage
flutter test --coverage
```

## Deployment

### Android
1. Update version in `pubspec.yaml`
2. Build release APK: `flutter build apk --release`
3. Sign APK with release key
4. Upload to Google Play Console

### iOS
1. Update version in `pubspec.yaml`
2. Build release: `flutter build ios --release`
3. Archive in Xcode
4. Upload to App Store Connect

### Web
1. Build for web: `flutter build web --release`
2. Deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```

## Maintenance & Updates

### Regular Tasks
- Update Flutter dependencies monthly
- Security patches as needed
- Firebase SDK updates
- Performance monitoring
- User feedback implementation

### Monitoring
- Firebase Analytics for user behavior
- Crashlytics for error tracking
- Performance monitoring
- Real-time database usage

## Support & Resources

### Documentation
- [Flutter Documentation](https://flutter.dev/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Material Design Guidelines](https://material.io/design)

### Contact
- Technical Support: support@atamagri.app
- Bug Reports: GitHub Issues
- Feature Requests: Feature request form in app

## License
Copyright © 2024 ATAMAGRI. All rights reserved.

---

## Version History

### v1.0.0 (Current)
- Initial release
- Complete feature parity with web application
- All screens implemented
- Firebase integration
- Real-time data synchronization
- AI recommendations
- Multi-language support ready

### Planned Features (v2.0.0)
- Offline mode with data sync
- Advanced analytics dashboard
- Voice commands
- AR crop inspection
- Blockchain integration for supply chain
- Multi-farm management