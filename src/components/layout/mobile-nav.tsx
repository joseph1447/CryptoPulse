
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CryptoPulseLogo } from "@/components/icons/crypto-pulse-logo";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2"
            onClick={() => setOpen(false)}
          >
            <CryptoPulseLogo className="h-6 w-6" />
            <span className="font-bold">{t('header.appName')}</span>
          </Link>
          <div className="my-4 h-[calc(100vh-8rem)]">
            <div className="flex flex-col space-y-3">
               <MobileLink href="/" onOpenChange={setOpen}>
                  {t('header.dashboard')}
                </MobileLink>
                <MobileLink href="/simulator" onOpenChange={setOpen}>
                  {t('header.simulator')}
                </MobileLink>
                <MobileLink href="/docs" onOpenChange={setOpen}>
                  {t('header.docs')}
                </MobileLink>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface MobileLinkProps extends React.PropsWithChildren {
    href: string;
    disabled?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const pathname = usePathname();
  const basepath = '/' + pathname.split('/').slice(2).join('/');
  
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false);
      }}
      className={cn(
        "text-muted-foreground transition-colors hover:text-primary",
        basepath === href && "text-foreground font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
