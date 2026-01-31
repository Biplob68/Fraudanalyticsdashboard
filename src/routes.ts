import { createBrowserRouter } from "react-router";
import { FraudOverview } from "./pages/FraudOverview";
import { ActionedTransactions } from "./pages/ActionedTransactions";
import { RulePerformance } from "./pages/RulePerformance";
import { RootLayout } from "./components/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: FraudOverview },
      {
        path: "actioned-transactions",
        Component: ActionedTransactions,
      },
      { path: "rule-performance", Component: RulePerformance },
    ],
  },
]);