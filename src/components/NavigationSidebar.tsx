import { Link, useLocation } from "react-router";
import {
  BarChart3,
  FileText,
  Settings,
  BookOpen,
  Wrench,
  PlayCircle,
  History,
  Inbox,
  FileSearch,
  Network,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Workflow,
} from "lucide-react";
import { useState } from "react";

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
  path: string;
  icon: any;
}

const navigationSections: NavSection[] = [
  {
    title: "Analytics",
    items: [
      { name: "Overview", path: "/", icon: BarChart3 },
      { name: "Actioned Transactions", path: "/actioned-transactions", icon: FileText },
      { name: "Rule Performance", path: "/rule-performance", icon: Settings },
    ],
  },
  {
    title: "Rule Management",
    items: [
      { name: "Rule Library", path: "/rule-library", icon: BookOpen },
      { name: "Rule Builder", path: "/rule-builder", icon: Wrench },
      { name: "Visual Rule Builder", path: "/visual-rule-builder", icon: Workflow },
      { name: "Rule Simulation", path: "/rule-simulation", icon: PlayCircle },
      { name: "Deployment History", path: "/deployment-history", icon: History },
    ],
  },
  {
    title: "Investigations",
    items: [
      { name: "Case Inbox", path: "/case-inbox", icon: Inbox },
      { name: "Case Detail", path: "/case-detail", icon: FileSearch },
      { name: "Entity Links", path: "/entity-links", icon: Network },
    ],
  },
];

export function NavigationSidebar() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["Analytics", "Rule Management", "Investigations"])
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="font-semibold text-gray-900">Fraud Ops</h1>
            <p className="text-xs text-gray-600">Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigationSections.map((section) => {
          const isExpanded = expandedSections.has(section.title);
          return (
            <div key={section.title} className="mb-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-4 py-2 flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50 transition-colors"
              >
                <span>{section.title}</span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Section Items */}
              {isExpanded && (
                <div className="mt-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.path ||
                      (item.path === "/" && location.pathname === "/") ||
                      (item.path !== "/" && location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-red-50 text-red-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p className="font-medium">v2.1.0</p>
          <p>Last sync: 2 min ago</p>
        </div>
      </div>
    </div>
  );
}