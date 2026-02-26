"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipContentProps,
  TooltipIndex,
} from 'recharts';
import type { IncidentsPerCategory } from "@/lib/types";

const CustomTooltip = ({ active, payload, label }: TooltipContentProps<string | number, string>) => {
  const isVisible = active && payload && payload.length;
  return (
    <div className="custom-tooltip" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
      {isVisible && (
        <>
          <p className="label">{`${label} : ${payload[0].value}`}</p>
        </>
      )}
    </div>
  );
};

export const CategoriesChart = ({
    data,
  isAnimationActive = true,
  defaultIndex,
}: {
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
  data: IncidentsPerCategory[];
}) => {
  return (
    <BarChart
      style={{ width: '100%', maxWidth: '600px', maxHeight: '70vh', aspectRatio: 1.618, marginTop:20 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="category" />
      <YAxis width="auto" />
      <Tooltip content={CustomTooltip} isAnimationActive={isAnimationActive} defaultIndex={defaultIndex} />
      <Legend />
      <Bar name="Total Category Incidents" dataKey="total_category_incidents" barSize={100} fill="#8884d8" isAnimationActive={isAnimationActive} />
    </BarChart>
  );
};