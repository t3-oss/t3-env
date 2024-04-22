import createBundleAnalyzer from "@next/bundle-analyzer";
import {
  rehypeCodeDefaultOptions,
  // remarkDocGen,
  remarkDynamicContent,
  remarkInstall,
} from "fumadocs-core/mdx-plugins";
import createMDX from "fumadocs-mdx/config";
import { transformerTwoslash } from "fumadocs-twoslash";
// import { typescriptGen } from "fumadocs-typescript";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  eslint: {
    // Replaced by root workspace command
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.module.noParse = [/typescript\/lib\/typescript.js/];

    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "user-images.githubusercontent.com",
        protocol: "https",
      },
    ],
  },
};

const withMDX = createMDX({
  buildSearchIndex: {
    filter: (v) => {
      return !v.match(/.+\.model\.mdx/);
    },
  },
  mdxOptions: {
    rehypeCodeOptions: {
      transformers: [
        ...rehypeCodeDefaultOptions.transformers,
        transformerTwoslash(),
        {
          name: "fumadocs:remove-escape",
          code(element) {
            for (const line of element.children) {
              if (line.type !== "element") return;
              for (const child of line.children) {
                if (child.type !== "element") return;
                const textNode = child.children[0];
                if (!textNode || textNode.type !== "text") return;

                textNode.value = textNode.value.replace(/\[\\!code/g, "[!code");
              }
            }

            return element;
          },
        },
      ],
    },
    lastModifiedTime: "git",
    remarkPlugins: [
      remarkMath,
      remarkDynamicContent,
      [remarkInstall, { Tabs: "InstallTabs" }],
      // [remarkDocGen, { generators: [typescriptGen()] }],
    ],
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});

export default withAnalyzer(withMDX(config));
