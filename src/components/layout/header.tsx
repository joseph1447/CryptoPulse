
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCrypto } from "@/hooks/use-crypto";
import { CryptoPulseLogo } from "@/components/icons/crypto-pulse-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Wallet, Sun, Moon, Settings } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useI18n } from "@/hooks/use-i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { Separator } from "../ui/separator";
import { MobileNav } from "./mobile-nav";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const basepath = '/' + pathname.split('/').slice(2).join('/');
  const isActive = href === basepath;

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
  const { 
    gusdBalance, 
    portfolioValue, 
    initialized, 
    currency, 
    setCurrency, 
    exchangeRate,
    apiConnected,
  } = useCrypto();
  const { t, setLocale, locale } = useI18n();
  const { theme, setTheme } = useTheme();

  const totalValue = gusdBalance + portfolioValue;
  const displayValue = currency === 'CRC' ? totalValue * exchangeRate : totalValue;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol'
    }).format(value);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <CryptoPulseLogo className="h-6 w-6" />
              <span className="font-bold font-headline">{t('header.appName')}</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <NavLink href="/">{t('header.dashboard')}</NavLink>
              <NavLink href="/simulator">{t('header.simulator')}</NavLink>
              <NavLink href="/docs">{t('header.docs')}</NavLink>
            </nav>
          </div>
          
          <MobileNav />

          <div className="flex flex-1 items-center justify-end space-x-2">
            
            <div className="flex items-center gap-2 text-sm font-medium">
               <div className={cn("h-2.5 w-2.5 rounded-full", apiConnected ? 'bg-green-500' : 'bg-red-500')} />
               <span className="text-muted-foreground hidden sm:inline">
                 {apiConnected ? t('header.apiConnected') : t('header.apiDisconnected')}
               </span>
            </div>
            
            <Separator orientation="vertical" className="h-6 mx-2" />

            <div className="flex items-center space-x-2 text-sm">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              {initialized ? (
                <span className="font-mono text-primary">
                  {formatCurrency(displayValue)}
                </span>
              ) : (
                <Skeleton className="h-6 w-24" />
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">{t('header.settings')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('header.settings')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{t('header.theme')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>{t('header.light')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>{t('header.dark')}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{t('header.language')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setLocale('en')} disabled={locale === 'en'}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale('es')} disabled={locale === 'es'}>
                  Español
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{t('header.currency')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setCurrency('USD')} disabled={currency === 'USD'}>
                  USD
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency('CRC')} disabled={currency === 'CRC'}>
                  CRC
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </header>
    </>
  );
}
