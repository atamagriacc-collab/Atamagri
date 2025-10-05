import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/sensor_data_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/sensor_card.dart';
import '../widgets/chart_card.dart';
import '../widgets/device_status_card.dart';
import '../utils/constants.dart';
import '../models/sensor_data.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final sensorProvider = Provider.of<SensorDataProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final latestReading = sensorProvider.latestReading;

    return Scaffold(
      appBar: AppBar(
        title: const Text('ATAMAGRI Dashboard'),
        backgroundColor: AppColors.primary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
          PopupMenuButton<String>(
            icon: CircleAvatar(
              backgroundColor: Colors.white,
              child: Text(
                authProvider.user?.displayName?.substring(0, 1).toUpperCase() ?? 'U',
                style: const TextStyle(color: AppColors.primary),
              ),
            ),
            itemBuilder: (context) => <PopupMenuEntry<String>>[
              PopupMenuItem<String>(
                child: const Text('Profile'),
                onTap: () => context.go('/dashboard/profile'),
              ),
              PopupMenuItem<String>(
                child: const Text('Settings'),
                onTap: () => context.go('/dashboard/ai-settings'),
              ),
              const PopupMenuDivider(),
              PopupMenuItem<String>(
                child: const Text('Logout'),
                onTap: () async {
                  await authProvider.signOut();
                  if (context.mounted) {
                    context.go('/login');
                  }
                },
              ),
            ],
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => sensorProvider.refreshData(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildWelcomeCard(authProvider),
              const SizedBox(height: 20),
              _buildQuickStats(sensorProvider),
              const SizedBox(height: 20),
              _buildSensorCards(latestReading),
              const SizedBox(height: 20),
              _buildChartsSection(sensorProvider),
              const SizedBox(height: 20),
              _buildDevicesSection(sensorProvider),
            ],
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedIndex = index;
          });
          _navigateToScreen(context, index);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.wb_sunny_outlined),
            selectedIcon: Icon(Icons.wb_sunny),
            label: 'Weather',
          ),
          NavigationDestination(
            icon: Icon(Icons.memory_outlined),
            selectedIcon: Icon(Icons.memory),
            label: 'IoT',
          ),
          NavigationDestination(
            icon: Icon(Icons.psychology_outlined),
            selectedIcon: Icon(Icons.psychology),
            label: 'AI',
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeCard(AuthProvider authProvider) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primary, AppColors.primary.withOpacity(0.8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome back,',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Colors.white70,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  authProvider.user?.displayName ?? 'User',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Your smart agriculture assistant',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.white70,
                      ),
                ),
              ],
            ),
          ),
          const Icon(
            Icons.agriculture,
            size: 64,
            color: Colors.white24,
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStats(SensorDataProvider provider) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isSmallScreen = constraints.maxWidth < 360;
        if (isSmallScreen) {
          return Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Temperature',
                      provider.latestReading?.formattedTemperature ?? '--°C',
                      Icons.thermostat,
                      Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildStatCard(
                      'Humidity',
                      provider.latestReading?.formattedHumidity ?? '--%',
                      Icons.water_drop,
                      Colors.blue,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              _buildStatCard(
                'Devices',
                '${provider.devices.length}',
                Icons.devices,
                Colors.green,
              ),
            ],
          );
        }
        return Row(
          children: [
            Expanded(
              child: _buildStatCard(
                'Temperature',
                provider.latestReading?.formattedTemperature ?? '--°C',
                Icons.thermostat,
                Colors.orange,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildStatCard(
                'Humidity',
                provider.latestReading?.formattedHumidity ?? '--%',
                Icons.water_drop,
                Colors.blue,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildStatCard(
                'Devices',
                '${provider.devices.length}',
                Icons.devices,
                Colors.green,
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 20),
              Text(
                title,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.grey[600],
                      fontSize: 11,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: color,
                  fontSize: 18,
                ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildSensorCards(SensorData? latestReading) {
    if (latestReading == null) {
      return Center(
        child: Column(
          children: [
            Icon(Icons.sensors_off, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No sensor data available',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Live Sensor Data',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 16),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
          childAspectRatio: MediaQuery.of(context).size.width < 360 ? 1.3 : 1.6,
          children: [
            SensorCard(
              title: 'Temperature',
              value: latestReading.formattedTemperature,
              icon: Icons.thermostat,
              color: Colors.orange,
            ),
            SensorCard(
              title: 'Humidity',
              value: latestReading.formattedHumidity,
              icon: Icons.water_drop,
              color: Colors.blue,
            ),
            SensorCard(
              title: 'Wind Speed',
              value: latestReading.formattedWindSpeed,
              icon: Icons.air,
              color: Colors.teal,
            ),
            SensorCard(
              title: 'Rain Rate',
              value: latestReading.formattedRainRate,
              icon: Icons.umbrella,
              color: Colors.indigo,
            ),
            SensorCard(
              title: 'Light Intensity',
              value: latestReading.formattedLightIntensity,
              icon: Icons.wb_sunny,
              color: Colors.amber,
            ),
            SensorCard(
              title: 'Solar Power',
              value: latestReading.formattedSolarPower,
              icon: Icons.solar_power,
              color: Colors.green,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildChartsSection(SensorDataProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Trends',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            TextButton.icon(
              icon: const Icon(Icons.arrow_forward),
              label: const Text('View All'),
              onPressed: () => context.go('/dashboard/weather'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          height: 240,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                spreadRadius: 1,
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: ChartCard(
            title: 'Temperature & Humidity',
            data: provider.last10Readings,
          ),
        ),
      ],
    );
  }

  Widget _buildDevicesSection(SensorDataProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Device Status',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            TextButton.icon(
              icon: const Icon(Icons.arrow_forward),
              label: const Text('Manage'),
              onPressed: () => context.go('/dashboard/iot'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ...provider.devices.values.map((device) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: DeviceStatusCard(device: device),
            )),
      ],
    );
  }

  void _navigateToScreen(BuildContext context, int index) {
    switch (index) {
      case 0:
        context.go('/dashboard');
        break;
      case 1:
        context.go('/dashboard/weather');
        break;
      case 2:
        context.go('/dashboard/iot');
        break;
      case 3:
        context.go('/dashboard/ai-settings');
        break;
    }
  }
}