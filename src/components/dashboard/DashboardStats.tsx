import StatCard from "../tenants/StatCard";
import type { DashboardStat } from "./types";

interface DashboardStatsProps {
  stats: DashboardStat[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="dashboard-page__stats-grid">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          badge={stat.badge}
          variant={stat.variant}
        />
      ))}
    </section>
  );
}
