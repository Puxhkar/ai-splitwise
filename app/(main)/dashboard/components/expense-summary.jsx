"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function ExpenseSummary({ monthlySpending, totalSpent, categoryDistribution }) {
  // Format monthly data for chart
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const chartData =
    monthlySpending?.map((item) => {
      const date = new Date(item.month);
      return {
        name: monthNames[date.getMonth()],
        amount: item.total,
      };
    }) || [];

  const pieData = categoryDistribution?.map((item) => ({
    name: item.name,
    value: item.value,
  })) || [];

  // Get current year
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  return (
    <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-background/50 to-background/80 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Financial Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {/* SVG Definitions for 3D Effects */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#36d7b7" stopOpacity={1} />
              <stop offset="100%" stopColor="#2aa08a" stopOpacity={1} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="2" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20 shadow-inner">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">This Month</p>
                <h3 className="text-2xl font-black mt-1 text-zinc-900 dark:text-zinc-100">
                  ₹{monthlySpending?.[currentMonth]?.total?.toFixed(2) || "0.00"}
                </h3>
              </div>
              <div className="bg-muted rounded-2xl p-4 border border-border shadow-inner">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Total Year</p>
                <h3 className="text-2xl font-black mt-1 text-zinc-900 dark:text-zinc-100">
                  ₹{totalSpent?.toFixed(2) || "0.00"}
                </h3>
              </div>
            </div>

            <div className="h-64 relative group">
              <p className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Monthly Trend</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff" }}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    formatter={(value) => [`₹${value.toFixed(2)}`, "Spent"]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="url(#barGradient)"
                    radius={[10, 10, 0, 0]}
                    filter="url(#shadow)"
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="h-full flex flex-col">
            <p className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Category Distribution</p>
            <div className="flex-1 h-64 md:h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(31, 41, 55, 0.95)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Pie
                    data={pieData.length > 0 ? pieData : [{ name: "No data", value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    animationBegin={500}
                    animationDuration={1500}
                  >
                    {(pieData.length > 0 ? pieData : [{ name: "No data", value: 1 }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieData.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-zinc-800 dark:text-zinc-200">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-zinc-700 dark:text-zinc-300 text-center mt-6 uppercase tracking-widest font-bold opacity-70">
          Intelligent AI Insights • {currentYear}
        </p>
      </CardContent>
    </Card>
  );
}
