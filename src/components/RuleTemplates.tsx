import { Link } from "react-router";
import { Zap, Users } from "lucide-react";
import { ruleTemplates } from "../data/ruleManagementData";

export function RuleTemplates() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Velocity":
        return "bg-purple-100 text-purple-800";
      case "Geography":
        return "bg-blue-100 text-blue-800";
      case "MCC":
        return "bg-green-100 text-green-800";
      case "Amount":
        return "bg-yellow-100 text-yellow-800";
      case "Device":
        return "bg-pink-100 text-pink-800";
      case "Network":
        return "bg-indigo-100 text-indigo-800";
      case "Behavior":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {ruleTemplates.map((template) => (
        <div
          key={template.id}
          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(template.category)}`}>
                {template.category}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="h-4 w-4" />
              <span className="text-xs">{template.usageCount}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3">{template.description}</p>

          <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
            <p className="text-xs font-mono text-gray-700">{template.previewLogic}</p>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-1">Supported Channels:</p>
            <div className="flex flex-wrap gap-1">
              {template.supportedChannels.map((channel) => (
                <span
                  key={channel}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>

          <Link
            to="/rule-builder"
            state={{ template }}
            className="flex items-center justify-center gap-2 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <Zap className="h-4 w-4" />
            Use Template
          </Link>
        </div>
      ))}
    </div>
  );
}
