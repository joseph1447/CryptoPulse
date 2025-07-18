"use client";

import { useCrypto } from "@/hooks/use-crypto";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface ApiKeyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ApiKeyModal({ isOpen, onOpenChange }: ApiKeyModalProps) {
  const { apiKeys, setApiKeys } = useCrypto();
  const { toast } = useToast();
  const { t } = useI18n();

  const formSchema = z.object({
    key: z.string().min(1, t('apiKeyModal.validation.keyRequired')),
    secret: z.string().min(1, t('apiKeyModal.validation.secretRequired')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
      secret: "",
    },
  });

  useEffect(() => {
    if (apiKeys) {
      form.reset(apiKeys);
    }
  }, [apiKeys, form]);

  useEffect(() => {
    if (isOpen) {
      form.reset(apiKeys || { key: "", secret: "" });
    }
  }, [isOpen, apiKeys, form]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setApiKeys(values);
    toast({
      title: t('apiKeyModal.saveSuccessTitle'),
      description: t('apiKeyModal.saveSuccessDescription'),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('apiKeyModal.title')}</DialogTitle>
          <DialogDescription>
            {t('apiKeyModal.description')}
          </DialogDescription>
        </DialogHeader>
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>{t('apiKeyModal.securityTitle')}</AlertTitle>
          <AlertDescription>
            {t('apiKeyModal.securityDescription')}
          </AlertDescription>
        </Alert>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('apiKeyModal.apiKeyLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('apiKeyModal.apiKeyPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('apiKeyModal.apiSecretLabel')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t('apiKeyModal.apiSecretPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{t('apiKeyModal.saveButton')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
