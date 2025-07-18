"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCrypto } from "@/hooks/use-crypto";
import { CryptoPulseLogo } from "@/components/icons/crypto-pulse-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Wallet, Settings, Languages, Sun, Moon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { ApiKeyModal } from "./api-key-modal";
import { useState } from "react";
import { useI18n } from "@/hooks/use-i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const { gusdBalance, portfolioValue, initialized } = useCrypto();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, setLocale, locale } = useI18n();
  const { theme, setTheme } = useTheme();

  const totalValue = gusdBalance + portfolioValue;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <CryptoPulseLogo className="h-6 w-6" />
              <span className="font-bold font-headline">{t('header.appName')}</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <NavLink href="/">{t('header.dashboard')}</NavLink>
              <NavLink href="/simulator">{t('header.simulator')}</NavLink>
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="flex items-center space-x-2 text-sm">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              {initialized ? (
                <span className="font-mono text-primary">
                  {totalValue.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              ) : (
                <Skeleton className="h-6 w-24" />
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocale('en')} disabled={locale === 'en'}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale('es')} disabled={locale === 'es'}>
                  Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={t('header.toggleTheme')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsModalOpen(true)}
              aria-label={t('header.settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <ApiKeyModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
