/**
 * Script for bumping the version of the packages to a canary version
 * and then publishing them to NPM and JSR
 */
export const MODULE = true;

const packages = ["core", "nextjs", "nuxt"];

const commitHash = (await Bun.$`git rev-parse --short HEAD`.text()).trim();

for (const pkg of packages) {
  const pkgJson = await Bun.file(`packages/${pkg}/package.json`).json();
  const jsrJson = await Bun.file(`packages/${pkg}/jsr.json`).json();

  const oldVersion = pkgJson.version;
  const [major, minor, patch] = oldVersion.split(".").map(Number);
  const newVersion = `${major}.${minor}.${patch + 1}-canary.${commitHash}`;

  pkgJson.version = newVersion;
  jsrJson.version = newVersion;
  const content = `${JSON.stringify(pkgJson, null, "\t")}\n`;
  const newContent = content.replace(
    new RegExp(`"@t3-oss/\\*": "${oldVersion}"`, "g"),
    `"@t3-oss/*": "${newVersion}"`,
  );

  await Bun.write(`packages/${pkg}/package.json`, newContent);
  await Bun.write(`packages/${pkg}/jsr.json`, JSON.stringify(jsrJson, null, 2));

  /**
   * 2. Run prepack (if exists)
   */
  if (pkgJson.scripts?.prepack) {
    await Bun.$`bun run prepack`.cwd(`packages/${pkg}`);
  }

  /**
   * 3. Publish to NPM
   */
  await Bun.$`npm publish --access public --tag canary`.cwd(`packages/${pkg}`);

  /**
   * 4. Publish to JSR
   */
  await Bun.$`bunx jsr publish --allow-dirty`.cwd(`packages/${pkg}`);
}
