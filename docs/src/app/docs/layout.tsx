import { siteConfig } from "@/app/site-config";
import { DocsSidebarNav } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: {
        default: "Docs ⋅ T3 Env",
        template: "%s ⋅ T3 Env",
    },
};

export default function DocsLayout(props: { children: ReactNode }) {
    return (
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[256px_minmax(0,1fr)] lg:gap-10">
            <aside className="fixed top-[4.0625rem] z-30 -ml-2 -mr-2 hidden h-[calc(100vh-4.0625rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                <ScrollArea className="py-6 pr-4 lg:py-8">
                    <DocsSidebarNav items={siteConfig.sidebarNav} />
                </ScrollArea>
            </aside>
            <main className="pb-16 max-w-3xl">{props.children}</main>
        </div>
    );
}
