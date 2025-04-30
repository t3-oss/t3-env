/**
 * Script for publishing the packages to JSR after an NPM release
 */
export const MODULE = true;

const packages = ["core", "nextjs", "nuxt"];

for (const pkg of packages) {
  /**
   * 1. Sync versions
   */
  const pkgJson = await Bun.file(`packages/${pkg}/package.json`).json();
  const jsrJson = await Bun.file(`packages/${pkg}/jsr.json`).json();

  jsrJson.version = pkgJson.version;
  await Bun.write(`packages/${pkg}/jsr.json`, JSON.stringify(jsrJson, null, 2));

  /**
   * 2. Run prepack
   */
  await Bun.$`bun run prepack`.cwd(`packages/${pkg}`);

  /**
   * 3. Publish to JSR
   */
  await Bun.$`bunx jsr publish --allow-dirty`.cwd(`packages/${pkg}`);
}

/**
 * 4. Commit and push
 */
await Bun.$`git config user.name "t3-release-bot"`;
await Bun.$`git config user.email "t3-release-bot@users.noreply.github.com"`;
await Bun.$`git add .`;
await Bun.$`git commit -m "chore(release): 📦 publish to JSR"`;
await Bun.$`git push origin main`;
