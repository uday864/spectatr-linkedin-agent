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
    description: "Fetch campaign analytics for the given date range. DAILY returns one row per campaign per day (SUM across days for period totals). ALL returns one aggregated row per campaign for the entire range. Match pivotValues[0] campaign IDs against linkedin_get_campaigns to scope to this account.",
    input_schema: {
      type: "object" as const,
      properties: {
        startDate: { type: "string", description: "YYYY-MM-DD (inclusive)" },
        endDate: { type: "string", description: "YYYY-MM-DD (inclusive)" },
        granularity: {
          type: "string",
          enum: ["DAILY", "ALL"],
          description: "DAILY = one row per campaign per day. ALL = one aggregated row per campaign for the date range.",
        },
      },
      required: ["startDate", "endDate"],
    },
  },
  {
    name: "linkedin_get_posts",
    description: "Fetch recent organic posts from the LinkedIn organization page along with engagement metrics (likes, comments, shares, impressions, clicks). Returns up to 20 most recent posts. Requires LI_ORG_ID in .env and r_organization_social OAuth scope.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "save_posts",
    description: "Save organic LinkedIn post performance data to posts.json for the dashboard Content tab.",
    input_schema: {
      type: "object" as const,
      properties: {
        posts: {
          type: "array",
          description: "Array of post objects. Each must have: id, date (YYYY-MM-DD), text, likes, comments, shares, impressions, clicks, url.",
          items: { type: "object" },
        },
      },
      required: ["posts"],
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
        kpis30d: {
          type: "object",
          description: "KPIs for last 30 days (same shape as kpis, delta fields = null)",
        },
        camps30d: {
          type: "array",
          description: "Per-campaign metrics for last 30 days (same shape as campaigns, delta fields = null)",
        },
        kpisMtd: {
          type: "object",
          description: "KPIs for current month-to-date (same shape as kpis, delta fields = null)",
        },
        campsMtd: {
          type: "array",
          description: "Per-campaign metrics for current month-to-date (same shape as campaigns, delta fields = null)",
        },
      },
      required: ["kpis", "campaigns", "alerts", "opportunities", "kpis30d", "camps30d", "kpisMtd", "campsMtd"],
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
  {
    name: "fetch_sports_news",
    description: "Fetch top recent sports industry news from RSS feeds (SportsPro, Front Office Sports, Sportico, Insider Sport, SVG Europe). Returns up to 12 articles sorted by most recent.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "save_generated_posts",
    description: "Save 3 AI-generated LinkedIn post drafts for today to generated_posts.json. Each post includes full copy, creative brief, and news source.",
    input_schema: {
      type: "object" as const,
      properties: {
        posts: {
          type: "array",
          description: "Array of exactly 3 post objects",
          items: {
            type: "object",
            properties: {
              type:         { type: "string", enum: ["product", "news"], description: "'product' for product-focused post, 'news' for news/trend post" },
              format_type:  { type: "string", description: "One of: THE PROVOCATION, THE DATA REFRAME, THE MATCHDAY SCENARIO, THE INDUSTRY DIAGNOSIS, THE NUMBERS POST" },
              text:         { type: "string", description: "Full LinkedIn post copy including hashtags" },
              newsHeadline: { type: "string", description: "Headline of the source news article" },
              newsUrl:      { type: "string", description: "URL of the source news article" },
              newsSource:   { type: "string", description: "Publication name e.g. SportsPro" },
              product:      { type: "string", description: "PULSE, AXIS, JORDY AI, or empty string" },
              creative: {
                type: "object",
                description: "Visual brief for the Canva-style mockup card",
                properties: {
                  background: { type: "string", description: "CSS linear-gradient or hex color for card background" },
                  headline:   { type: "string", description: "Bold image headline, max 8 words" },
                  subtext:    { type: "string", description: "Supporting line, max 12 words" },
                  stat:       { type: "string", description: "Most compelling number e.g. '9,500+ clips'" },
                  emoji:      { type: "string", description: "Single emoji capturing the post theme" },
                },
              },
            },
          },
        },
      },
      required: ["posts"],
    },
  },
];
