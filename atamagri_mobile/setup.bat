@echo off
echo ========================================
echo ATAMAGRI Mobile App Setup
echo ========================================
echo.
echo Flutter is required to build and run this app.
echo.
echo Please install Flutter first:
echo 1. Download Flutter SDK from: https://flutter.dev/docs/get-started/install/windows
echo 2. Extract to C:\flutter (or your preferred location)
echo 3. Add Flutter\bin to your PATH environment variable
echo 4. Run 'flutter doctor' to verify installation
echo.
echo After Flutter is installed, run these commands:
echo   flutter pub get
echo   flutter run
echo.
echo ========================================
echo Current Project Structure:
echo ========================================
echo.
dir /b /s lib\*.dart 2>nul | find /c ".dart" >temp.txt
set /p DART_COUNT=<temp.txt
del temp.txt
echo Found %DART_COUNT% Dart files in the project
echo.
echo Key Features Implemented:
echo - Product Marketplace
echo - Drone Detection and Control
echo - Weather Station Monitoring
echo - IoT Dashboard
echo - AI Recommendations
echo - User Authentication
echo.
echo ========================================
pause