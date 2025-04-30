/**
 * Script for publishing the packages to JSR after an NPM release
 */
export const MODULE = true;

const packages = ["core", "nextjs", "nuxt"];

/**
 * 1. Publish to NPM
 */
await Bun.$`bunx changeset publish`;

for (const pkg of packages) {
  const pkgJson = await Bun.file(`packages/${pkg}/package.json`).json();

  /**
   * 2. Run prepack (if exists)
   */
  if (pkgJson.scripts?.prepack) {
    await Bun.$`bun run prepack`.cwd(`packages/${pkg}`);
  }

  /**
   * 3. Publish to JSR
   */
  await Bun.$`bunx jsr publish --allow-dirty`.cwd(`packages/${pkg}`);
}
