import 'dart:async';
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/drone.dart';

class DroneService {
  late final Dio _dio;
  final String _baseUrl;
  final StreamController<Drone> _droneStreamController = StreamController<Drone>.broadcast();
  Timer? _pollTimer;

  DroneService() : _baseUrl = dotenv.env['API_URL'] ?? 'http://localhost:5000' {
    _dio = Dio(BaseOptions(
      baseUrl: _baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));
  }

  Stream<Drone> get droneStream => _droneStreamController.stream;

  Future<List<Drone>> getDrones() async {
    try {
      final response = await _dio.get('/api/drones');
      final List<dynamic> data = response.data;
      return data.map((json) => Drone.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching drones: $e');
      return _getMockDrones();
    }
  }

  Future<Drone?> getDroneById(String droneId) async {
    try {
      final response = await _dio.get('/api/drones/$droneId');
      return Drone.fromJson(response.data);
    } catch (e) {
      print('Error fetching drone: $e');
      return _getMockDrone(droneId);
    }
  }

  Future<bool> sendCommand(String droneId, String command) async {
    try {
      final response = await _dio.post(
        '/api/drones/$droneId/command',
        data: {'command': command},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error sending command: $e');
      return false;
    }
  }

  Future<bool> takeoff(String droneId) async {
    return sendCommand(droneId, 'takeoff');
  }

  Future<bool> land(String droneId) async {
    return sendCommand(droneId, 'land');
  }

  Future<bool> returnToHome(String droneId) async {
    return sendCommand(droneId, 'return_to_home');
  }

  Future<bool> emergencyStop(String droneId) async {
    return sendCommand(droneId, 'emergency_stop');
  }

  Future<bool> moveUp(String droneId, double distance) async {
    try {
      final response = await _dio.post(
        '/api/drones/$droneId/move',
        data: {'direction': 'up', 'distance': distance},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error moving drone up: $e');
      return false;
    }
  }

  Future<bool> moveDown(String droneId, double distance) async {
    try {
      final response = await _dio.post(
        '/api/drones/$droneId/move',
        data: {'direction': 'down', 'distance': distance},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error moving drone down: $e');
      return false;
    }
  }

  Future<bool> moveForward(String droneId, double distance) async {
    try {
      final response = await _dio.post(
        '/api/drones/$droneId/move',
        data: {'direction': 'forward', 'distance': distance},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error moving drone forward: $e');
      return false;
    }
  }

  Future<bool> moveBackward(String droneId, double distance) async {
    try {
      final response = await _dio.post(
        '/api/drones/$droneId/move',
        data: {'direction': 'backward', 'distance': distance},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error moving drone backward: $e');
      return false;
    }
  }

  Future<bool> rotateLeft(String droneId, double angle) async {
    try {
      final response = await _dio.post(
        '/api/drones/$droneId/rotate',
        data: {'direction': 'left', 'angle': angle},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error rotating drone left: $e');
      return false;
    }
  }

  Future<bool> rotateRight(String droneId, double angle) async {
    try {
      final response = await _dio.post(
        '/api/drones/$droneId/rotate',
        data: {'direction': 'right', 'angle': angle},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error rotating drone right: $e');
      return false;
    }
  }

  Future<DroneMission?> createMission(DroneMission mission) async {
    try {
      final response = await _dio.post(
        '/api/missions',
        data: mission.toJson(),
      );
      return DroneMission.fromJson(response.data);
    } catch (e) {
      print('Error creating mission: $e');
      return null;
    }
  }

  Future<List<DroneMission>> getMissions() async {
    try {
      final response = await _dio.get('/api/missions');
      final List<dynamic> data = response.data;
      return data.map((json) => DroneMission.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching missions: $e');
      return _getMockMissions();
    }
  }

  Future<bool> startMission(String missionId) async {
    try {
      final response = await _dio.post('/api/missions/$missionId/start');
      return response.statusCode == 200;
    } catch (e) {
      print('Error starting mission: $e');
      return false;
    }
  }

  Future<bool> stopMission(String missionId) async {
    try {
      final response = await _dio.post('/api/missions/$missionId/stop');
      return response.statusCode == 200;
    } catch (e) {
      print('Error stopping mission: $e');
      return false;
    }
  }

  void startPolling(String droneId, Duration interval) {
    _pollTimer?.cancel();
    _pollTimer = Timer.periodic(interval, (_) async {
      final drone = await getDroneById(droneId);
      if (drone != null) {
        _droneStreamController.add(drone);
      }
    });
  }

  void stopPolling() {
    _pollTimer?.cancel();
  }

  Future<Map<String, dynamic>> getDroneVideo(String droneId) async {
    try {
      final response = await _dio.get('/api/drones/$droneId/video');
      return response.data;
    } catch (e) {
      print('Error getting drone video: $e');
      return {'url': '', 'status': 'offline'};
    }
  }

  void dispose() {
    _pollTimer?.cancel();
    _droneStreamController.close();
  }

  List<Drone> _getMockDrones() {
    return [
      Drone(
        id: 'drone1',
        name: 'AgriDrone X1',
        status: 'active',
        battery: 85,
        position: const DronePosition(
          latitude: -6.200000,
          longitude: 106.816666,
          altitude: 50,
          speed: 15,
          heading: 90,
        ),
        isConnected: true,
        lastSeen: DateTime.now().subtract(const Duration(minutes: 2)).toIso8601String(),
        metrics: const DroneMetrics(
          flightTime: 45,
          distance: 12.5,
          missionsCompleted: 3,
          areaCovered: 25.5,
        ),
      ),
      Drone(
        id: 'drone2',
        name: 'AgriDrone X2',
        status: 'idle',
        battery: 100,
        position: const DronePosition(
          latitude: -6.210000,
          longitude: 106.820000,
          altitude: 0,
          speed: 0,
          heading: 0,
        ),
        isConnected: true,
        lastSeen: DateTime.now().toIso8601String(),
        metrics: const DroneMetrics(
          flightTime: 120,
          distance: 45.2,
          missionsCompleted: 8,
          areaCovered: 85.3,
        ),
      ),
    ];
  }

  Drone? _getMockDrone(String droneId) {
    final drones = _getMockDrones();
    try {
      return drones.firstWhere((d) => d.id == droneId);
    } catch (e) {
      return null;
    }
  }

  List<DroneMission> _getMockMissions() {
    return [
      DroneMission(
        id: 'mission1',
        droneId: 'drone1',
        type: 'survey',
        status: 'active',
        startTime: DateTime.now().subtract(const Duration(hours: 1)),
        waypoints: const [
          DroneWaypoint(
            latitude: -6.200000,
            longitude: 106.816666,
            altitude: 50,
            order: 1,
            action: 'fly_to',
          ),
          DroneWaypoint(
            latitude: -6.201000,
            longitude: 106.817666,
            altitude: 50,
            order: 2,
            action: 'capture_image',
          ),
          DroneWaypoint(
            latitude: -6.202000,
            longitude: 106.818666,
            altitude: 50,
            order: 3,
            action: 'fly_to',
          ),
        ],
        parameters: const {
          'speed': 10,
          'capture_interval': 5,
        },
      ),
      DroneMission(
        id: 'mission2',
        droneId: 'drone2',
        type: 'spray',
        status: 'completed',
        startTime: DateTime.now().subtract(const Duration(days: 1)),
        endTime: DateTime.now().subtract(const Duration(hours: 20)),
        waypoints: const [
          DroneWaypoint(
            latitude: -6.210000,
            longitude: 106.820000,
            altitude: 30,
            order: 1,
            action: 'start_spray',
          ),
          DroneWaypoint(
            latitude: -6.211000,
            longitude: 106.821000,
            altitude: 30,
            order: 2,
            action: 'continue_spray',
          ),
          DroneWaypoint(
            latitude: -6.212000,
            longitude: 106.822000,
            altitude: 30,
            order: 3,
            action: 'stop_spray',
          ),
        ],
        parameters: const {
          'spray_rate': 2.5,
          'chemical_type': 'pesticide',
        },
      ),
    ];
  }
}