import Anthropic from "@anthropic-ai/sdk";

export const TOOLS: Anthropic.Tool[] = [
  {
    name: "linkedin_get_campaigns",
    description: "Fetch all active LinkedIn ad campaigns",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "linkedin_get_analytics",
    description: "Fetch campaign analytics scoped to exact campaign URNs. Always pass campaignUrns from linkedin_get_campaigns to guarantee data comes only from those campaigns. granularity=ALL returns one aggregated row per campaign (use for totals/deltas). granularity=DAILY returns one row per campaign per day (use for 7-day trend arrays — SUM each field across all daily rows per campaign to get totals).",
    input_schema: {
      type: "object" as const,
      properties: {
        startDate: { type: "string", description: "YYYY-MM-DD" },
        endDate: { type: "string", description: "YYYY-MM-DD" },
        granularity: {
          type: "string",
          enum: ["ALL", "DAILY"],
          description: "ALL = one aggregated row per campaign (default). DAILY = one row per campaign per day.",
        },
        campaignUrns: {
          type: "array",
          items: { type: "string" },
          description: "Array of campaign URNs from linkedin_get_campaigns (e.g. ['urn:li:sponsoredCampaign:123','urn:li:sponsoredCampaign:456']). REQUIRED for accuracy — filters analytics to exactly these campaigns.",
        },
      },
      required: ["startDate", "endDate", "campaignUrns"],
    },
  },
  {
    name: "linkedin_get_creatives",
    description: "Fetch ad creative details (copy, headline, CTA)",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "read_history",
    description: "Read rolling N-day performance history",
    input_schema: {
      type: "object" as const,
      properties: {
        days: { type: "number" },
      },
      required: ["days"],
    },
  },
  {
    name: "save_metrics",
    description: "Save today's metrics to the dashboard",
    input_schema: {
      type: "object" as const,
      properties: {
        kpis: {
          type: "object",
          description:
            "{ totalSpend, avgCtr, totalLeads, avgCpl, impressions, spendDelta, ctrDelta, leadsDelta, cplDelta, imprDelta }",
        },
        campaigns: {
          type: "array",
          description:
            "[{ name, st:'a'|'w'|'p', spend, ctr, ctrD, cpl, cplD, leads, freq }]",
        },
        trendData: {
          type: "object",
          description: "{ labels:string[], ctrValues:number[], cplValues:number[] }",
        },
        spendByCampaign: {
          type: "object",
          description: "{ labels:string[], values:number[] }",
        },
        alerts: {
          type: "array",
          description: "[{ t:'r'|'a'|'g', title, meta }]",
        },
        opportunities: {
          type: "array",
          description: "[{ t:'g'|'a', title, meta }]",
        },
      },
      required: ["kpis", "campaigns", "alerts", "opportunities"],
    },
  },
  {
    name: "save_suggestions",
    description: "Save today's AI suggestions",
    input_schema: {
      type: "object" as const,
      properties: {
        suggestions: {
          type: "array",
          description:
            "[{ type:'c'|'cp'|'b'|'t', priority:'HIGH'|'MEDIUM'|'LOW', title, detail, meta }]",
        },
      },
      required: ["suggestions"],
    },
  },
  {
    name: "save_copy_variants",
    description: "Save new ad copy variants for underperforming ads",
    input_schema: {
      type: "object" as const,
      properties: {
        variants: {
          type: "array",
          description:
            "[{ adName, campaign, product, diagnosis, format, cta, headlines:[{label,text}], bodies:[{label,text}] }]",
        },
      },
      required: ["variants"],
    },
  },
  {
    name: "save_new_audiences",
    description: "Save new LinkedIn audience segment recommendations",
    input_schema: {
      type: "object" as const,
      properties: {
        audiences: {
          type: "array",
          description:
            "[{ name, angle, why, product, titles[], industries[], size, geo, headline, body, cta, reason }]",
        },
      },
      required: ["audiences"],
    },
  },
  {
    name: "save_report",
    description: "Save full markdown report to reports/YYYY-MM-DD.md",
    input_schema: {
      type: "object" as const,
      properties: {
        markdown: { type: "string" },
      },
      required: ["markdown"],
    },
  },
];
