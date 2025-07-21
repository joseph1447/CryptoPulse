
"use client";

import { useState } from "react";
import { useCrypto } from "@/hooks/use-crypto";
import { useI18n } from "@/hooks/use-i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const CONFIRMATION_TEXT = "default";

export function ResetWalletDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [confirmationInput, setConfirmationInput] = useState("");
    const { resetWallet } = useCrypto();
    const { t } = useI18n();
    const { toast } = useToast();

    const handleReset = () => {
        if (confirmationInput === CONFIRMATION_TEXT) {
            resetWallet();
            toast({
                title: t('resetWallet.successTitle'),
                description: t('resetWallet.successDescription'),
            });
            onClose();
            setConfirmationInput("");
        }
    };
    
    const handleClose = (open: boolean) => {
        if (!open) {
            onClose();
            setConfirmationInput("");
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={handleClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('resetWallet.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('resetWallet.description')}
                        <span className="font-bold text-foreground">{CONFIRMATION_TEXT}</span>
                        {t('resetWallet.descriptionCont')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-2">
                    <Label htmlFor="confirmation-input" className="sr-only">
                        {t('resetWallet.inputLabel')}
                    </Label>
                    <Input
                        id="confirmation-input"
                        value={confirmationInput}
                        onChange={(e) => setConfirmationInput(e.target.value)}
                        placeholder={t('resetWallet.inputPlaceholder')}
                        autoComplete="off"
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('resetWallet.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleReset}
                        disabled={confirmationInput !== CONFIRMATION_TEXT}
                    >
                        {t('resetWallet.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
