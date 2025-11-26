// oxlint-disable-next-line ban-ts-comment
// @ts-nocheck - whatever
import withMdx from "@next/mdx";
import type { NextConfig } from "next";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options } from "rehype-pretty-code";
import { getHighlighter } from "shiki";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // oxlint-disable-next-line require-await
  redirects: async () => [{ source: "/docs", destination: "/docs/introduction", permanent: true }],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withMdx({
  options: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: { dark: "one-dark-pro", light: "min-light" },
          getHighlighter,
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node, id) {
            node.properties.className = ["word"];
            node.properties["data-word-id"] = id;
          },
        } satisfies Options,
      ],
    ],
  },
})(nextConfig);
