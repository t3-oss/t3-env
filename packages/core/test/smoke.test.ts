import { expect, expectTypeOf, test, describe } from "vitest";

import { createEnv } from "..";
import z from "zod";

function ignoreErrors(cb: () => void) {
  try {
    cb();
  } catch (err) {
    // ignore
  }
}

test("client vars should be correctly prefixed", () => {
  ignoreErrors(() => {
    createEnv({
      clientPrefix: "FOO_",
      server: {},
      client: {
        FOO_BAR: z.string(),
        // @ts-expect-error - no FOO_ prefix
        BAR: z.string(),
      },
      runtimeEnv: {},
    });
  });
});

test("runtimeEnvStrict enforces all keys", () => {
  createEnv({
    clientPrefix: "FOO_",
    server: {},
    client: {},
    runtimeEnvStrict: {},
  });

  createEnv({
    clientPrefix: "FOO_",
    server: {},
    client: { FOO_BAR: z.string() },
    runtimeEnvStrict: { FOO_BAR: "foo" },
  });

  createEnv({
    clientPrefix: "FOO_",
    server: { BAR: z.string() },
    client: {},
    runtimeEnvStrict: { BAR: "foo" },
  });

  createEnv({
    clientPrefix: "FOO_",
    server: { BAR: z.string() },
    client: { FOO_BAR: z.string() },
    runtimeEnvStrict: { BAR: "foo", FOO_BAR: "foo" },
  });

  createEnv({
    clientPrefix: "FOO_",
    server: {},
    client: { FOO_BAR: z.string() },
    runtimeEnvStrict: {
      FOO_BAR: "foo",
      // @ts-expect-error - FOO_BAZ is extraneous
      FOO_BAZ: "baz",
    },
  });

  ignoreErrors(() => {
    createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      // @ts-expect-error - BAR is missing
      runtimeEnvStrict: {
        FOO_BAR: "foo",
      },
    });
  });
});

describe("return type is correctly inferred", () => {
  test("simple", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        BAR: "bar",
        FOO_BAR: "foo",
      },
    });

    expectTypeOf(env).toEqualTypeOf<{
      BAR: string;
      FOO_BAR: string;
    }>();

    expect(env).toMatchObject({
      BAR: "bar",
      FOO_BAR: "foo",
    });
  });

  test("with transforms", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string().transform(Number) },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        BAR: "123",
        FOO_BAR: "foo",
      },
    });

    expectTypeOf(env).toEqualTypeOf<{
      BAR: number;
      FOO_BAR: string;
    }>();

    expect(env).toMatchObject({
      BAR: 123,
      FOO_BAR: "foo",
    });
  });

  test("without client vars", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: {},
      runtimeEnvStrict: {
        BAR: "bar",
      },
    });

    expectTypeOf(env).toEqualTypeOf<{
      BAR: string;
    }>();

    expect(env).toMatchObject({
      BAR: "bar",
    });
  });
});

describe("errors when validation fails", () => {
  test("envs are missing", () => {
    expect(() =>
      createEnv({
        clientPrefix: "FOO_",
        server: { BAR: z.string() },
        client: { FOO_BAR: z.string() },
        runtimeEnv: {},
      })
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid environment variables"`);
  });

  test("envs are invalid", () => {
    expect(() =>
      createEnv({
        clientPrefix: "FOO_",
        server: { BAR: z.string().transform(Number).pipe(z.number()) },
        client: { FOO_BAR: z.string() },
        runtimeEnv: {
          BAR: "123abc",
          FOO_BAR: "foo",
        },
      })
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid environment variables"`);
  });

  test("with custom error handler", () => {
    expect(() =>
      createEnv({
        clientPrefix: "FOO_",
        server: { BAR: z.string().transform(Number).pipe(z.number()) },
        client: { FOO_BAR: z.string() },
        runtimeEnv: {
          BAR: "123abc",
          FOO_BAR: "foo",
        },
        onValidationError: (err) => {
          const barError = err.flatten().fieldErrors["BAR"]?.[0] as string;
          throw new Error(`Invalid variable BAR: ${barError}`);
        },
      })
    ).toThrowErrorMatchingInlineSnapshot(`
      "Invalid variable BAR: Expected number, received nan"
    `);
  });
});

describe("errors when server var is accessed on client", () => {
  test("with default handler", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        BAR: "bar",
        FOO_BAR: "foo",
      },
      isServer: false,
    });

    expect(() => env.BAR).toThrowErrorMatchingInlineSnapshot(
      `"❌ Attempted to access a server-side environment variable on the client"`
    );
  });

  test("with custom handler", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        BAR: "bar",
        FOO_BAR: "foo",
      },
      isServer: false,
      onInvalidAccess: (key) => {
        throw new Error(`Attempted to access ${key} on the client`);
      },
    });

    expect(() => env.BAR).toThrowErrorMatchingInlineSnapshot(
      `"Attempted to access BAR on the client"`
    );
  });
});
