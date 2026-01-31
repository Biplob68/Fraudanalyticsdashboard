import { Outlet, Link, useLocation } from "react-router";
import { BarChart3, ShieldAlert, Settings } from "lucide-react";

export function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-8 w-8 text-red-600" />
              <h1 className="text-xl font-semibold text-gray-900">Fraud Analytics Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <Link
              to="/"
              className={`py-4 border-b-2 transition-colors ${
                location.pathname === "/"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Fraud Overview</span>
              </div>
            </Link>
            <Link
              to="/actioned-transactions"
              className={`py-4 border-b-2 transition-colors ${
                location.pathname === "/actioned-transactions"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Actioned Transactions</span>
              </div>
            </Link>
            <Link
              to="/rule-performance"
              className={`py-4 border-b-2 transition-colors ${
                location.pathname === "/rule-performance"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Rule Performance</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}