import 'package:flutter/material.dart';
import '../models/drone.dart';

class DroneControlPanel extends StatelessWidget {
  final Drone drone;
  final Function(String) onCommand;

  const DroneControlPanel({
    super.key,
    required this.drone,
    required this.onCommand,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      elevation: 8,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  drone.name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor(drone.status).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    drone.status.toUpperCase(),
                    style: TextStyle(
                      color: _getStatusColor(drone.status),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildStatusItem(
                  Icons.speed,
                  '${drone.position.speed.toStringAsFixed(1)} m/s',
                  'Speed',
                ),
                _buildStatusItem(
                  Icons.height,
                  '${drone.position.altitude.toStringAsFixed(0)} m',
                  'Altitude',
                ),
                _buildStatusItem(
                  Icons.battery_charging_full,
                  '${drone.battery.toInt()}%',
                  'Battery',
                ),
                _buildStatusItem(
                  Icons.navigation,
                  '${drone.position.heading.toInt()}°',
                  'Heading',
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildControlButton(
                  Icons.flight_takeoff,
                  'Takeoff',
                  () => onCommand('takeoff'),
                  theme.primaryColor,
                ),
                _buildControlButton(
                  Icons.flight_land,
                  'Land',
                  () => onCommand('land'),
                  Colors.orange,
                ),
                _buildControlButton(
                  Icons.home,
                  'RTH',
                  () => onCommand('return_to_home'),
                  Colors.blue,
                ),
                _buildControlButton(
                  Icons.emergency,
                  'Stop',
                  () => onCommand('emergency_stop'),
                  Colors.red,
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              height: 120,
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: _buildJoystick(
                      'Movement',
                      onCommand,
                      ['up', 'down', 'left', 'right'],
                    ),
                  ),
                  const VerticalDivider(),
                  Expanded(
                    child: _buildJoystick(
                      'Rotation',
                      onCommand,
                      ['ascend', 'descend', 'rotate_left', 'rotate_right'],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusItem(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, size: 20, color: Colors.grey[700]),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
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

  Widget _buildControlButton(
    IconData icon,
    String label,
    VoidCallback onPressed,
    Color color,
  ) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: color,
            shape: const CircleBorder(),
            padding: const EdgeInsets.all(12),
          ),
          child: Icon(
            icon,
            color: Colors.white,
            size: 24,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildJoystick(
    String label,
    Function(String) onCommand,
    List<String> commands,
  ) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: Stack(
            alignment: Alignment.center,
            children: [
              Positioned(
                top: 0,
                child: IconButton(
                  onPressed: () => onCommand(commands[0]),
                  icon: const Icon(Icons.arrow_drop_up, size: 32),
                  padding: EdgeInsets.zero,
                ),
              ),
              Positioned(
                bottom: 0,
                child: IconButton(
                  onPressed: () => onCommand(commands[1]),
                  icon: const Icon(Icons.arrow_drop_down, size: 32),
                  padding: EdgeInsets.zero,
                ),
              ),
              Positioned(
                left: 0,
                child: IconButton(
                  onPressed: () => onCommand(commands[2]),
                  icon: const Icon(Icons.arrow_left, size: 32),
                  padding: EdgeInsets.zero,
                ),
              ),
              Positioned(
                right: 0,
                child: IconButton(
                  onPressed: () => onCommand(commands[3]),
                  icon: const Icon(Icons.arrow_right, size: 32),
                  padding: EdgeInsets.zero,
                ),
              ),
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: Colors.grey[400],
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'active':
        return Colors.green;
      case 'idle':
        return Colors.orange;
      case 'error':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}