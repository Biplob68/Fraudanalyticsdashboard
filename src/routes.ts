import { createBrowserRouter } from "react-router";
import { FraudOverview } from "./pages/FraudOverview";
import { ActionedTransactions } from "./pages/ActionedTransactions";
import { RulePerformance } from "./pages/RulePerformance";
import { RuleLibrary } from "./pages/RuleLibrary";
import { RuleBuilder } from "./pages/RuleBuilder";
import { VisualRuleBuilder } from "./pages/VisualRuleBuilder";
import { RuleTemplatesPage } from "./pages/RuleTemplatesPage";
import { RuleSimulation } from "./pages/RuleSimulation";
import { DeploymentHistory } from "./pages/DeploymentHistory";
import { CaseInbox } from "./pages/CaseInbox";
import { CaseDetail } from "./pages/CaseDetail";
import { EntityLinks } from "./pages/EntityLinks";
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
      
      // Rule Management
      { path: "rule-library", Component: RuleLibrary },
      { path: "rule-builder", Component: RuleBuilder },
      { path: "rule-builder/:ruleId", Component: RuleBuilder },
      { path: "visual-rule-builder", Component: VisualRuleBuilder },
      { path: "visual-rule-builder/:ruleId", Component: VisualRuleBuilder },
      { path: "rule-templates", Component: RuleTemplatesPage },
      { path: "rule-simulation", Component: RuleSimulation },
      { path: "deployment-history", Component: DeploymentHistory },
      
      // Investigations
      { path: "case-inbox", Component: CaseInbox },
      { path: "case-detail/:caseId", Component: CaseDetail },
      { path: "entity-links", Component: EntityLinks },
    ],
  },
]);