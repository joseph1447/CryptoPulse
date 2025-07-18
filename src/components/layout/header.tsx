
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCrypto } from "@/hooks/use-crypto";
import { CryptoPulseLogo } from "@/components/icons/crypto-pulse-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Wallet, Languages, Sun, Moon, ChevronsUpDown } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
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
  const basepath = pathname.split('/').slice(2).join('/');
  const isActive = href === `/${basepath}`;

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
    exchangeRate 
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
                  {formatCurrency(displayValue)}
                </span>
              ) : (
                <Skeleton className="h-6 w-24" />
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2">
                  {currency}
                  <ChevronsUpDown className="ml-2 h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrency('USD')} disabled={currency === 'USD'}>
                  USD
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency('CRC')} disabled={currency === 'CRC'}>
                  CRC
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
          </div>
        </div>
      </header>
    </>
  );
}
