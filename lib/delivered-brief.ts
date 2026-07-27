import type { ImpactResult } from "@/app/components/ImpactDrawer";

export const DELIVERED_REYES_BRIEF: ImpactResult = {
  exposure:
    "Marcus Reyes is the exposed asset: an extension-eligible starting wing represented by David Kessler as Apex Sports tests the market.",
  player: "Marcus Reyes",
  executiveSummary:
    "Reyes matches the market signal exactly: an extension-eligible Kessler wing entering his final rookie-scale year. Basketball stakeholders support retention, but medical timing and cap discipline conflict with the urgency created by Kessler. Our history argues for engaging now without paying from panic.",
  consensus: [
    {
      title: "Retain Reyes if health clears",
      detail:
        "Scouting, analytics, and coaching align that Reyes is a high-value core starter worth extending, conditioned on availability.",
      sourceCount: 3,
    },
    {
      title: "Kessler creates real timing risk",
      detail:
        "Contracts and prior negotiations show that deadline pressure with Kessler is not theoretical.",
      sourceCount: 2,
    },
  ],
  disagreement: [
    {
      title: "Urgency versus cap discipline",
      detail:
        "Scouting and coaching favor securing the asset now; contracts warns that tight cap space makes rushed terms costly.",
      sourceCount: 3,
    },
    {
      title: "Medical certainty versus market timing",
      detail:
        "Coaching requires medical sign-off, while the scheduled preseason re-evaluation may arrive after negotiating leverage shifts.",
      sourceCount: 2,
    },
  ],
  evidence: [
    {
      name: "Scouting",
      finding: "Elite two-way wing and long-term core starter; prioritize an extension.",
      source: "Scouting Report: Marcus Reyes (SF)",
    },
    {
      name: "Analytics",
      finding: "High-surplus asset at +4.2, with value contingent on availability.",
      source: "Player Value Model: Marcus Reyes",
    },
    {
      name: "Medical",
      finding: "Moderate recurring knee flag after 19 missed games; re-evaluation is pending.",
      source: "Injury Log: Marcus Reyes",
    },
    {
      name: "Contracts",
      finding: "Extension-eligible now, Kessler-represented, with tight cap and contentious precedent.",
      source: "Contract Status: Marcus Reyes",
    },
    {
      name: "Coaching",
      finding: "Staff wants Reyes starting and retained, pending medical sign-off.",
      source: "Coaching Note: Reyes rotation",
    },
  ],
  considerations: [
    {
      title: "Structured extension now",
      detail:
        "Open talks immediately with availability protections, load-management terms, and scheduled medical re-evaluation clauses.",
    },
    {
      title: "Delay until medical review",
      detail:
        "Preserves clinical certainty but risks repeating the loss of leverage seen with a prior Kessler wing.",
    },
  ],
  precedents: [
    {
      title: "Deferred on a Kessler wing (2024)",
      outcome: "bad",
      lesson: "Waiting cost the organization both the player asset and the cap target.",
    },
    {
      title: "Extended through a knee flag (2023)",
      outcome: "good",
      lesson: "A moderate knee risk remained manageable when the contract included a defined protocol.",
    },
  ],
  openQuestions: [
    "Can the medical re-evaluation be moved ahead of formal negotiations?",
    "What extension range preserves room for the other summer priorities?",
    "Is Kessler testing Reyes specifically or the wider Apex wing market?",
  ],
  recommendation:
    "Open structured extension talks with Kessler now, contingent on an accelerated medical review and protected by availability terms; do not defer, but do not let urgency set the price.",
  citedSourceCount: 7,
  citationsVerified: true,
};
