
"use client";

import { WalletSummary } from "@/components/simulator/wallet-summary";
import { HoldingsTable } from "@/components/simulator/holdings-table";
import { useCrypto } from "@/hooks/use-crypto";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/hooks/use-i18n";
import { ResetWalletButton } from "@/components/simulator/reset-wallet-button";

export default function SimulatorPage() {
    const { initialized } = useCrypto();
    const { t } = useI18n();

    if (!initialized) {
        return (
             <div className="space-y-8">
                <h1 className="text-3xl font-bold font-headline">{t('simulator.title')}</h1>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-headline">{t('simulator.title')}</h1>
            <ResetWalletButton />
        </div>
        <WalletSummary />
        <HoldingsTable />
    </div>
  );
}
