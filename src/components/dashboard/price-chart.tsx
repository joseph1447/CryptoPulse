"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function PriceChart({ data }: { data: number[] }) {
    const chartData = data.map((price, index) => ({
        day: index + 1,
        price,
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            domain={['dataMin', 'dataMax']}
        />
        <XAxis
            dataKey="day"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            itemStyle={{ color: 'hsl(var(--primary))' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
        />
        <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="url(#colorPrice)" fillOpacity={1} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
