import { Link } from "next-view-transitions";
import Balancer from "react-wrap-balancer";

import { siteConfig } from "@/app/site-config";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";

export default function IndexPage() {
  return (
    <section className="container flex flex-col justify-center overflow-hidden items-center min-h-[calc(100vh-4.0625rem)] gap-6 pb-8 pt-6 md:py-10">
      <div className="max-w-5xl space-y-8">
        <h1
          className="font-cal animate-fade-up bg-linear-to-br from-indigo-700 via-accent-foreground to-fuchsia-500 bg-clip-text text-center text-5xl/[3rem] font-bold text-transparent opacity-0 drop-shadow-xs md:text-7xl/[5rem]"
          style={{
            animationDelay: "0.20s",
            animationFillMode: "forwards",
          }}
        >
          <Balancer>
            Framework agnostic validation for{" "}
            <span className="underline decoration-destructive decoration-wavy decoration-from-font underline-offset-4">
              type-safe
            </span>{" "}
            environment variables.
          </Balancer>
        </h1>
        <p
          className="animate-fade-up text-center dark:text-muted-foreground/80 text-muted-foreground opacity-0 md:text-xl"
          style={{
            animationDelay: "0.30s",
            animationFillMode: "forwards",
          }}
        >
          <Balancer>{siteConfig.description}</Balancer>
        </p>
        <div
          className="flex justify-center gap-4 animate-fade-up opacity-0"
          style={{
            animationDelay: "0.40s",
            animationFillMode: "forwards",
          }}
        >
          <Link
            href={siteConfig.links.docs}
            className={buttonVariants({ size: "lg" })}
          >
            Documentation
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.github}
            className={buttonVariants({
              variant: "outline-solid",
              size: "lg",
            })}
          >
            <Icons.gitHub className="mr-1 h-4 w-4" />
            <span>GitHub</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
