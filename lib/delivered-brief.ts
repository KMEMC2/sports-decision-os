import type { ImpactResult } from "@/app/components/ImpactDrawer";

export const DELIVERED_REYES_BRIEF: ImpactResult = {
  exposure:
    "Marcus Reyes is the exposed asset: an extension-eligible starting wing represented by David Kessler as Apex Sports tests the market.",
  player: "Marcus Reyes",
  generatedAt: "Today · 08:42",
  changedSinceLastReview:
    "Apex Sports began testing the market for extension-eligible wings, converting a routine extension review into a time-sensitive retention decision.",
  decisionClock: {
    status: "act",
    deadline: "9 days",
    nextCatalyst: "Kessler begins formal market outreach",
    evidencePending: "Accelerated knee re-evaluation",
  },
  detectionTrail: [
    { time: "08:39", event: "League signal detected: Apex Sports testing the wing market" },
    { time: "08:40", event: "Marcus Reyes matched through agent, position, and eligibility" },
    { time: "08:41", event: "Five permitted department sources reconciled" },
    { time: "08:41", event: "Two relevant organizational precedents retrieved" },
    { time: "08:42", event: "Decision tension identified and brief delivered" },
  ],
  costOfDelay: {
    assetAtRisk: "Control of a 24-year-old core two-way wing",
    mechanism:
      "Waiting allows the agent to build outside leverage while the organization remains dependent on a later medical checkpoint.",
    reversibility: "low",
  },
  decisionTension: {
    question: "Do we engage before medical certainty is complete?",
    sideA:
      "Scouting and coaching favor immediate engagement to protect the asset and preserve leverage.",
    sideB:
      "Medical and contracts favor more certainty before committing scarce cap flexibility.",
    resolution:
      "Accelerate the medical review and negotiate a protected structure in parallel.",
  },
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
      excerpt: "Projects as a long-term core starter. Recommendation: prioritize for extension.",
    },
    {
      name: "Analytics",
      finding: "High-surplus asset at +4.2, with value contingent on availability.",
      source: "Player Value Model: Marcus Reyes",
      excerpt: "High-surplus asset IF he stays healthy. Model confidence: medium.",
    },
    {
      name: "Medical",
      finding: "Moderate recurring knee flag after 19 missed games; re-evaluation is pending.",
      source: "Injury Log: Marcus Reyes",
      excerpt: "Medical flag: MODERATE. Re-evaluation scheduled preseason.",
    },
    {
      name: "Contracts",
      finding: "Extension-eligible now, Kessler-represented, with tight cap and contentious precedent.",
      source: "Contract Status: Marcus Reyes",
      excerpt: "Prior negotiation with Kessler was contentious and ran past deadline.",
    },
    {
      name: "Coaching",
      finding: "Staff wants Reyes starting and retained, pending medical sign-off.",
      source: "Coaching Note: Reyes rotation",
      excerpt: "Staff supports extending him but wants medical sign-off first.",
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
  nextActions: [
    {
      owner: "Medical",
      action: "Move the knee re-evaluation ahead of formal extension parameters.",
      due: "48 hours",
    },
    {
      owner: "Contracts",
      action: "Model protected extension structures at three cap thresholds.",
      due: "Tomorrow",
    },
    {
      owner: "General Manager",
      action: "Authorize exploratory contact with Kessler without setting price.",
      due: "Today",
    },
  ],
  recommendation:
    "Open structured extension talks with Kessler now, contingent on an accelerated medical review and protected by availability terms; do not defer, but do not let urgency set the price.",
  citedSourceCount: 7,
  citationsVerified: true,
};
