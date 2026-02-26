"use client";

type Props = {
  total_incidents: number;
  total_open_incidents: number;
  total_overdue_incidents: number;
  total_incidents_due_soon: number;
  avg_resolution_time: number;
  sla_compliance: number;
};

export function KpiCard({
  total_incidents,
  total_open_incidents,
  total_overdue_incidents,
  total_incidents_due_soon,
  avg_resolution_time,
  sla_compliance,
}: Props) {
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      <Card title="Total incidents" value={total_incidents} inverted />
      <Card title="Open incidents" value={total_open_incidents} />
      <Card title="Overdue incidents" value={total_overdue_incidents} />
      <Card title="Incidents due soon (in 3 days)" value={total_incidents_due_soon} />
      <Card title="Avg resolution time (days)" value={avg_resolution_time} />
      <Card title="SLA compliance (%)" value={sla_compliance} />
    </div>
  );
}

function Card({
  title,
  value,
  inverted = false,
}: {
  title: string;
  value: number;
  inverted?: boolean;
}) {
  return (
    <div
      className={`
        flex flex-col justify-between p-4 w-36 h-32 rounded-xl border-2
        transition-all cursor-pointer
        ${
          inverted
            ? "bg-black text-white border-black dark:border-white hover:bg-white hover:text-black"
            : "bg-white text-black border-black hover:bg-black hover:text-white"
        }
      `}
    >
      <p className="text-sm">{title}</p>
      <p className="text-4xl font-extrabold">{value}</p>
    </div>
  );
}