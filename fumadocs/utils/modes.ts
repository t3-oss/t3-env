/* eslint-disable import/no-relative-packages -- required */
import { LibraryIcon } from "lucide-react";

import { NextjsIcon, NuxtIcon } from "@/components/icons";
import { version as coreVersion } from "../../packages/core/package.json";
import { version as nextVersion } from "../../packages/nextjs/package.json";
import { version as nuxtVersion } from "../../packages/nuxt/package.json";

export interface Mode {
  param: string;
  name: string;
  package: string;
  description: string;
  version: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const modes: Mode[] = [
  {
    param: "core",
    name: "Core",
    package: "@t3-oss/env-core",
    description: "The core library",
    version: coreVersion,
    icon: LibraryIcon,
  },
  {
    param: "nextjs",
    name: "Next.js",
    package: "@t3-oss/env-nextjs",
    description: "Preconfigured for Next.js",
    version: nextVersion,
    icon: NextjsIcon,
  },
  {
    param: "nuxt",
    name: "Nuxt",
    package: "@t3-oss/env-nuxt",
    description: "Preconfigured for Nuxt",
    version: nuxtVersion,
    icon: NuxtIcon,
  },
];
