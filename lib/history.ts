export type Decision = {
  id: string;
  date: string;
  situation: string;
  decision: string;
  rationale: string;
  outcome: "good" | "bad" | "mixed" | "pending";
  outcomeNote: string;
  snapshot: string;
  tags: string[];
};

export const HISTORY: Decision[] = [
  {
    id: "dec-kessler-defer",
    date: "2024-08-14",
    situation:
      "Extension-eligible wing (Deron Wells) repped by David Kessler / Apex Sports, entering final year.",
    decision: "Deferred the extension to preserve cap flexibility for a summer target.",
    rationale: "Wanted room for a free-agent center who ultimately signed elsewhere.",
    outcome: "bad",
    outcomeNote:
      "Wells walked in free agency for nothing. The center we saved room for signed with a rival. Net: lost an asset and the target.",
    snapshot:
      "Cap: $6.1M below apron. Roster: thin at wing. Kessler flagged as motivated to move his client.",
    tags: ["Kessler", "wing", "extension", "cap"],
  },
  {
    id: "dec-knee-extend",
    date: "2023-07-02",
    situation: "Extended a starter (Malik Turner) who carried a MODERATE recurring knee flag.",
    decision: "Extended with a built-in load-management protocol and re-eval clauses.",
    rationale: "Medical judged the flag manageable with protocol; on-court value was too high to lose.",
    outcome: "good",
    outcomeNote:
      "Turner missed some games but delivered three strong, available-enough seasons. Protocol held.",
    snapshot:
      "Cap: $10.4M below apron. Medical: MODERATE flag, no structural damage. Coaching: wanted him retained.",
    tags: ["medical", "extension", "knee"],
  },
  {
    id: "dec-overpay-retain",
    date: "2022-07-20",
    situation: "Re-signed a core veteran above internal value to avoid losing him.",
    decision: "Paid a premium to retain.",
    rationale: "Locker-room and continuity concerns.",
    outcome: "bad",
    outcomeNote: "The deal boxed us out of a mid-season upgrade we wanted 14 months later.",
    snapshot: "Cap: $2.3M below apron after the deal. Limited future flexibility.",
    tags: ["cap", "extension", "retention"],
  },
  {
    id: "dec-deadline-buy",
    date: "2024-02-08",
    situation: "Deadline buyer for a rotation wing when a contender lost a starter to injury.",
    decision: "Made the trade, gave up a second-round pick.",
    rationale: "Buyer's market opened up; our playoff window was live.",
    outcome: "good",
    outcomeNote: "The wing stabilized our rotation and we advanced a round further than projected.",
    snapshot: "Cap: room available. Roster: one wing short of a playoff rotation.",
    tags: ["trade", "deadline", "wing"],
  },
  {
    id: "dec-waiver-depth",
    date: "2023-03-01",
    situation: "Claimed a veteran center on an expiring deal off waivers for depth.",
    decision: "Made the claim.",
    rationale: "Injury insurance at center.",
    outcome: "mixed",
    outcomeNote: "Barely played. Low cost, low return. Roster spot could have gone to development.",
    snapshot: "Cap: minor hit. Center depth thin at the time.",
    tags: ["waiver", "center", "depth"],
  },
  {
    id: "dec-pass-buylow",
    date: "2023-11-15",
    situation: "Passed on a buy-low trade for a high-upside young forward.",
    decision: "Held our assets.",
    rationale: "Preferred to keep the picks; upside felt uncertain.",
    outcome: "bad",
    outcomeNote: "He broke out elsewhere the next season. Bias toward inaction cost us.",
    snapshot: "Cap: room available. Had the pick capital to do it.",
    tags: ["trade", "buy-low", "inaction"],
  },
];
