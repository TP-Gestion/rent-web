import type { MorosityTrend } from "../types/bottomCards";

interface MorosityTrendStyle {
  trendColor: string;
  trendBg: string;
  trendArrow: string;
}

export function useMorosityTrend(trend: MorosityTrend): MorosityTrendStyle {
  if (trend === "up") {
    return {
      trendColor: "#a33030",
      trendBg: "#fdf0f0",
      trendArrow: "↑",
    };
  }

  if (trend === "down") {
    return {
      trendColor: "#2e7d4f",
      trendBg: "#eaf6ef",
      trendArrow: "↓",
    };
  }

  return {
    trendColor: "#2e7d4f",
    trendBg: "#eaf6ef",
    trendArrow: "→",
  };
}
