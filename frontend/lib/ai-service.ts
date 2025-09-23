// AI Service Configuration and Utilities
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIRecommendation {
  id: string;
  type: 'irrigation' | 'fertilizer' | 'disease' | 'weather' | 'energy';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionRequired: boolean;
  confidenceScore: number;
  timestamp: string;
  actions?: {
    label: string;
    action: string;
  }[];
}

export interface CropAnalysis {
  health: number; // 0-100
  riskFactors: string[];
  recommendations: AIRecommendation[];
  predictions: {
    yield: number;
    harvestDate: string;
    nextIrrigation: string;
  };
}

export class AIRecommendationEngine {
  private geminiApiKey: string | undefined;
  private genAI: GoogleGenerativeAI | undefined;
  private model: any;

  constructor() {
    this.geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (this.geminiApiKey) {
      this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
      // Use gemini-1.5-flash which is the current available model
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  // Analyze sensor data and generate recommendations using Gemini AI
  async generateRecommendations(sensorData: any): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // First, get local rule-based recommendations
    const localRecommendations = this.getLocalRecommendations(sensorData);
    recommendations.push(...localRecommendations);

    // If Gemini is configured, get AI-powered recommendations
    if (this.model && sensorData) {
      try {
        const aiRecommendations = await this.getGeminiRecommendations(sensorData);
        recommendations.push(...aiRecommendations);
      } catch (error) {
        console.error('Gemini API error:', error);
        // Fall back to local recommendations only
      }
    }

    // Sort by priority and remove duplicates
    return this.deduplicateAndSort(recommendations);
  }

  private async getGeminiRecommendations(sensorData: any): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    try {
      const prompt = `
        As an agricultural AI assistant, analyze the following sensor data and provide actionable recommendations for farm management.

        Sensor Data:
        - Temperature: ${sensorData.temperature || sensorData.temperature_C || 'N/A'}°C
        - Humidity: ${sensorData.humidity || sensorData.humidity_ || 'N/A'}%
        - Soil Moisture: ${sensorData.soil_moisture || 'N/A'}%
        - pH Level: ${sensorData.ph || 'N/A'}
        - Nitrogen: ${sensorData.nitrogen || 'N/A'} ppm
        - Phosphorus: ${sensorData.phosphorus || 'N/A'} ppm
        - Potassium: ${sensorData.potassium || 'N/A'} ppm
        - Wind Speed: ${sensorData.wind_kmh || 'N/A'} km/h
        - Rain Rate: ${sensorData.rainrate_mm_h || sensorData.rainfall || 'N/A'} mm/h
        - Light: ${sensorData.light_lux || 'N/A'} lux
        - Solar Power: ${sensorData.sol_power_W || 'N/A'} W

        Based on this data, provide up to 3 critical recommendations. For each recommendation, provide:
        1. Type (irrigation/fertilizer/disease/weather/energy)
        2. Priority (high/medium/low)
        3. Title (brief, with emoji)
        4. Description (specific actionable advice, 2-3 sentences max)
        5. Confidence score (0-1)

        Format your response as JSON array. Example:
        [
          {
            "type": "irrigation",
            "priority": "high",
            "title": "💧 Immediate Irrigation Needed",
            "description": "Soil moisture at 15% is critically low. Irrigate for 45 minutes tonight at 8 PM to prevent crop stress.",
            "confidence": 0.95
          }
        ]

        Focus on the most critical issues that require immediate attention. Be specific and actionable.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsedRecommendations = JSON.parse(jsonMatch[0]);

          for (const rec of parsedRecommendations) {
            recommendations.push({
              id: `gemini-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: rec.type || 'disease',
              priority: rec.priority || 'medium',
              title: rec.title || 'AI Recommendation',
              description: rec.description || 'Please review your farm conditions.',
              actionRequired: rec.priority === 'high',
              confidenceScore: rec.confidence || 0.85,
              timestamp: new Date().toISOString(),
              actions: this.getActionsForType(rec.type)
            });
          }
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        // Return empty array if parsing fails
      }
    } catch (error) {
      console.error('Error generating Gemini recommendations:', error);
    }

    return recommendations;
  }

  private getActionsForType(type: string) {
    switch (type) {
      case 'irrigation':
        return [
          { label: 'Schedule Irrigation', action: 'schedule_irrigation' },
          { label: 'View Water Usage', action: 'view_water_usage' }
        ];
      case 'fertilizer':
        return [
          { label: 'Order Fertilizer', action: 'order_fertilizer' },
          { label: 'Calculate Amount', action: 'calculate_fertilizer' }
        ];
      case 'disease':
        return [
          { label: 'View Prevention Tips', action: 'view_prevention' },
          { label: 'Contact Expert', action: 'contact_expert' }
        ];
      case 'weather':
        return [
          { label: 'View Forecast', action: 'view_forecast' },
          { label: 'Adjust Schedule', action: 'adjust_schedule' }
        ];
      case 'energy':
        return [
          { label: 'Maintenance Guide', action: 'solar_maintenance' },
          { label: 'View Usage', action: 'view_energy_usage' }
        ];
      default:
        return [];
    }
  }

  private getLocalRecommendations(data: any): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // Irrigation Analysis
    const irrigationRec = this.analyzeIrrigation(data);
    if (irrigationRec) recommendations.push(irrigationRec);

    // Fertilizer Analysis
    const fertilizerRec = this.analyzeFertilizer(data);
    if (fertilizerRec) recommendations.push(fertilizerRec);

    // Disease Risk Analysis
    const diseaseRec = this.analyzeDiseaseRisk(data);
    if (diseaseRec) recommendations.push(diseaseRec);

    // Weather-based recommendations
    const weatherRec = this.analyzeWeather(data);
    if (weatherRec) recommendations.push(weatherRec);

    // Solar/Energy recommendations
    const energyRec = this.analyzeEnergy(data);
    if (energyRec) recommendations.push(energyRec);

    return recommendations;
  }

  private deduplicateAndSort(recommendations: AIRecommendation[]): AIRecommendation[] {
    // Remove duplicates based on type and similar content
    const unique = recommendations.reduce((acc, current) => {
      const isDuplicate = acc.some(item =>
        item.type === current.type &&
        item.priority === current.priority &&
        this.similarity(item.title, current.title) > 0.8
      );

      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, [] as AIRecommendation[]);

    // Sort by priority
    return unique.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private similarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    if (s1 === s2) return 1;

    const words1 = s1.split(' ');
    const words2 = s2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));

    return commonWords.length / Math.max(words1.length, words2.length);
  }

  private analyzeIrrigation(data: any): AIRecommendation | null {
    const soilMoisture = data.soil_moisture || 0;
    const temperature = data.temperature || data.temperature_C || 0;
    const humidity = data.humidity || data.humidity_ || 0;

    if (soilMoisture < 30) {
      return {
        id: `irr-${Date.now()}`,
        type: 'irrigation',
        priority: soilMoisture < 20 ? 'high' : 'medium',
        title: '💧 Irrigation Required',
        description: `Soil moisture is at ${soilMoisture.toFixed(1)}%. Recommend irrigating for ${
          soilMoisture < 20 ? '60' : '45'
        } minutes tonight at 8 PM when evaporation is minimal.`,
        actionRequired: true,
        confidenceScore: 0.92,
        timestamp: new Date().toISOString(),
        actions: [
          { label: 'Schedule Irrigation', action: 'schedule_irrigation' },
          { label: 'View Details', action: 'view_irrigation_details' }
        ]
      };
    }

    if (soilMoisture > 80) {
      return {
        id: `irr-${Date.now()}`,
        type: 'irrigation',
        priority: 'low',
        title: '⚠️ Reduce Irrigation',
        description: `Soil moisture is high at ${soilMoisture.toFixed(1)}%. Consider reducing irrigation to prevent root rot and conserve water.`,
        actionRequired: false,
        confidenceScore: 0.88,
        timestamp: new Date().toISOString(),
        actions: [
          { label: 'Adjust Schedule', action: 'adjust_irrigation' }
        ]
      };
    }

    return null;
  }

  private analyzeFertilizer(data: any): AIRecommendation | null {
    const nitrogen = data.nitrogen || 0;
    const phosphorus = data.phosphorus || 0;
    const potassium = data.potassium || 0;
    const ph = data.ph || 7;

    const deficiencies = [];
    if (nitrogen < 20) deficiencies.push('Nitrogen');
    if (phosphorus < 10) deficiencies.push('Phosphorus');
    if (potassium < 20) deficiencies.push('Potassium');

    if (deficiencies.length > 0) {
      return {
        id: `fert-${Date.now()}`,
        type: 'fertilizer',
        priority: deficiencies.length > 2 ? 'high' : 'medium',
        title: '🌱 Nutrient Deficiency Detected',
        description: `Low levels detected: ${deficiencies.join(', ')}. Apply balanced NPK fertilizer (20-20-20) at 50kg/hectare. Best time: Tomorrow morning before expected rain.`,
        actionRequired: true,
        confidenceScore: 0.85,
        timestamp: new Date().toISOString(),
        actions: [
          { label: 'Order Fertilizer', action: 'order_fertilizer' },
          { label: 'Set Reminder', action: 'set_reminder' }
        ]
      };
    }

    if (ph < 6 || ph > 7.5) {
      return {
        id: `fert-${Date.now()}`,
        type: 'fertilizer',
        priority: 'medium',
        title: '⚖️ pH Adjustment Needed',
        description: `Soil pH is ${ph.toFixed(1)}. ${
          ph < 6 ? 'Add lime to increase pH' : 'Add sulfur to decrease pH'
        } for optimal nutrient absorption.`,
        actionRequired: true,
        confidenceScore: 0.90,
        timestamp: new Date().toISOString(),
        actions: [
          { label: 'Calculate Amount', action: 'calculate_ph_adjustment' }
        ]
      };
    }

    return null;
  }

  private analyzeDiseaseRisk(data: any): AIRecommendation | null {
    const humidity = data.humidity || data.humidity_ || 0;
    const temperature = data.temperature || data.temperature_C || 0;

    // Fungal disease risk assessment
    if (humidity > 75 && temperature > 20 && temperature < 30) {
      return {
        id: `disease-${Date.now()}`,
        type: 'disease',
        priority: humidity > 85 ? 'high' : 'medium',
        title: '🦠 High Disease Risk Alert',
        description: `Current conditions (${humidity.toFixed(0)}% humidity, ${temperature.toFixed(1)}°C) are favorable for fungal diseases. Consider preventive fungicide application within 24 hours.`,
        actionRequired: true,
        confidenceScore: 0.87,
        timestamp: new Date().toISOString(),
        actions: [
          { label: 'View Prevention Tips', action: 'view_prevention' },
          { label: 'Contact Expert', action: 'contact_expert' }
        ]
      };
    }

    // Pest risk based on temperature
    if (temperature > 30) {
      return {
        id: `disease-${Date.now()}`,
        type: 'disease',
        priority: 'medium',
        title: '🐛 Pest Activity Alert',
        description: `High temperatures (${temperature.toFixed(1)}°C) may increase pest activity. Monitor crops closely for signs of infestation.`,
        actionRequired: false,
        confidenceScore: 0.75,
        timestamp: new Date().toISOString(),
        actions: [
          { label: 'Inspection Guide', action: 'view_inspection_guide' }
        ]
      };
    }

    return null;
  }

  private analyzeWeather(data: any): AIRecommendation | null {
    const windSpeed = data.wind_kmh || 0;
    const rainRate = data.rainrate_mm_h || data.rainfall || 0;

    if (windSpeed > 30) {
      return {
        id: `weather-${Date.now()}`,
        type: 'weather',
        priority: windSpeed > 50 ? 'high' : 'medium',
        title: '💨 High Wind Warning',
        description: `Wind speed at ${windSpeed.toFixed(1)} km/h. Postpone spraying operations and secure loose equipment. Consider staking tall crops.`,
        actionRequired: true,
        confidenceScore: 0.95,
        timestamp: new Date().toISOString(),
        actions: [
          { label: 'View Checklist', action: 'wind_checklist' }
        ]
      };
    }

    if (rainRate > 10) {
      return {
        id: `weather-${Date.now()}`,
        type: 'weather',
        priority: 'medium',
        title: '🌧️ Heavy Rain Detected',
        description: `Rainfall at ${rainRate.toFixed(1)} mm/h. Skip irrigation for next 48 hours. Good time for fertilizer application has passed.`,
        actionRequired: false,
        confidenceScore: 0.93,
        timestamp: new Date().toISOString(),
        actions: [
          { label: 'Adjust Schedule', action: 'adjust_schedule' }
        ]
      };
    }

    return null;
  }

  private analyzeEnergy(data: any): AIRecommendation | null {
    const solarPower = data.sol_power_W || 0;
    const solarVoltage = data.sol_voltage_V || 0;

    if (solarPower < 1 && solarVoltage < 11) {
      return {
        id: `energy-${Date.now()}`,
        type: 'energy',
        priority: 'low',
        title: '🔋 Solar Panel Maintenance',
        description: `Solar power generation is low (${solarPower.toFixed(2)}W). Panels may need cleaning or there could be shading issues.`,
        actionRequired: false,
        confidenceScore: 0.82,
        timestamp: new Date().toISOString(),
        actions: [
          { label: 'Maintenance Guide', action: 'solar_maintenance' }
        ]
      };
    }

    return null;
  }

  // Get AI-powered crop health analysis using Gemini
  async analyzeCropHealth(historicalData: any[]): Promise<CropAnalysis> {
    const latestData = historicalData[0] || {};
    const recommendations = await this.generateRecommendations(latestData);

    // If Gemini is available, get advanced analysis
    if (this.model && historicalData.length > 0) {
      try {
        const prompt = `
          Analyze the following agricultural sensor data trends and provide a comprehensive crop health assessment.

          Latest readings: ${JSON.stringify(latestData)}
          Historical data points: ${historicalData.length}

          Provide:
          1. Overall health score (0-100)
          2. Top 3 risk factors
          3. Yield prediction (percentage of optimal)
          4. Estimated days until harvest
          5. Next irrigation timing recommendation

          Format response as JSON with keys: health, riskFactors (array), yieldPrediction, harvestDays, nextIrrigation
        `;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);

            return {
              health: analysis.health || 75,
              riskFactors: analysis.riskFactors || [],
              recommendations: recommendations.slice(0, 3),
              predictions: {
                yield: analysis.yieldPrediction || 85,
                harvestDate: new Date(Date.now() + (analysis.harvestDays || 30) * 24 * 60 * 60 * 1000).toISOString(),
                nextIrrigation: analysis.nextIrrigation || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
              }
            };
          }
        } catch (error) {
          console.error('Error parsing Gemini health analysis:', error);
        }
      } catch (error) {
        console.error('Error getting Gemini health analysis:', error);
      }
    }

    // Fallback to local analysis
    return this.getLocalCropAnalysis(historicalData, recommendations);
  }

  private getLocalCropAnalysis(historicalData: any[], recommendations: AIRecommendation[]): CropAnalysis {
    const latestData = historicalData[0] || {};

    // Simple health score calculation
    const healthFactors = {
      moisture: this.normalizeValue(latestData.soil_moisture, 30, 70),
      temperature: this.normalizeValue(latestData.temperature || latestData.temperature_C, 20, 30),
      ph: this.normalizeValue(latestData.ph, 6, 7.5),
      nutrients: this.normalizeValue(
        (latestData.nitrogen + latestData.phosphorus + latestData.potassium) / 3,
        20,
        50
      )
    };

    const healthScore = Object.values(healthFactors).reduce((sum, val) => sum + val, 0) / 4 * 100;

    const riskFactors = [];
    if (healthFactors.moisture < 0.3) riskFactors.push('Low soil moisture');
    if (healthFactors.temperature < 0.3) riskFactors.push('Temperature stress');
    if (healthFactors.ph < 0.3) riskFactors.push('pH imbalance');
    if (healthFactors.nutrients < 0.3) riskFactors.push('Nutrient deficiency');

    return {
      health: Math.round(healthScore),
      riskFactors,
      recommendations: recommendations.slice(0, 3),
      predictions: {
        yield: Math.round(80 + Math.random() * 40),
        harvestDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextIrrigation: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    };
  }

  private normalizeValue(value: number, min: number, max: number): number {
    if (!value) return 0;
    if (value <= min) return 0;
    if (value >= max) return 1;
    return (value - min) / (max - min);
  }
}

// Export singleton instance
export const aiService = new AIRecommendationEngine();