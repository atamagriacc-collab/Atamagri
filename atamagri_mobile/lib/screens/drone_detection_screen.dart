import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../models/drone.dart';
import '../widgets/drone_control_panel.dart';
import '../services/drone_service.dart';

class DroneDetectionScreen extends StatefulWidget {
  const DroneDetectionScreen({super.key});

  @override
  State<DroneDetectionScreen> createState() => _DroneDetectionScreenState();
}

class _DroneDetectionScreenState extends State<DroneDetectionScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  GoogleMapController? _mapController;
  final DroneService _droneService = DroneService();

  final Set<Marker> _markers = {};
  final Set<Polyline> _polylines = {};
  final List<LatLng> _missionPath = [];

  Drone? _selectedDrone;
  bool _isPlanning = false;
  bool _isLiveTracking = false;

  static const LatLng _initialPosition = LatLng(-6.200000, 106.816666);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadDrones();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _loadDrones() {
    setState(() {
      _markers.add(
        Marker(
          markerId: const MarkerId('drone1'),
          position: _initialPosition,
          infoWindow: const InfoWindow(
            title: 'AgriDrone X1',
            snippet: 'Battery: 85% | Status: Active',
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(
            BitmapDescriptor.hueGreen,
          ),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Drone Detection & Control'),
        centerTitle: true,
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(icon: Icon(Icons.map), text: 'Map View'),
            Tab(icon: Icon(Icons.flight), text: 'Drones'),
            Tab(icon: Icon(Icons.route), text: 'Missions'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildMapView(),
          _buildDronesList(),
          _buildMissionsView(),
        ],
      ),
      floatingActionButton: _buildFAB(),
    );
  }

  Widget _buildMapView() {
    return Stack(
      children: [
        GoogleMap(
          initialCameraPosition: const CameraPosition(
            target: _initialPosition,
            zoom: 14,
          ),
          markers: _markers,
          polylines: _polylines,
          mapType: MapType.satellite,
          onMapCreated: (controller) {
            _mapController = controller;
          },
          onTap: _isPlanning ? _addWaypoint : null,
        ),
        Positioned(
          top: 16,
          left: 16,
          right: 16,
          child: _buildMapControls(),
        ),
        if (_selectedDrone != null)
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: DroneControlPanel(
              drone: _selectedDrone!,
              onCommand: (command) {
                _sendDroneCommand(command);
              },
            ),
          ),
      ],
    );
  }

  Widget _buildMapControls() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Field Monitoring',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _isLiveTracking ? 'Live Tracking Active' : 'Select a drone to track',
                    style: TextStyle(
                      fontSize: 12,
                      color: _isLiveTracking ? Colors.green : Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            Row(
              children: [
                IconButton(
                  icon: Icon(
                    _isPlanning ? Icons.check : Icons.add_location,
                    color: _isPlanning ? Colors.green : null,
                  ),
                  onPressed: () {
                    setState(() {
                      _isPlanning = !_isPlanning;
                      if (!_isPlanning && _missionPath.isNotEmpty) {
                        _createMissionPolyline();
                      }
                    });
                  },
                  tooltip: _isPlanning ? 'Finish Planning' : 'Plan Mission',
                ),
                IconButton(
                  icon: const Icon(Icons.layers),
                  onPressed: _toggleMapType,
                  tooltip: 'Change Map Type',
                ),
                IconButton(
                  icon: Icon(
                    _isLiveTracking ? Icons.stop : Icons.play_arrow,
                    color: _isLiveTracking ? Colors.red : Colors.green,
                  ),
                  onPressed: _toggleLiveTracking,
                  tooltip: _isLiveTracking ? 'Stop Tracking' : 'Start Tracking',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDronesList() {
    final drones = [
      const Drone(
        id: 'drone1',
        name: 'AgriDrone X1',
        status: 'active',
        battery: 85,
        position: DronePosition(
          latitude: -6.200000,
          longitude: 106.816666,
          altitude: 50,
          speed: 15,
          heading: 90,
        ),
        isConnected: true,
        lastSeen: '2 minutes ago',
        metrics: DroneMetrics(
          flightTime: 45,
          distance: 12.5,
          missionsCompleted: 3,
          areaCovered: 25.5,
        ),
      ),
      const Drone(
        id: 'drone2',
        name: 'AgriDrone X2',
        status: 'idle',
        battery: 100,
        position: DronePosition(
          latitude: -6.210000,
          longitude: 106.820000,
          altitude: 0,
          speed: 0,
          heading: 0,
        ),
        isConnected: true,
        lastSeen: 'Just now',
        metrics: DroneMetrics(
          flightTime: 120,
          distance: 45.2,
          missionsCompleted: 8,
          areaCovered: 85.3,
        ),
      ),
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: drones.length,
      itemBuilder: (context, index) {
        final drone = drones[index];
        return _buildDroneCard(drone);
      },
    );
  }

  Widget _buildDroneCard(Drone drone) {
    final statusColor = drone.status == 'active'
        ? Colors.green
        : drone.status == 'idle'
            ? Colors.orange
            : Colors.red;

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () {
          setState(() {
            _selectedDrone = drone;
          });
          _tabController.animateTo(0);
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.flight,
                    color: statusColor,
                    size: 32,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          drone.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: statusColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                drone.status.toUpperCase(),
                                style: TextStyle(
                                  fontSize: 12,
                                  color: statusColor,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Icon(
                              drone.isConnected ? Icons.wifi : Icons.wifi_off,
                              size: 16,
                              color: drone.isConnected ? Colors.green : Colors.red,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              drone.lastSeen,
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Row(
                        children: [
                          Icon(
                            _getBatteryIcon(drone.battery),
                            color: _getBatteryColor(drone.battery),
                            size: 20,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${drone.battery.toInt()}%',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: _getBatteryColor(drone.battery),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildMetricItem(
                    Icons.timer,
                    '${drone.metrics.flightTime.toInt()} min',
                    'Flight Time',
                  ),
                  _buildMetricItem(
                    Icons.straighten,
                    '${drone.metrics.distance.toStringAsFixed(1)} km',
                    'Distance',
                  ),
                  _buildMetricItem(
                    Icons.task_alt,
                    '${drone.metrics.missionsCompleted}',
                    'Missions',
                  ),
                  _buildMetricItem(
                    Icons.terrain,
                    '${drone.metrics.areaCovered.toStringAsFixed(1)} ha',
                    'Area',
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _showDroneDetails(drone),
                      icon: const Icon(Icons.info_outline),
                      label: const Text('Details'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: drone.status == 'idle'
                          ? () => _startMission(drone)
                          : () => _stopMission(drone),
                      icon: Icon(
                        drone.status == 'idle' ? Icons.play_arrow : Icons.stop,
                      ),
                      label: Text(
                        drone.status == 'idle' ? 'Start' : 'Stop',
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricItem(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, size: 20, color: Colors.grey[600]),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildMissionsView() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: ListTile(
            leading: const Icon(Icons.agriculture, color: Colors.green),
            title: const Text('Crop Health Survey'),
            subtitle: const Text('Scheduled: Today, 2:00 PM'),
            trailing: const Icon(Icons.arrow_forward),
            onTap: () => context.push('/drone-missions/crop-health'),
          ),
        ),
        const SizedBox(height: 8),
        Card(
          child: ListTile(
            leading: const Icon(Icons.water_drop, color: Colors.blue),
            title: const Text('Irrigation Monitoring'),
            subtitle: const Text('Scheduled: Tomorrow, 8:00 AM'),
            trailing: const Icon(Icons.arrow_forward),
            onTap: () => context.push('/drone-missions/irrigation'),
          ),
        ),
        const SizedBox(height: 8),
        Card(
          child: ListTile(
            leading: const Icon(Icons.bug_report, color: Colors.orange),
            title: const Text('Pest Detection'),
            subtitle: const Text('Completed: Yesterday'),
            trailing: const Icon(Icons.check_circle, color: Colors.green),
            onTap: () => context.push('/drone-missions/pest-detection'),
          ),
        ),
        const SizedBox(height: 24),
        ElevatedButton.icon(
          onPressed: _createNewMission,
          icon: const Icon(Icons.add),
          label: const Text('Create New Mission'),
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.all(16),
          ),
        ),
      ],
    );
  }

  Widget? _buildFAB() {
    if (_tabController.index == 0 && _isPlanning) {
      return FloatingActionButton.extended(
        onPressed: _clearMissionPath,
        icon: const Icon(Icons.clear),
        label: const Text('Clear Path'),
        backgroundColor: Colors.red,
      );
    }
    return null;
  }

  void _toggleMapType() {
    // Implementation for toggling map type
  }

  void _toggleLiveTracking() {
    setState(() {
      _isLiveTracking = !_isLiveTracking;
    });
  }

  void _addWaypoint(LatLng point) {
    setState(() {
      _missionPath.add(point);
      _markers.add(
        Marker(
          markerId: MarkerId('waypoint_${_missionPath.length}'),
          position: point,
          icon: BitmapDescriptor.defaultMarkerWithHue(
            BitmapDescriptor.hueBlue,
          ),
        ),
      );
    });
  }

  void _createMissionPolyline() {
    setState(() {
      _polylines.add(
        Polyline(
          polylineId: const PolylineId('mission_path'),
          points: _missionPath,
          color: Colors.blue,
          width: 3,
        ),
      );
    });
  }

  void _clearMissionPath() {
    setState(() {
      _missionPath.clear();
      _polylines.clear();
      _markers.removeWhere((marker) =>
          marker.markerId.value.startsWith('waypoint_'));
    });
  }

  void _sendDroneCommand(String command) {
    // Implementation for sending drone commands
  }

  void _showDroneDetails(Drone drone) {
    // Implementation for showing drone details
  }

  void _startMission(Drone drone) {
    // Implementation for starting mission
  }

  void _stopMission(Drone drone) {
    // Implementation for stopping mission
  }

  void _createNewMission() {
    context.push('/drone-missions/new');
  }

  IconData _getBatteryIcon(double battery) {
    if (battery > 80) return Icons.battery_full;
    if (battery > 50) return Icons.battery_5_bar;
    if (battery > 20) return Icons.battery_3_bar;
    return Icons.battery_1_bar;
  }

  Color _getBatteryColor(double battery) {
    if (battery > 50) return Colors.green;
    if (battery > 20) return Colors.orange;
    return Colors.red;
  }
}