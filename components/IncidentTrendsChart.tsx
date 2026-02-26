"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { useState } from 'react';
import type { IncidentsPerCategory } from "@/lib/types";

export function IncidentTrendsChart({
    past_week_incidents,
    past_month_incidents,
    past_six_months_incidents,
    all_time_incidents }: {
        past_week_incidents: IncidentsPerCategory[];
        past_month_incidents: IncidentsPerCategory[];
        past_six_months_incidents: IncidentsPerCategory[];
        all_time_incidents: IncidentsPerCategory[];
    }) {

    const all_time_data = all_time_incidents;
    const week_data = past_week_incidents;
    const month_data = past_month_incidents;
    const six_months_data = past_six_months_incidents;

    const [data, setData] = useState(all_time_data);

    return (
        <div className="flex flex-col space-y-4 items-start">
            <LineChart
                style={{ width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
                responsive
                data={data}
                margin={{
                    top: 20,
                    right: 50,
                    left: 50,
                    bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 12 }}
                />
                <YAxis width={50} allowDecimals={false} />
                <Tooltip />
                <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: 20 }}
                />
                <Line
                    type="monotone"
                    dataKey="total_category_incidents"
                    name="Total Incidents"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey="total_category_closed_incidents"
                    name="Closed Incidents"
                    stroke="#82ca9d"
                />
                <RechartsDevtools />
            </LineChart>
            <div className="flex items-center space-x-4">
                <button onClick={() => setData(week_data)} className="bg-black text-white rounded-md text-md font-medium w-40 px-4 py-2">Past week</button>
                <button onClick={() => setData(month_data)} className="bg-black text-white rounded-md text-md font-medium w-40 px-4 py-2">Past 30 days</button>
                <button onClick={() => setData(six_months_data)} className="bg-black text-white rounded-md text-md font-medium w-40 px-4 py-2">Past six months</button>
                <button onClick={() => setData(all_time_data)} className="bg-black text-white rounded-md text-md font-medium w-40 px-4 py-2">All time</button>
            </div>
        </div>
    );
}