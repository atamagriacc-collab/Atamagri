import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/sensor_data.dart';
import '../models/weather_data.dart';
import '../models/farm.dart';
import '../models/device.dart';
import '../models/ai_recommendation.dart';

class ApiService {
  late Dio _dio;
  static String? _authToken;

  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  ApiService._internal() {
    _initializeDio();
  }

  void _initializeDio() {
    _dio = Dio(BaseOptions(
      baseUrl: dotenv.env['API_BASE_URL'] ?? 'https://atamagri-v2.vercel.app/api',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        if (_authToken != null) {
          options.headers['Authorization'] = 'Bearer $_authToken';
        }
        handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          _handleUnauthorized();
        }
        handler.next(error);
      },
    ));

    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));
  }

  void setAuthToken(String token) {
    _authToken = token;
  }

  void clearAuthToken() {
    _authToken = null;
  }

  Future<void> _handleUnauthorized() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _authToken = null;
  }

  // Authentication APIs
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String name,
    required String farmName,
  }) async {
    try {
      final response = await _dio.post('/auth/register', data: {
        'email': email,
        'password': password,
        'name': name,
        'farmName': farmName,
      });
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post('/auth/logout');
    } catch (e) {
      // Silent fail for logout
    } finally {
      clearAuthToken();
    }
  }

  // Sensor Data APIs
  Future<List<SensorData>> getSensorData({
    String? deviceId,
    String? sensorType,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (deviceId != null) queryParams['deviceId'] = deviceId;
      if (sensorType != null) queryParams['sensorType'] = sensorType;
      if (startDate != null) queryParams['startDate'] = startDate.toIso8601String();
      if (endDate != null) queryParams['endDate'] = endDate.toIso8601String();

      final response = await _dio.get('/sensor-data', queryParameters: queryParams);

      return (response.data['data'] as List)
          .map((json) => SensorData.fromJson(json))
          .toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<SensorData> getLatestSensorData(String deviceId) async {
    try {
      final response = await _dio.get('/sensor-data/$deviceId/latest');
      return SensorData.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getSensorStatistics({
    String? deviceId,
    String? period,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (deviceId != null) queryParams['deviceId'] = deviceId;
      if (period != null) queryParams['period'] = period;

      final response = await _dio.get('/sensor-data/statistics', queryParameters: queryParams);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Weather APIs
  Future<WeatherData> getCurrentWeather({double? lat, double? lon}) async {
    try {
      final queryParams = <String, dynamic>{};
      if (lat != null) queryParams['lat'] = lat;
      if (lon != null) queryParams['lon'] = lon;

      final response = await _dio.get('/weather/current', queryParameters: queryParams);
      return WeatherData.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<WeatherData>> getWeatherForecast({
    double? lat,
    double? lon,
    int days = 7,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'days': days,
      };
      if (lat != null) queryParams['lat'] = lat;
      if (lon != null) queryParams['lon'] = lon;

      final response = await _dio.get('/weather/forecast', queryParameters: queryParams);

      return (response.data['data'] as List)
          .map((json) => WeatherData.fromJson(json))
          .toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Farm Management APIs
  Future<List<Farm>> getFarms() async {
    try {
      final response = await _dio.get('/farms');
      return (response.data['data'] as List)
          .map((json) => Farm.fromJson(json))
          .toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Farm> getFarmDetails(String farmId) async {
    try {
      final response = await _dio.get('/farms/$farmId');
      return Farm.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Farm> createFarm(Map<String, dynamic> farmData) async {
    try {
      final response = await _dio.post('/farms', data: farmData);
      return Farm.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Farm> updateFarm(String farmId, Map<String, dynamic> farmData) async {
    try {
      final response = await _dio.put('/farms/$farmId', data: farmData);
      return Farm.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> deleteFarm(String farmId) async {
    try {
      await _dio.delete('/farms/$farmId');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Device Management APIs
  Future<List<Device>> getDevices() async {
    try {
      final response = await _dio.get('/devices');
      return (response.data['data'] as List)
          .map((json) => Device.fromJson(json))
          .toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Device> getDeviceDetails(String deviceId) async {
    try {
      final response = await _dio.get('/devices/$deviceId');
      return Device.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Device> registerDevice(Map<String, dynamic> deviceData) async {
    try {
      final response = await _dio.post('/devices/register', data: deviceData);
      return Device.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Device> updateDevice(String deviceId, Map<String, dynamic> deviceData) async {
    try {
      final response = await _dio.put('/devices/$deviceId', data: deviceData);
      return Device.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> assignDeviceToFarm(String deviceId, String farmId) async {
    try {
      await _dio.post('/devices/$deviceId/assign', data: {
        'farmId': farmId,
      });
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> deleteDevice(String deviceId) async {
    try {
      await _dio.delete('/devices/$deviceId');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // AI Recommendations APIs
  Future<List<AIRecommendation>> getAIRecommendations({
    String? farmId,
    String? category,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (farmId != null) queryParams['farmId'] = farmId;
      if (category != null) queryParams['category'] = category;

      final response = await _dio.get('/ai-recommendations', queryParameters: queryParams);

      return (response.data['data'] as List)
          .map((json) => AIRecommendation.fromJson(json))
          .toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<AIRecommendation> generateAIRecommendation(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/ai-recommendations/generate', data: data);
      return AIRecommendation.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> analyzeImage(String imagePath) async {
    try {
      FormData formData = FormData.fromMap({
        'image': await MultipartFile.fromFile(imagePath),
      });

      final response = await _dio.post('/ai-recommendations/analyze-image', data: formData);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // IoT Endpoint
  Future<void> sendIoTData(Map<String, dynamic> data) async {
    try {
      await _dio.post('/iot/data', data: data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Error Handler
  String _handleError(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return 'Connection timeout. Please check your internet connection.';
        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode;
          final message = error.response?.data['message'] ?? 'An error occurred';

          if (statusCode == 401) {
            return 'Authentication failed. Please login again.';
          } else if (statusCode == 404) {
            return 'Resource not found.';
          } else if (statusCode == 500) {
            return 'Server error. Please try again later.';
          }
          return message;
        case DioExceptionType.cancel:
          return 'Request was cancelled.';
        case DioExceptionType.unknown:
          return 'No internet connection.';
        default:
          return 'An unexpected error occurred.';
      }
    }
    return 'An unexpected error occurred.';
  }
}