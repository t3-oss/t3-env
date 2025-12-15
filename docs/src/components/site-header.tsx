import { Link } from "next-view-transitions";

import { siteConfig } from "@/app/site-config";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { MobileDropdown } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="bg-background/90 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="container h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2 rounded-md h-6 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring ring-offset-background"
          >
            <Icons.logo className="h-6 w-6" />
            <span className="font-medium text-2xl leading-none">{siteConfig.name}</span>
          </Link>
          <MainNav items={siteConfig.mainNav} />
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              size: "icon",
              variant: "ghost",
            })}
          >
            <Icons.gitHub className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          {/* <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-6 w-6 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link> */}
          <ThemeToggle />
          <MobileDropdown
            items={{
              main: siteConfig.mainNav,
              docs: siteConfig.sidebarNav,
            }}
          />
        </div>
      </div>
    </header>
  );
}
