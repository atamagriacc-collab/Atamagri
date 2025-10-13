import React, { useState, useEffect } from 'react';
import { X, Download, TrendingUp, Calendar, Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../lib/auth-context';

interface SensorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensorType: string;
  sensorData: any[];
  currentValue: any;
  unit: string;
  icon: React.ReactNode;
  title: string;
}

const SensorDetailModal: React.FC<SensorDetailModalProps> = ({
  isOpen,
  onClose,
  sensorType,
  sensorData,
  currentValue,
  unit,
  icon,
  title
}) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'5m' | '10m' | '30m' | '24h' | '7d' | '30d'>('24h');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [todayPrediction, setTodayPrediction] = useState<any>(null);
  const [tomorrowPrediction, setTomorrowPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && sensorType) {
      fetchAIPredictions();
    }
  }, [isOpen, sensorType]);

  const fetchAIPredictions = async () => {
    setLoading(true);
    try {
      const token = user ? await user.getIdToken() : null;
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          sensorData: sensorData[0] || {},
          analysisType: 'detailed'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiRecommendations(data.recommendations || []);

        // Generate predictions for today and tomorrow
        generatePredictions();
      }
    } catch (error) {
      console.error('Error fetching AI predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePredictions = () => {
    // Calculate average, min, max from historical data
    const values = sensorData.map(d => {
      switch (sensorType) {
        case 'temperature':
          return d.temperature_C || d.temperature || 0;
        case 'humidity':
          return d.humidity_ || d.humidity || 0;
        case 'wind':
          return d.wind_kmh || 0;
        case 'rain':
          return d.rainrate_mm_h || d.rainfall || 0;
        case 'light':
          return d.light_lux || 0;
        case 'solar':
          return d.sol_power_W || 0;
        default:
          return 0;
      }
    });

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Simple prediction based on trend
    const trend = values.length > 1 ? values[0] - values[values.length - 1] : 0;

    setTodayPrediction({
      high: (max + trend * 0.5).toFixed(1),
      low: (min - trend * 0.2).toFixed(1),
      average: (avg + trend * 0.3).toFixed(1),
      trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable'
    });

    setTomorrowPrediction({
      high: (max + trend * 0.8).toFixed(1),
      low: (min - trend * 0.1).toFixed(1),
      average: (avg + trend * 0.5).toFixed(1),
      trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable'
    });
  };

  const exportToCSV = () => {
    // Calculate data points based on selected time range (same logic as getChartData)
    let dataPoints;
    switch (timeRange) {
      case '5m':
        dataPoints = 1; // 5 min / 5 min = 1 point
        break;
      case '10m':
        dataPoints = 2; // 10 min / 5 min = 2 points
        break;
      case '30m':
        dataPoints = 6; // 30 min / 5 min = 6 points
        break;
      case '24h':
        dataPoints = 288; // 24 hours * 60 / 5 = 288 points
        break;
      case '7d':
        dataPoints = 2016; // 7 days * 24 * 60 / 5 = 2016 points
        break;
      case '30d':
        dataPoints = 8640; // 30 days * 24 * 60 / 5 = 8640 points
        break;
      default:
        dataPoints = 288;
    }

    // Filter data according to time range
    const filteredData = sensorData.slice(0, dataPoints);

    const headers = ['Timestamp', `${title} (${unit})`, 'Device'];
    const rows = filteredData.map((d, index) => {
      const value = getSensorValue(d, sensorType);
      const timestamp = d.timestamp || d.received_at || '';
      let date = new Date(timestamp);

      // Try parsing as Unix timestamp if initial parse fails
      if (isNaN(date.getTime()) && typeof timestamp === 'number') {
        date = new Date(timestamp * 1000);
        if (isNaN(date.getTime())) {
          date = new Date(timestamp);
        }
      }

      const formattedTimestamp = !isNaN(date.getTime())
        ? date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })
        : `Data_Point_${index + 1}`;

      return [
        formattedTimestamp,
        value,
        d.device_id || 'Unknown'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sensorType}_${timeRange}_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getSensorValue = (data: any, type: string) => {
    switch (type) {
      case 'temperature':
        return data.temperature_C || data.temperature || 0;
      case 'humidity':
        return data.humidity_ || data.humidity || 0;
      case 'wind':
        return data.wind_kmh || 0;
      case 'rain':
        return data.rainrate_mm_h || data.rainfall || 0;
      case 'light':
        return data.light_lux || 0;
      case 'solar':
        return data.sol_power_W || 0;
      case 'voltage':
        return data.sol_voltage_V || 0;
      case 'current':
        return data.sol_current_mA || 0;
      default:
        return 0;
    }
  };

  const getChartData = () => {
    let dataPoints;
    // Assuming data is collected every 5 minutes
    // Calculate data points based on time range
    switch (timeRange) {
      case '5m':
        dataPoints = 1; // 5 min / 5 min = 1 point
        break;
      case '10m':
        dataPoints = 2; // 10 min / 5 min = 2 points
        break;
      case '30m':
        dataPoints = 6; // 30 min / 5 min = 6 points
        break;
      case '24h':
        dataPoints = 288; // 24 hours * 60 / 5 = 288 points
        break;
      case '7d':
        dataPoints = 2016; // 7 days * 24 * 60 / 5 = 2016 points
        break;
      case '30d':
        dataPoints = 8640; // 30 days * 24 * 60 / 5 = 8640 points
        break;
      default:
        dataPoints = 288;
    }
    const filteredData = sensorData.slice(0, dataPoints);

    return filteredData
      .reverse()
      .filter((d) => {
        // Only include data with valid timestamps
        const timestamp = d.timestamp || d.received_at || '';
        let date = new Date(timestamp);

        // If timestamp is invalid, try parsing as number (Unix timestamp)
        if (isNaN(date.getTime()) && typeof timestamp === 'number') {
          date = new Date(timestamp * 1000);
          if (isNaN(date.getTime())) {
            date = new Date(timestamp);
          }
        }

        return !isNaN(date.getTime());
      })
      .map((d) => {
        const timestamp = d.timestamp || d.received_at || '';
        let date = new Date(timestamp);

        // If timestamp is invalid, try parsing as number (Unix timestamp)
        if (isNaN(date.getTime()) && typeof timestamp === 'number') {
          date = new Date(timestamp * 1000);
          if (isNaN(date.getTime())) {
            date = new Date(timestamp);
          }
        }

        const time = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          ...(timeRange === '5m' || timeRange === '10m' || timeRange === '30m' ? { second: '2-digit' } : {}),
          ...((timeRange === '7d' || timeRange === '30d') && { day: 'numeric', month: 'short' })
        });

        return {
          time,
          value: getSensorValue(d, sensorType),
          device: d.device_id
        };
      });
  };

  const getChartColor = () => {
    switch (sensorType) {
      case 'temperature': return '#ef4444'; // red
      case 'humidity': return '#3b82f6'; // blue
      case 'wind': return '#6b7280'; // gray
      case 'rain': return '#06b6d4'; // cyan
      case 'light': return '#eab308'; // yellow
      case 'solar': return '#f97316'; // orange
      default: return '#10b981'; // green
    }
  };

  if (!isOpen) return null;

  const chartData = getChartData();
  const chartColor = getChartColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              {icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{title} Sensor Details</h2>
              <p className="text-sm text-gray-500">Real-time monitoring and predictions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Value Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Reading</span>
                <Badge variant="default">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {currentValue} {unit}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          {/* Time Range Selector */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={timeRange === '5m' ? 'default' : 'outline'}
              onClick={() => setTimeRange('5m')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              5 Minutes
            </Button>
            <Button
              variant={timeRange === '10m' ? 'default' : 'outline'}
              onClick={() => setTimeRange('10m')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              10 Minutes
            </Button>
            <Button
              variant={timeRange === '30m' ? 'default' : 'outline'}
              onClick={() => setTimeRange('30m')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              30 Minutes
            </Button>
            <Button
              variant={timeRange === '24h' ? 'default' : 'outline'}
              onClick={() => setTimeRange('24h')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              24 Hours
            </Button>
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('7d')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              7 Days
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('30d')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              30 Days
            </Button>
          </div>

          {/* Detailed Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Historical Data</span>
                <Button
                  onClick={exportToCSV}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    strokeWidth={2}
                    name={`${title} (${unit})`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Today's Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayPrediction ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">High</span>
                      <span className="font-bold">{todayPrediction.high} {unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Low</span>
                      <span className="font-bold">{todayPrediction.low} {unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Average</span>
                      <span className="font-bold">{todayPrediction.average} {unit}</span>
                    </div>
                    <Badge variant={
                      todayPrediction.trend === 'increasing' ? 'default' :
                      todayPrediction.trend === 'decreasing' ? 'outline' : 'secondary'
                    }>
                      {todayPrediction.trend}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading predictions...</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Tomorrow's Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tomorrowPrediction ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">High</span>
                      <span className="font-bold">{tomorrowPrediction.high} {unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Low</span>
                      <span className="font-bold">{tomorrowPrediction.low} {unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Average</span>
                      <span className="font-bold">{tomorrowPrediction.average} {unit}</span>
                    </div>
                    <Badge variant={
                      tomorrowPrediction.trend === 'increasing' ? 'default' :
                      tomorrowPrediction.trend === 'decreasing' ? 'outline' : 'secondary'
                    }>
                      {tomorrowPrediction.trend}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading predictions...</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500">Analyzing sensor data...</p>
              ) : aiRecommendations.length > 0 ? (
                <div className="space-y-3">
                  {aiRecommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={
                          rec.priority === 'high' ? 'outline' :
                          rec.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {rec.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Confidence: {Math.round(rec.confidenceScore * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No specific recommendations at this time.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SensorDetailModal;