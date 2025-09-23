import React from 'react';
import { AIRecommendation } from '../lib/ai-service';
import { AlertCircle, Droplets, Sprout, Bug, Cloud, Battery } from 'lucide-react';

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  onAction?: (action: string) => void;
}

const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onAction
}) => {
  // Icon mapping based on recommendation type
  const getIcon = () => {
    switch (recommendation.type) {
      case 'irrigation':
        return <Droplets className="w-6 h-6" />;
      case 'fertilizer':
        return <Sprout className="w-6 h-6" />;
      case 'disease':
        return <Bug className="w-6 h-6" />;
      case 'weather':
        return <Cloud className="w-6 h-6" />;
      case 'energy':
        return <Battery className="w-6 h-6" />;
      default:
        return <AlertCircle className="w-6 h-6" />;
    }
  };

  // Priority color mapping
  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  // Priority badge color
  const getPriorityBadgeColor = () => {
    switch (recommendation.priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 ${getPriorityColor()} transition-all hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {recommendation.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor()}`}
              >
                {recommendation.priority.toUpperCase()}
              </span>
              {recommendation.actionRequired && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  ACTION REQUIRED
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Confidence</div>
          <div className="font-bold text-lg">
            {Math.round(recommendation.confidenceScore * 100)}%
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">
        {recommendation.description}
      </p>

      {recommendation.actions && recommendation.actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recommendation.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => onAction && onAction(action.action)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Generated: {new Date(recommendation.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default AIRecommendationCard;