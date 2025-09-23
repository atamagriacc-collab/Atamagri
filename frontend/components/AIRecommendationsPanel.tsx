import React, { useState, useEffect } from 'react';
import { AIRecommendation } from '../lib/ai-service';
import AIRecommendationCard from './AIRecommendationCard';
import { Brain, RefreshCw, AlertTriangle, Settings } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useRouter } from 'next/router';

const AIRecommendationsPanel: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const fetchRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/ai-recommendations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // Refresh recommendations every 5 minutes
    const interval = setInterval(fetchRecommendations, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleAction = (action: string) => {
    console.log('Action triggered:', action);
    // Handle different actions based on the action string
    switch (action) {
      case 'schedule_irrigation':
        // TODO: Open irrigation scheduling modal
        alert('Irrigation scheduling feature coming soon!');
        break;
      case 'order_fertilizer':
        // TODO: Navigate to fertilizer ordering page
        alert('Fertilizer ordering feature coming soon!');
        break;
      case 'contact_expert':
        // TODO: Open expert consultation modal
        window.location.href = '/contact';
        break;
      default:
        console.log('Unhandled action:', action);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              AI Recommendations
            </h2>
            <p className="text-sm text-gray-500">
              Smart insights powered by agricultural AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/ai-settings')}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="AI Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {loading && recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-pulse">
            <Brain className="w-16 h-16 text-gray-300 mb-4" />
          </div>
          <p className="text-gray-500">Analyzing your farm data...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <AIRecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAction={handleAction}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No recommendations available</p>
          <p className="text-sm text-gray-400">
            Make sure your sensors are sending data
          </p>
        </div>
      )}

      {lastUpdated && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default AIRecommendationsPanel;