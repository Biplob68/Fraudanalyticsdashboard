import { RuleTemplates } from "../components/RuleTemplates";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function RuleTemplatesPage() {
  return (
    <div className="p-8">
      <Link 
        to="/rule-library"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Rule Library
      </Link>
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Rule Templates</h1>
        <p className="text-sm text-gray-600 mt-1">
          Choose from pre-built rule templates to quickly create new fraud detection rules
        </p>
      </div>

      <RuleTemplates />
    </div>
  );
}
