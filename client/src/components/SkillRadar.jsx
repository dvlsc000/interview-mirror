import React from "react";
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

export default function SkillRadar({ data }) {
    const safeData = Array.isArray(data) ? data : [];

    return (
        <div className="radarWrap">
            <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={safeData} outerRadius="78%">
                    {/* Grid */}
                    <PolarGrid radialLines={false} stroke="rgba(148, 163, 184, 0.18)" />

                    {/* Axis labels */}
                    <PolarAngleAxis
                        dataKey="metric"
                        tick={{ fill: "rgba(248, 250, 252, 0.85)", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />

                    {/* Radius scale */}
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 10]}
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                    />

                    {/* Tooltip */}
                    <Tooltip
                        cursor={{ stroke: "rgba(99,102,241,.35)", strokeWidth: 1 }}
                        contentStyle={{
                            background: "rgba(15, 23, 42, 0.92)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 12,
                            boxShadow: "0 10px 30px rgba(0,0,0,.45)",
                            color: "rgba(248,250,252,.95)",
                        }}
                        labelStyle={{ color: "rgba(248,250,252,.95)", fontWeight: 700 }}
                        itemStyle={{ color: "rgba(226,232,240,.95)" }}
                    />

                    {/* Gradient + glow */}
                    <defs>
                        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="rgba(34,211,238,0.55)" />
                            <stop offset="100%" stopColor="rgba(99,102,241,0.55)" />
                        </linearGradient>

                        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <Radar
                        dataKey="value"
                        stroke="rgba(99,102,241,0.95)"
                        strokeWidth={2}
                        fill="url(#radarFill)"
                        fillOpacity={0.7}
                        dot={{ r: 3, strokeWidth: 0, fill: "rgba(248,250,252,0.9)" }}
                        isAnimationActive
                        animationDuration={650}
                        filter="url(#softGlow)"
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}