import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, expect, test, vi } from "vitest";
import * as z from "zod/v4";
import { createEnv as createEnvNeutral } from "../src/index.ts";
import { createEnv as createEnvNode } from "../src/index.node.ts";

type RepoFixture = {
  cleanup: () => void;
  mainRoot: string;
  worktreeRoot: string;
};

const originalCwd = process.cwd();

afterEach(() => {
  process.chdir(originalCwd);
  vi.restoreAllMocks();
});

function runGit(cwd: string, args: string[]) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
  });
}

function createFixture(options?: {
  localEnv?: string;
  mainEnv?: string;
}): RepoFixture {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "t3-env-worktree-"));
  const mainRoot = path.join(tempRoot, "main");
  const worktreeRoot = path.join(tempRoot, "feature");

  mkdirSync(mainRoot, { recursive: true });

  runGit(mainRoot, ["init"]);
  runGit(mainRoot, ["config", "user.email", "t3-env@example.com"]);
  runGit(mainRoot, ["config", "user.name", "T3 Env"]);

  writeFileSync(path.join(mainRoot, "README.md"), "fixture");
  runGit(mainRoot, ["add", "README.md"]);
  runGit(mainRoot, ["commit", "-m", "init"]);
  runGit(mainRoot, ["worktree", "add", worktreeRoot]);

  if (options?.mainEnv !== undefined) {
    writeFileSync(path.join(mainRoot, ".env"), options.mainEnv);
  }

  if (options?.localEnv !== undefined) {
    writeFileSync(path.join(worktreeRoot, ".env"), options.localEnv);
  }

  return {
    mainRoot,
    worktreeRoot,
    cleanup() {
      rmSync(tempRoot, { force: true, recursive: true });
    },
  };
}

test("loads values from the main worktree .env in a linked worktree", () => {
  const fixture = createFixture({
    mainEnv: "API_KEY=from-main\n",
  });

  try {
    process.chdir(fixture.worktreeRoot);

    const env = createEnvNode({
      server: {
        API_KEY: z.string(),
      },
      runtimeEnv: {},
      worktreeDetection: true,
    });

    expect(env.API_KEY).toBe("from-main");
    expect(lstatSync(path.join(fixture.worktreeRoot, ".env")).isSymbolicLink()).toBe(true);
  } finally {
    process.chdir(originalCwd);
    fixture.cleanup();
  }
});

test("explicit runtime env values override loaded .env values", () => {
  const fixture = createFixture({
    mainEnv: "API_KEY=from-main\n",
  });

  try {
    process.chdir(fixture.worktreeRoot);

    const env = createEnvNode({
      server: {
        API_KEY: z.string(),
      },
      runtimeEnv: {
        API_KEY: "from-runtime",
      },
      worktreeDetection: true,
    });

    expect(env.API_KEY).toBe("from-runtime");
  } finally {
    process.chdir(originalCwd);
    fixture.cleanup();
  }
});

test("keeps an existing linked-worktree .env file in place", () => {
  const fixture = createFixture({
    mainEnv: "API_KEY=from-main\n",
    localEnv: "API_KEY=from-local\n",
  });

  try {
    process.chdir(fixture.worktreeRoot);
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const env = createEnvNode({
      server: {
        API_KEY: z.string(),
      },
      runtimeEnv: {},
      worktreeDetection: true,
    });

    expect(env.API_KEY).toBe("from-local");
    expect(lstatSync(path.join(fixture.worktreeRoot, ".env")).isSymbolicLink()).toBe(false);
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining("Leaving it in place instead of replacing it with a symlink."),
    );
  } finally {
    process.chdir(originalCwd);
    fixture.cleanup();
  }
});

test("warns and skips linking when the main worktree .env is missing", () => {
  const fixture = createFixture();

  try {
    process.chdir(fixture.worktreeRoot);
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const env = createEnvNode({
      server: {
        API_KEY: z.string(),
      },
      runtimeEnv: {
        API_KEY: "runtime",
      },
      worktreeDetection: true,
    });

    expect(env.API_KEY).toBe("runtime");
    expect(existsSync(path.join(fixture.worktreeRoot, ".env"))).toBe(false);
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining("did not find a canonical .env in the main worktree"),
    );
  } finally {
    process.chdir(originalCwd);
    fixture.cleanup();
  }
});

test("loads the local .env when called from the main worktree", () => {
  const fixture = createFixture({
    mainEnv: "API_KEY=from-main-root\n",
  });

  try {
    process.chdir(fixture.mainRoot);

    const env = createEnvNode({
      server: {
        API_KEY: z.string(),
      },
      runtimeEnv: {},
      worktreeDetection: true,
    });

    expect(env.API_KEY).toBe("from-main-root");
  } finally {
    process.chdir(originalCwd);
    fixture.cleanup();
  }
});

test("neutral build warns and falls back cleanly", () => {
  const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

  const env = createEnvNeutral({
    server: {
      API_KEY: z.string(),
    },
    runtimeEnv: {
      API_KEY: "runtime",
    },
    worktreeDetection: true,
  });

  expect(env.API_KEY).toBe("runtime");
  expect(consoleWarn).toHaveBeenCalledWith(
    expect.stringContaining("only available in the Node/Bun runtime build"),
  );
});

test("creates a reusable symlink to the main worktree .env", () => {
  const fixture = createFixture({
    mainEnv: "API_KEY=from-main\n",
  });

  try {
    process.chdir(fixture.worktreeRoot);

    createEnvNode({
      server: {
        API_KEY: z.string(),
      },
      runtimeEnv: {},
      worktreeDetection: true,
    });

    const linkedEnvPath = path.join(fixture.worktreeRoot, ".env");
    expect(lstatSync(linkedEnvPath).isSymbolicLink()).toBe(true);
    expect(readFileSync(linkedEnvPath, "utf8")).toBe("API_KEY=from-main\n");
  } finally {
    process.chdir(originalCwd);
    fixture.cleanup();
  }
});
