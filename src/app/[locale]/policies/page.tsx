"use client";

import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PoliciesPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-headline">{t('policies.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('policies.subtitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>{t('policies.p1')}</p>
          <p>{t('policies.p2')}</p>
          <p>{t('policies.p3')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
