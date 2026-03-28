import { execFileSync } from "node:child_process";
import {
  accessSync,
  existsSync,
  lstatSync,
  readFileSync,
  readlinkSync,
  symlinkSync,
  unlinkSync,
} from "node:fs";
import path from "node:path";

type RuntimeEnv = Record<string, string | boolean | number | undefined>;

function warnWorktree(message: string) {
  console.warn(`[t3-env] ${message}`);
}

function safeLstat(filePath: string) {
  try {
    return lstatSync(filePath);
  } catch {
    return undefined;
  }
}

function safeReadFile(filePath: string) {
  try {
    return readFileSync(filePath, "utf8");
  } catch {
    return undefined;
  }
}

function isUsableEnvFile(filePath: string) {
  const stat = safeLstat(filePath);
  if (!stat) return false;

  if (!stat.isSymbolicLink()) return true;

  try {
    accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function maybeLocalEnvPath(filePath: string) {
  return isUsableEnvFile(filePath) ? filePath : undefined;
}

function parseWorktreeList(output: string) {
  return output
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.split("\n"))
    .map((lines) => {
      const worktreeLine = lines.find((line) => line.startsWith("worktree "));
      if (!worktreeLine) return undefined;
      return worktreeLine.slice("worktree ".length);
    })
    .filter((entry): entry is string => typeof entry === "string");
}

function getMainWorktreeRoot(cwd: string) {
  try {
    const output = execFileSync("git", ["worktree", "list", "--porcelain"], {
      cwd,
      encoding: "utf8",
    });
    return parseWorktreeList(output)[0];
  } catch {
    return undefined;
  }
}

function symlinkPointsTo(symlinkPath: string, targetPath: string) {
  try {
    const rawTarget = readlinkSync(symlinkPath);
    const resolvedTarget = path.resolve(path.dirname(symlinkPath), rawTarget);
    return path.normalize(resolvedTarget) === path.normalize(targetPath);
  } catch {
    return false;
  }
}

function ensureSymlink(symlinkPath: string, targetPath: string) {
  const symlinkStat = safeLstat(symlinkPath);
  if (symlinkStat?.isSymbolicLink() && symlinkPointsTo(symlinkPath, targetPath)) {
    return true;
  }

  try {
    if (symlinkStat) {
      unlinkSync(symlinkPath);
    }
    const relativeTarget = path.relative(path.dirname(symlinkPath), targetPath);
    symlinkSync(relativeTarget || path.basename(targetPath), symlinkPath);
    return true;
  } catch {
    warnWorktree(
      `Failed to create a shared .env symlink at ${symlinkPath}. Continuing by loading the main worktree .env directly.`,
    );
    return false;
  }
}

function parseDotEnv(contents: string) {
  const env: RuntimeEnv = {};

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const normalized = trimmed.startsWith("export ") ? trimmed.slice(7).trimStart() : trimmed;
    const separatorIndex = normalized.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = normalized.slice(0, separatorIndex).trim();
    if (!key) continue;

    let value = normalized.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      const quote = value[0];
      value = value.slice(1, -1);
      if (quote === '"') {
        value = value
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      }
    } else {
      value = value.replace(/\s+#.*$/, "").trimEnd();
    }

    env[key] = value;
  }

  return env;
}

function loadDotEnvFile(filePath: string) {
  const contents = safeReadFile(filePath);
  if (contents === undefined) return undefined;
  return parseDotEnv(contents);
}

function mergeRuntimeEnv(baseRuntimeEnv: RuntimeEnv, loadedEnv: RuntimeEnv) {
  const merged: RuntimeEnv = { ...loadedEnv };

  for (const [key, value] of Object.entries(baseRuntimeEnv)) {
    if (value !== undefined) {
      merged[key] = value;
      continue;
    }

    if (!(key in merged)) {
      merged[key] = undefined;
    }
  }

  return merged;
}

function resolveEnvFilePath(cwd: string) {
  const gitPath = path.join(cwd, ".git");
  const envPath = path.join(cwd, ".env");
  const gitStat = safeLstat(gitPath);

  if (!gitStat) {
    warnWorktree(
      "worktreeDetection could not find a .git entry in the current working directory. Falling back to the runtime environment.",
    );
    return undefined;
  }

  if (gitStat.isDirectory()) {
    return maybeLocalEnvPath(envPath);
  }

  if (!gitStat.isFile()) {
    warnWorktree(
      "worktreeDetection expected .git to be a directory or file. Falling back to the runtime environment.",
    );
    return maybeLocalEnvPath(envPath);
  }

  const gitPointer = safeReadFile(gitPath)?.trim();
  if (!gitPointer?.startsWith("gitdir: ")) {
    warnWorktree(
      "worktreeDetection could not parse the worktree .git file. Falling back to the runtime environment.",
    );
    return maybeLocalEnvPath(envPath);
  }

  const mainWorktreeRoot = getMainWorktreeRoot(cwd);
  if (!mainWorktreeRoot) {
    warnWorktree(
      "worktreeDetection could not resolve the main worktree path from git. Falling back to the runtime environment.",
    );
    return maybeLocalEnvPath(envPath);
  }

  const mainEnvPath = path.join(mainWorktreeRoot, ".env");
  if (!existsSync(mainEnvPath)) {
    warnWorktree(
      `worktreeDetection did not find a canonical .env in the main worktree at ${mainEnvPath}. Skipping shared worktree setup.`,
    );
    return maybeLocalEnvPath(envPath);
  }

  const envStat = safeLstat(envPath);
  if (!envStat) {
    if (ensureSymlink(envPath, mainEnvPath)) {
      return mainEnvPath;
    }
    return mainEnvPath;
  }

  if (envStat.isSymbolicLink()) {
    if (ensureSymlink(envPath, mainEnvPath)) {
      return mainEnvPath;
    }
    return mainEnvPath;
  }

  warnWorktree(
    `worktreeDetection found an existing .env file in this worktree at ${envPath}. Leaving it in place instead of replacing it with a symlink.`,
  );
  return envPath;
}

export function resolveWorktreeRuntimeEnv(baseRuntimeEnv: RuntimeEnv) {
  const envFilePath = resolveEnvFilePath(process.cwd());
  if (!envFilePath) return baseRuntimeEnv;

  const loadedEnv = loadDotEnvFile(envFilePath);
  if (!loadedEnv) {
    warnWorktree(
      `worktreeDetection found ${envFilePath} but could not read it. Falling back to the runtime environment.`,
    );
    return baseRuntimeEnv;
  }

  return mergeRuntimeEnv(baseRuntimeEnv, loadedEnv);
}
