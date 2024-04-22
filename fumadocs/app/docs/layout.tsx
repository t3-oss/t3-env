import { DocsLayout } from "fumadocs-ui/layout";
import type { ReactNode } from "react";
import { layoutOptions } from "../layout.config";

export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return <DocsLayout {...layoutOptions}>{children}</DocsLayout>;
}
