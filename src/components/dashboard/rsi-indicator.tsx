"use client";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function RSIIndicator({ value }: { value: number }) {
  const position = Math.min(100, Math.max(0, value));
  const color =
    position < 30
      ? "bg-green-500"
      : position > 70
      ? "bg-red-500"
      : "bg-primary";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 w-full">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden relative">
              <div
                className={cn("h-full rounded-full transition-all", color)}
                style={{ width: `${position}%` }}
              />
            </div>
            <span className="text-xs font-mono w-10 text-right">{value.toFixed(1)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>RSI: {value.toFixed(2)}</p>
          {position < 30 && <p>Status: Potentially Oversold</p>}
          {position > 70 && <p>Status: Potentially Overbought</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
