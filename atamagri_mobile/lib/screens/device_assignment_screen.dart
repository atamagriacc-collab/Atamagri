import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class DeviceAssignmentScreen extends StatefulWidget {
  const DeviceAssignmentScreen({super.key});

  @override
  State<DeviceAssignmentScreen> createState() => _DeviceAssignmentScreenState();
}

class _DeviceAssignmentScreenState extends State<DeviceAssignmentScreen> {
  final List<Device> _devices = [
    Device(id: 'DEV001', name: 'Soil Sensor A1', type: 'Soil Moisture', status: 'Active', farm: 'North Field'),
    Device(id: 'DEV002', name: 'Weather Station W1', type: 'Weather', status: 'Active', farm: 'Main Farm'),
    Device(id: 'DEV003', name: 'pH Sensor P1', type: 'pH Level', status: 'Inactive', farm: 'Unassigned'),
    Device(id: 'DEV004', name: 'Temperature Sensor T1', type: 'Temperature', status: 'Active', farm: 'Greenhouse A'),
    Device(id: 'DEV005', name: 'Humidity Sensor H1', type: 'Humidity', status: 'Maintenance', farm: 'Unassigned'),
    Device(id: 'DEV006', name: 'Light Sensor L1', type: 'Light Intensity', status: 'Active', farm: 'South Field'),
  ];

  final List<String> _farms = [
    'Unassigned',
    'Main Farm',
    'North Field',
    'South Field',
    'East Field',
    'West Field',
    'Greenhouse A',
    'Greenhouse B',
  ];

  String _selectedFilter = 'All';
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Device Assignment'),
        backgroundColor: theme.primaryColor,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showAddDeviceDialog,
            tooltip: 'Add Device',
          ),
        ],
      ),
      body: Column(
        children: [
          _buildHeader(theme),
          _buildSearchAndFilter(theme),
          Expanded(
            child: _buildDeviceList(theme),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _scanForDevices,
        backgroundColor: theme.primaryColor,
        icon: const Icon(Icons.qr_code_scanner),
        label: const Text('Scan for Devices'),
      ),
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [theme.primaryColor, theme.primaryColor.withOpacity(0.7)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Device Management',
            style: theme.textTheme.headlineSmall?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              _buildStatusCard('Active', _devices.where((d) => d.status == 'Active').length, Colors.green),
              const SizedBox(width: 12),
              _buildStatusCard('Inactive', _devices.where((d) => d.status == 'Inactive').length, Colors.orange),
              const SizedBox(width: 12),
              _buildStatusCard('Maintenance', _devices.where((d) => d.status == 'Maintenance').length, Colors.red),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusCard(String label, int count, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.2),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          children: [
            Text(
              count.toString(),
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchAndFilter(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search devices...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              onChanged: (value) {
                setState(() {});
              },
            ),
          ),
          const SizedBox(width: 12),
          Container(
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(8),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedFilter,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                items: ['All', 'Active', 'Inactive', 'Maintenance']
                    .map((status) => DropdownMenuItem(
                          value: status,
                          child: Text(status),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedFilter = value!;
                  });
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeviceList(ThemeData theme) {
    final filteredDevices = _devices.where((device) {
      final matchesSearch = _searchController.text.isEmpty ||
          device.name.toLowerCase().contains(_searchController.text.toLowerCase()) ||
          device.id.toLowerCase().contains(_searchController.text.toLowerCase());

      final matchesFilter = _selectedFilter == 'All' || device.status == _selectedFilter;

      return matchesSearch && matchesFilter;
    }).toList();

    if (filteredDevices.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.devices_other,
              size: 64,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 16),
            Text(
              'No devices found',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: filteredDevices.length,
      itemBuilder: (context, index) {
        final device = filteredDevices[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: _getStatusColor(device.status).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                _getDeviceIcon(device.type),
                color: _getStatusColor(device.status),
              ),
            ),
            title: Text(
              device.name,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text('ID: ${device.id}'),
                Text('Type: ${device.type}'),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getStatusColor(device.status).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        device.status,
                        style: TextStyle(
                          fontSize: 12,
                          color: _getStatusColor(device.status),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Farm: ${device.farm}',
                        style: const TextStyle(fontSize: 12),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            trailing: PopupMenuButton<String>(
              onSelected: (value) {
                if (value == 'assign') {
                  _showAssignmentDialog(device);
                } else if (value == 'edit') {
                  _showEditDeviceDialog(device);
                } else if (value == 'remove') {
                  _confirmRemoveDevice(device);
                }
              },
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'assign',
                  child: ListTile(
                    leading: Icon(Icons.assignment),
                    title: Text('Assign to Farm'),
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
                const PopupMenuItem(
                  value: 'edit',
                  child: ListTile(
                    leading: Icon(Icons.edit),
                    title: Text('Edit Device'),
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
                const PopupMenuItem(
                  value: 'remove',
                  child: ListTile(
                    leading: Icon(Icons.delete, color: Colors.red),
                    title: Text('Remove Device', style: TextStyle(color: Colors.red)),
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Active':
        return Colors.green;
      case 'Inactive':
        return Colors.orange;
      case 'Maintenance':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getDeviceIcon(String type) {
    switch (type) {
      case 'Soil Moisture':
        return Icons.water_drop;
      case 'Weather':
        return Icons.wb_sunny;
      case 'pH Level':
        return Icons.science;
      case 'Temperature':
        return Icons.thermostat;
      case 'Humidity':
        return Icons.water;
      case 'Light Intensity':
        return Icons.light_mode;
      default:
        return Icons.sensors;
    }
  }

  void _showAssignmentDialog(Device device) {
    String selectedFarm = device.farm;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Assign ${device.name}'),
        content: StatefulBuilder(
          builder: (context, setState) {
            return DropdownButtonFormField<String>(
              value: selectedFarm,
              decoration: const InputDecoration(
                labelText: 'Select Farm',
                border: OutlineInputBorder(),
              ),
              items: _farms
                  .map((farm) => DropdownMenuItem(
                        value: farm,
                        child: Text(farm),
                      ))
                  .toList(),
              onChanged: (value) {
                setState(() {
                  selectedFarm = value!;
                });
              },
            );
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                device.farm = selectedFarm;
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('${device.name} assigned to $selectedFarm'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: const Text('Assign'),
          ),
        ],
      ),
    );
  }

  void _showAddDeviceDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add New Device'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: InputDecoration(
                labelText: 'Device Name',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'Device ID',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Device added successfully'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _showEditDeviceDialog(Device device) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit ${device.name}'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: InputDecoration(
                labelText: 'Device Name',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'Device Type',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Device updated successfully'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _confirmRemoveDevice(Device device) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove Device'),
        content: Text('Are you sure you want to remove ${device.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _devices.remove(device);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Device removed successfully'),
                  backgroundColor: Colors.orange,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Remove'),
          ),
        ],
      ),
    );
  }

  void _scanForDevices() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Scanning for nearby devices...'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}

class Device {
  final String id;
  final String name;
  final String type;
  final String status;
  String farm;

  Device({
    required this.id,
    required this.name,
    required this.type,
    required this.status,
    required this.farm,
  });
}