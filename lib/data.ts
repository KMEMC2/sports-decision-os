export type Doc = {
  id: string;
  department: string;
  title: string;
  content: string;
};
export const DOCS: Doc[] = [
  {
    id: "scout-reyes",
    department: "Scouting",
    title: "Scouting Report: Marcus Reyes (SF)",
    content:
      "Marcus Reyes, 24, small forward. Elite two-way wing, top-10 in the league by defensive win shares. High motor, plus perimeter defender, improving off-the-dribble creation. Projects as a long-term core starter. Recommendation: prioritize for extension this offseason.",
  },
  {
    id: "analytics-reyes",
    department: "Analytics",
    title: "Player Value Model: Marcus Reyes",
    content:
      "Reyes RAPTOR-equivalent internal rating: +4.2, 88th percentile among wings. Availability-adjusted value drops to +3.1 due to games missed. Contract-value model flags him as a high-surplus asset IF he stays healthy. Model confidence: medium, penalized for injury variance.",
  },
  {
    id: "medical-reyes",
    department: "Medical",
    title: "Injury Log: Marcus Reyes",
    content:
      "Recurring right knee patellar tendinopathy. Missed 19 games last season across two flare-ups. Load management protocol in place. Medical flag: MODERATE. Long-term outlook uncertain without offseason strengthening program. Re-evaluation scheduled preseason.",
  },
  {
    id: "contracts-reyes",
    department: "Contracts",
    title: "Contract Status: Marcus Reyes",
    content:
      "Entering final year of rookie-scale deal. Extension-eligible now. Represented by agent David Kessler (Apex Sports). Note: prior negotiation for the Banks deal with Kessler was contentious and ran past deadline. Cap space is tight; an extension competes with our other summer priorities.",
  },
  {
    id: "coaching-reyes",
    department: "Coaching",
    title: "Coaching Note: Reyes rotation",
    content:
      "Coaching staff wants Reyes as a starter but is managing his minutes around knee load. Strong locker-room presence. Staff supports extending him but wants medical sign-off first.",
  },
  {
    id: "scout-banks",
    department: "Scouting",
    title: "Scouting Report: Tyrell Banks (PG)",
    content:
      "Tyrell Banks, 26, point guard. Steady starter, elite free-throw rate, average defender. Extension candidate. Durable, no injury history of note.",
  },
  {
    id: "contracts-banks",
    department: "Contracts",
    title: "Contract Status: Tyrell Banks",
    content:
      "Extension-eligible. Represented by agent David Kessler (Apex Sports). Prior negotiation with Kessler was tense but closed. Clean medical file.",
  },
  {
    id: "medical-kostas",
    department: "Medical",
    title: "Injury Log: Andre Kostas",
    content:
      "Andre Kostas, 31, center. Chronic lower-back issue, medical flag: HIGH. Not an extension candidate; on an expiring veteran deal and unlikely to be retained.",
  },
];
