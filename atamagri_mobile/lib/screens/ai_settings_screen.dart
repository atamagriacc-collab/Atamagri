import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/auth_provider.dart';
import '../utils/constants.dart';

class AiSettingsScreen extends StatefulWidget {
  const AiSettingsScreen({super.key});

  @override
  State<AiSettingsScreen> createState() => _AiSettingsScreenState();
}

class _AiSettingsScreenState extends State<AiSettingsScreen> {
  bool _enableAiRecommendations = true;
  bool _enablePredictiveAnalysis = true;
  bool _enableAutomatedAlerts = true;
  bool _enableCropDiseaseDetection = true;
  double _aiConfidenceThreshold = 0.75;
  String _selectedModel = 'Advanced';
  final List<String> _aiModels = ['Basic', 'Advanced', 'Expert'];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Settings'),
        backgroundColor: theme.primaryColor,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(theme),
            const SizedBox(height: 24),
            _buildAiModelSelection(theme),
            const SizedBox(height: 24),
            _buildAiFeatures(theme),
            const SizedBox(height: 24),
            _buildConfidenceThreshold(theme),
            const SizedBox(height: 24),
            _buildAiInsights(theme),
            const SizedBox(height: 24),
            _buildSaveButton(theme),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [theme.primaryColor, theme.primaryColor.withOpacity(0.7)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.psychology, color: Colors.white, size: 32),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'AI Configuration',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Customize AI-powered features for your farm',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAiModelSelection(ThemeData theme) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.model_training, color: theme.primaryColor),
                const SizedBox(width: 8),
                Text(
                  'AI Model Selection',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...List.generate(
              _aiModels.length,
              (index) => RadioListTile<String>(
                value: _aiModels[index],
                groupValue: _selectedModel,
                onChanged: (value) {
                  setState(() {
                    _selectedModel = value!;
                  });
                },
                title: Text(_aiModels[index]),
                subtitle: Text(_getModelDescription(_aiModels[index])),
                activeColor: theme.primaryColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAiFeatures(ThemeData theme) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.settings_suggest, color: theme.primaryColor),
                const SizedBox(width: 8),
                Text(
                  'AI Features',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              value: _enableAiRecommendations,
              onChanged: (value) {
                setState(() {
                  _enableAiRecommendations = value;
                });
              },
              title: const Text('AI Recommendations'),
              subtitle: const Text('Get personalized farming suggestions'),
              activeColor: theme.primaryColor,
            ),
            SwitchListTile(
              value: _enablePredictiveAnalysis,
              onChanged: (value) {
                setState(() {
                  _enablePredictiveAnalysis = value;
                });
              },
              title: const Text('Predictive Analysis'),
              subtitle: const Text('Forecast crop yields and weather patterns'),
              activeColor: theme.primaryColor,
            ),
            SwitchListTile(
              value: _enableAutomatedAlerts,
              onChanged: (value) {
                setState(() {
                  _enableAutomatedAlerts = value;
                });
              },
              title: const Text('Automated Alerts'),
              subtitle: const Text('Receive AI-powered notifications'),
              activeColor: theme.primaryColor,
            ),
            SwitchListTile(
              value: _enableCropDiseaseDetection,
              onChanged: (value) {
                setState(() {
                  _enableCropDiseaseDetection = value;
                });
              },
              title: const Text('Crop Disease Detection'),
              subtitle: const Text('Identify diseases from images'),
              activeColor: theme.primaryColor,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildConfidenceThreshold(ThemeData theme) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.tune, color: theme.primaryColor),
                const SizedBox(width: 8),
                Text(
                  'Confidence Threshold',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              'Minimum confidence level for AI predictions',
              style: theme.textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Slider(
                    value: _aiConfidenceThreshold,
                    min: 0.5,
                    max: 1.0,
                    divisions: 10,
                    activeColor: theme.primaryColor,
                    label: '${(_aiConfidenceThreshold * 100).toInt()}%',
                    onChanged: (value) {
                      setState(() {
                        _aiConfidenceThreshold = value;
                      });
                    },
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: theme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '${(_aiConfidenceThreshold * 100).toInt()}%',
                    style: TextStyle(
                      color: theme.primaryColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAiInsights(ThemeData theme) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.insights, color: theme.primaryColor),
                const SizedBox(width: 8),
                Text(
                  'AI Performance Insights',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: FlGridData(show: false),
                  titlesData: FlTitlesData(
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    rightTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    topTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                          if (value.toInt() >= 0 && value.toInt() < days.length) {
                            return Text(
                              days[value.toInt()],
                              style: const TextStyle(fontSize: 10),
                            );
                          }
                          return const Text('');
                        },
                      ),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  lineBarsData: [
                    LineChartBarData(
                      spots: [
                        const FlSpot(0, 85),
                        const FlSpot(1, 88),
                        const FlSpot(2, 87),
                        const FlSpot(3, 92),
                        const FlSpot(4, 90),
                        const FlSpot(5, 94),
                        const FlSpot(6, 93),
                      ],
                      isCurved: true,
                      color: theme.primaryColor,
                      barWidth: 3,
                      dotData: FlDotData(show: true),
                      belowBarData: BarAreaData(
                        show: true,
                        color: theme.primaryColor.withOpacity(0.2),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildMetric('Accuracy', '92%', Icons.check_circle, Colors.green),
                _buildMetric('Predictions', '1,234', Icons.analytics, Colors.blue),
                _buildMetric('Saved Time', '48h', Icons.timer, Colors.orange),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetric(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 24),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
      ],
    );
  }

  Widget _buildSaveButton(ThemeData theme) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _saveSettings,
        style: ElevatedButton.styleFrom(
          backgroundColor: theme.primaryColor,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: const Text(
          'Save Settings',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  String _getModelDescription(String model) {
    switch (model) {
      case 'Basic':
        return 'Essential AI features for small farms';
      case 'Advanced':
        return 'Enhanced predictions and recommendations';
      case 'Expert':
        return 'Full AI capabilities with deep learning';
      default:
        return '';
    }
  }

  void _saveSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('AI settings saved successfully'),
        backgroundColor: Colors.green,
      ),
    );
  }
}