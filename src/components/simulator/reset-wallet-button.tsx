
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { ResetWalletDialog } from "./reset-wallet-dialog";

export function ResetWalletButton() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { t } = useI18n();

    return (
        <>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('resetWallet.button')}
            </Button>
            <ResetWalletDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    );
}
