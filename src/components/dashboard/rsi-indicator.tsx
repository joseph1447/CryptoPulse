
"use client";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useI18n } from "@/hooks/use-i18n";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function RSIIndicator({ value }: { value: number }) {
  const { t } = useI18n();
  const position = Math.max(0, Math.min(100, value));

  const data = [
    { name: "RSI", value: position },
  ];

  const getFillColor = () => {
    if (position < 30) return "hsl(var(--chart-2))"; // Greenish - Oversold
    if (position > 70) return "hsl(var(--destructive))"; // Reddish - Overbought
    return "hsl(var(--primary))"; // Neutral
  };
  
  const color = getFillColor();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 w-full h-8">
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Bar dataKey="value" fill={color} background={{ fill: 'hsl(var(--muted))', radius: 4 }} radius={4} barSize={8} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <span className="text-xs font-mono w-10 text-right">{value.toFixed(1)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('rsi.label', { value: value.toFixed(2) })}</p>
          {position < 30 && <p>{t('rsi.oversold')}</p>}
          {position > 70 && <p>{t('rsi.overbought')}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
