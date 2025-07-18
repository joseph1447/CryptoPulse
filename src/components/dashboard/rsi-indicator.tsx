"use client";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useI18n } from "@/hooks/use-i18n";

export function RSIIndicator({ value }: { value: number }) {
  const position = Math.min(100, Math.max(0, value));
  const { t } = useI18n();
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
          <p>{t('rsi.label', { value: value.toFixed(2) })}</p>
          {position < 30 && <p>{t('rsi.oversold')}</p>}
          {position > 70 && <p>{t('rsi.overbought')}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
