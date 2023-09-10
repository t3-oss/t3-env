#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { execa } from "execa";
import { parse as envParse, config as envConfig } from "dotenv";
import path from "path";

const logger = {
  error(...args: unknown[]) {
    console.log(chalk.red(...args));
  },
  warn(...args: unknown[]) {
    console.log(chalk.yellow(...args));
  },
  info(...args: unknown[]) {
    console.log(chalk.cyan(...args));
  },
  success(...args: unknown[]) {
    console.log(chalk.green(...args));
  },
};

const head = <T>(arr: T[]): T | undefined => {
  return arr.length > 0 ? arr[0] : undefined;
};

const tail = <T>(arr: T[]): T[] => {
  return arr.slice(1);
};

const printVariable = (name: string) => {
  const value = process.env[name];
  logger.info(`'${name}' = '${value}'`);
};

const validateCustomVariable = (param: string) => {
  const pattern = /^\w+="[a-zA-Z0-9"=^!?%@_&\-/:;.]"+$/;
  if (!pattern.test(param)) {
    logger.error(
      `Unexpected argument '${param}'. Expected variable in the format of name=value`
    );
    process.exit(2);
  }

  return param;
};

const assignCustomVariables = (variables: string[]) => {
  if (!variables) {
    return;
  }

  const parsedVariables = envParse(
    Buffer.from(variables.map(validateCustomVariable).join("\n"))
  );

  Object.assign(process.env, parsedVariables);
};

const main = async () => {
  const program = new Command().name("t3-env");
  program
    .description("description")
    .option(
      "-e, --env <path...>",
      "parses the file and adds the variables to the environment",
      [".env"]
    )
    .option("-m, --validation <path>", "the `env.mjs` to run for validation")
    .option(
      "-v, --variables <name=value...>",
      "put custom variable <name> with value of <value> into environment"
    )
    .option(
      "-p, --print <name...>",
      "print the value of <variable> to the console and exit"
    )
    .argument(
      "[command]",
      "`command` is the command you want to run. Best practice is to precede this command with ` -- `"
    );

  program.parse(process.argv);

  const options = program.opts();
  const envPaths: string[] = options.env;

  envPaths.forEach((env) => {
    envConfig({ path: path.resolve(env) });
  });

  assignCustomVariables(options.variables);

  if (options.validation) {
    await import(`file://${path.resolve(options.validation)}`);
  }

  if (options.print) {
    options.print.forEach(printVariable);
    process.exit(0);
  }

  const cmd = head(program.args);
  if (!cmd) {
    program.help();
    process.exit(2);
  }

  try {
    await execa(cmd, tail(program.args), {
      stdout: "inherit",
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }

  process.exit(0);
};

main().catch((err) => {
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(
      "An unknown error has occurred. Please open an issue on github with the below:"
    );
    console.log(err);
  }
  process.exit(1);
});
