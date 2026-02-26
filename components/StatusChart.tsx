"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function StatusChart({ data }: { data: Record<string, number> }) {
    // Color map
    const colors: Record<string, string> = {
        New: "#6366f1",
        "In Review": "#4b5563",
        Investigation: "#f59e0b",
        Resolved: "#10b981",
        Closed: "#6b7280",
    };

    // Convert object to array of {status, value, fill}
    const chart_data = Object.entries(data).map(([status, value]) => ({
        status,
        value,
        fill: colors[status] || "#7b68ee",
    }));

    return (
        <ResponsiveContainer width="65%" height={300} style={{ marginTop: "20px" }}>
            <BarChart data={chart_data} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip animationEasing="ease-in-out" />
                <Legend align="center" />

                {/* Use the fill field in the data */}
                <Bar dataKey="value" name="Incidents" />
            </BarChart>
        </ResponsiveContainer>
    );
}