"use client";

import { WalletSummary } from "@/components/simulator/wallet-summary";
import { HoldingsTable } from "@/components/simulator/holdings-table";
import { useCrypto } from "@/hooks/use-crypto";
import { Skeleton } from "@/components/ui/skeleton";

export default function SimulatorPage() {
    const { initialized } = useCrypto();

    if (!initialized) {
        return (
             <div className="space-y-8">
                <h1 className="text-3xl font-bold font-headline">Trading Simulator</h1>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Trading Simulator</h1>
      <WalletSummary />
      <HoldingsTable />
    </div>
  );
}
