import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:firebase_database/firebase_database.dart';
import '../models/sensor_data.dart';

class SensorDataProvider extends ChangeNotifier {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  List<SensorData> _sensorDataList = [];
  SensorData? _latestReading;
  Map<String, Device> _devices = {};
  bool _isLoading = false;
  String? _errorMessage;
  StreamSubscription? _sensorDataSubscription;
  StreamSubscription? _devicesSubscription;

  List<SensorData> get sensorDataList => _sensorDataList;
  SensorData? get latestReading => _latestReading;
  Map<String, Device> get devices => _devices;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  List<SensorData> get last10Readings {
    if (_sensorDataList.length <= 10) return _sensorDataList;
    return _sensorDataList.sublist(0, 10);
  }

  List<SensorData> get last100Readings {
    if (_sensorDataList.length <= 100) return _sensorDataList;
    return _sensorDataList.sublist(0, 100);
  }

  double get averageTemperature {
    if (_sensorDataList.isEmpty) return 0;
    final sum = _sensorDataList.fold(0.0, (sum, data) => sum + data.temperatureC);
    return sum / _sensorDataList.length;
  }

  double get averageHumidity {
    if (_sensorDataList.isEmpty) return 0;
    final sum = _sensorDataList.fold(0.0, (sum, data) => sum + data.humidityPercent);
    return sum / _sensorDataList.length;
  }

  double get totalRainfall {
    if (_sensorDataList.isEmpty) return 0;
    return _sensorDataList.fold(0.0, (sum, data) => sum + data.rainrateMMH);
  }

  double get averageWindSpeed {
    if (_sensorDataList.isEmpty) return 0;
    final sum = _sensorDataList.fold(0.0, (sum, data) => sum + data.windKmh);
    return sum / _sensorDataList.length;
  }

  double get totalSolarPower {
    if (_sensorDataList.isEmpty) return 0;
    return _sensorDataList.fold(0.0, (sum, data) => sum + data.solPowerW);
  }

  SensorDataProvider() {
    _initializeListeners();
  }

  void _initializeListeners() {
    _listenToSensorData();
    _listenToDevices();
  }

  void _listenToSensorData() {
    _setLoading(true);

    _sensorDataSubscription = _database
        .child('sensor_data')
        .orderByChild('timestamp')
        .limitToLast(100)
        .onValue
        .listen((DatabaseEvent event) {
      if (event.snapshot.value != null) {
        final Map<dynamic, dynamic> data = event.snapshot.value as Map<dynamic, dynamic>;

        _sensorDataList = data.entries.map((entry) {
          final Map<String, dynamic> sensorMap = Map<String, dynamic>.from(entry.value);
          return SensorData.fromJson(sensorMap);
        }).toList()
          ..sort((a, b) => b.dateTime.compareTo(a.dateTime));

        if (_sensorDataList.isNotEmpty) {
          _latestReading = _sensorDataList.first;
        }

        _setLoading(false);
        notifyListeners();
      } else {
        _sensorDataList = [];
        _latestReading = null;
        _setLoading(false);
        notifyListeners();
      }
    }, onError: (error) {
      _setError('Failed to load sensor data: ${error.toString()}');
      _setLoading(false);
    });

    _database.child('latest_reading').onValue.listen((DatabaseEvent event) {
      if (event.snapshot.value != null) {
        final Map<String, dynamic> data = Map<String, dynamic>.from(event.snapshot.value as Map);
        _latestReading = SensorData.fromJson(data);
        notifyListeners();
      }
    });
  }

  void _listenToDevices() {
    _devicesSubscription = _database
        .child('devices')
        .onValue
        .listen((DatabaseEvent event) {
      if (event.snapshot.value != null) {
        final Map<dynamic, dynamic> data = event.snapshot.value as Map<dynamic, dynamic>;

        _devices = {};
        data.forEach((key, value) {
          final Map<String, dynamic> deviceMap = Map<String, dynamic>.from(value);
          deviceMap['id'] = key.toString();
          deviceMap['name'] = deviceMap['name'] ?? key.toString();
          _devices[key.toString()] = Device.fromJson(deviceMap);
        });

        notifyListeners();
      }
    }, onError: (error) {
      debugPrint('Error loading devices: $error');
    });
  }

  List<SensorData> getDataForDevice(String deviceId) {
    return _sensorDataList.where((data) => data.deviceId == deviceId).toList();
  }

  List<SensorData> getDataInTimeRange(DateTime start, DateTime end) {
    return _sensorDataList.where((data) {
      return data.dateTime.isAfter(start) && data.dateTime.isBefore(end);
    }).toList();
  }

  Map<String, dynamic> getStatisticsForDevice(String deviceId) {
    final deviceData = getDataForDevice(deviceId);
    if (deviceData.isEmpty) {
      return {
        'avgTemperature': 0.0,
        'avgHumidity': 0.0,
        'avgWindSpeed': 0.0,
        'totalRainfall': 0.0,
        'avgSolarPower': 0.0,
        'dataPoints': 0,
      };
    }

    return {
      'avgTemperature': deviceData.fold(0.0, (sum, d) => sum + d.temperatureC) / deviceData.length,
      'avgHumidity': deviceData.fold(0.0, (sum, d) => sum + d.humidityPercent) / deviceData.length,
      'avgWindSpeed': deviceData.fold(0.0, (sum, d) => sum + d.windKmh) / deviceData.length,
      'totalRainfall': deviceData.fold(0.0, (sum, d) => sum + d.rainrateMMH),
      'avgSolarPower': deviceData.fold(0.0, (sum, d) => sum + d.solPowerW) / deviceData.length,
      'dataPoints': deviceData.length,
    };
  }

  Future<void> refreshData() async {
    _setLoading(true);

    try {
      final sensorSnapshot = await _database.child('sensor_data')
          .orderByChild('timestamp')
          .limitToLast(100)
          .get();

      if (sensorSnapshot.value != null) {
        final Map<dynamic, dynamic> data = sensorSnapshot.value as Map<dynamic, dynamic>;

        _sensorDataList = data.entries.map((entry) {
          final Map<String, dynamic> sensorMap = Map<String, dynamic>.from(entry.value);
          return SensorData.fromJson(sensorMap);
        }).toList()
          ..sort((a, b) => b.dateTime.compareTo(a.dateTime));

        if (_sensorDataList.isNotEmpty) {
          _latestReading = _sensorDataList.first;
        }
      }

      final devicesSnapshot = await _database.child('devices').get();
      if (devicesSnapshot.value != null) {
        final Map<dynamic, dynamic> data = devicesSnapshot.value as Map<dynamic, dynamic>;

        _devices = {};
        data.forEach((key, value) {
          final Map<String, dynamic> deviceMap = Map<String, dynamic>.from(value);
          deviceMap['id'] = key.toString();
          deviceMap['name'] = deviceMap['name'] ?? key.toString();
          _devices[key.toString()] = Device.fromJson(deviceMap);
        });
      }

      _setLoading(false);
      notifyListeners();
    } catch (e) {
      _setError('Failed to refresh data: ${e.toString()}');
      _setLoading(false);
    }
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String message) {
    _errorMessage = message;
    notifyListeners();
  }

  @override
  void dispose() {
    _sensorDataSubscription?.cancel();
    _devicesSubscription?.cancel();
    super.dispose();
  }
}