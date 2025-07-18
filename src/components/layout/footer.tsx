"use client";

import Link from 'next/link';
import { useI18n } from '@/hooks/use-i18n';
import { CryptoPulseLogo } from '../icons/crypto-pulse-logo';

export default function Footer() {
    const { t } = useI18n();

    return (
        <footer className="border-t border-border/40 bg-background/95">
            <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-4 sm:mb-0">
                    <CryptoPulseLogo className="h-5 w-5" />
                    <span>© {new Date().getFullYear()} {t('header.appName')}</span>
                </div>
                <nav className="flex gap-4">
                    <Link href="/policies" className="hover:text-primary transition-colors">
                        {t('footer.policies')}
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
