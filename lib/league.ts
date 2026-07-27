export type FeedEvent = {
  id: string;
  type: "Trade" | "Waiver" | "Rumor" | "Injury" | "Signing";
  headline: string;
  detail: string;
  hoursAgo: number;
  affectsUs: boolean;
  relatedDocIds?: string[];
};

export const FEED: FeedEvent[] = [
  {
    id: "evt-kessler-wings",
    type: "Rumor",
    headline: "Agent David Kessler is testing the market for extension-eligible wings",
    detail:
      "League sources say Apex Sports is quietly gauging interest in its extension-eligible wing clients ahead of the deadline.",
    hoursAgo: 2,
    affectsUs: true,
    relatedDocIds: [
      "scout-reyes",
      "analytics-reyes",
      "medical-reyes",
      "contracts-reyes",
      "coaching-reyes",
    ],
  },
  {
    id: "evt-rival-pg",
    type: "Trade",
    headline: "Western rival acquires veteran point guard in three-team deal",
    detail: "The move deepens their backcourt and signals a push to contend this season.",
    hoursAgo: 4,
    affectsUs: false,
  },
  {
    id: "evt-wing-injury",
    type: "Injury",
    headline: "Starting wing on a contender out 6-8 weeks with an ankle sprain",
    detail: "Creates a possible buyer at the wing position before the deadline.",
    hoursAgo: 6,
    affectsUs: true,
    relatedDocIds: ["scout-reyes", "contracts-reyes"],
  },
  {
    id: "evt-waiver-center",
    type: "Waiver",
    headline: "Veteran center placed on waivers by a rebuilding team",
    detail: "Expiring deal, limited minutes projected for any claiming team.",
    hoursAgo: 9,
    affectsUs: true,
    relatedDocIds: ["medical-kostas"],
  },
  {
    id: "evt-signing-guard",
    type: "Signing",
    headline: "Restricted free agent guard signs an offer sheet elsewhere",
    detail: "Original team has 48 hours to match.",
    hoursAgo: 13,
    affectsUs: false,
  },
  {
    id: "evt-lottery-team-fire-coach",
    type: "Signing",
    headline: "Lottery team fires head coach, elevates lead assistant on interim basis",
    detail: "Front office says the search for a permanent hire begins this offseason.",
    hoursAgo: 16,
    affectsUs: false,
  },
  {
    id: "evt-draft-combine",
    type: "Trade",
    headline: "Two lottery teams swap future second-round picks in minor cap-clearing move",
    detail: "Neither side expected to be active again before the deadline.",
    hoursAgo: 20,
    affectsUs: false,
  },
  {
    id: "evt-vet-buyout",
    type: "Waiver",
    headline: "Contender-bound veteran clears waivers, expected to sign with a playoff team",
    detail: "Buyout market continues to thin out ahead of the deadline.",
    hoursAgo: 24,
    affectsUs: false,
  },
];
