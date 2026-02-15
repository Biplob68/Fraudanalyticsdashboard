import { useState } from "react";
import { Link, useLocation } from "react-router";
import { 
  Shield, 
  ChevronRight, 
  ChevronDown,
  BarChart3, 
  FileText, 
  BookOpen,
  Code,
  Inbox,
  Network
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: typeof BarChart3;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Analytics",
    items: [
      { label: "Overview", path: "/", icon: BarChart3 },
      { label: "Actioned Transactions", path: "/actioned-transactions", icon: FileText },
      { label: "Rule Performance", path: "/rule-performance", icon: BarChart3 },
    ],
  },
  {
    title: "Rule Management",
    items: [
      { label: "Rule Library", path: "/rule-library", icon: BookOpen },
      { label: "Rule Builder", path: "/rule-builder", icon: Code },
    ],
  },
  {
    title: "Investigations",
    items: [
      { label: "Case Inbox", path: "/case-inbox", icon: Inbox },
      { label: "Entity Links", path: "/entity-links", icon: Network },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Top Branding */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Fraud Ops Platform</h1>
            <p className="text-xs text-gray-500">v2.4.1</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {navSections.map((section) => {
            const isCollapsed = collapsedSections.has(section.title);
            
            return (
              <div key={section.title}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  <span>{section.title}</span>
                  {isCollapsed ? (
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </button>

                {/* Section Items */}
                {!isCollapsed && (
                  <div className="space-y-0.5 pb-3">
                    {section.items.map((item) => {
                      const active = isActive(item.path);
                      const Icon = item.icon;
                      
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                            active
                              ? "bg-red-50 text-red-600 font-medium border-r-2 border-red-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Version</span>
            <span className="font-medium text-gray-700">2.4.1</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Last sync</span>
            <span className="font-medium text-gray-700">2 min ago</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
