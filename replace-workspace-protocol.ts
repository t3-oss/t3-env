/// <reference types="bun-types" />
export const MODULE = true;

declare module "bun" {
  interface BunFile {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    json(): Promise<any>;
  }
}

/**
 * Hack to replace the workspace protocol with the actual version
 */

const corePkg = await Bun.file("../core/package.json").json();
const version = corePkg.version;

const workspacePkg = await Bun.file("package.json").json();
workspacePkg.dependencies["@t3-oss/env-core"] = version;
await Bun.write("package.json", JSON.stringify(workspacePkg, null, 2));
