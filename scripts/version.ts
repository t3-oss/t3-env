/**
 * Script for publishing the packages to JSR after an NPM release
 */
export const MODULE = true;

const packages = ["core", "nextjs", "nuxt"];

/**
 * 1. Bump versions
 */
await Bun.$`bunx changeset version`;

for (const pkg of packages) {
  /**
   * 2. Sync versions
   */
  const pkgJson = await Bun.file(`packages/${pkg}/package.json`).json();
  const jsrJson = await Bun.file(`packages/${pkg}/jsr.json`).json();

  jsrJson.version = pkgJson.version;
  await Bun.write(`packages/${pkg}/jsr.json`, JSON.stringify(jsrJson, null, 2));
}
