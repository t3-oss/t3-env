import { env } from "./env";

(async () => {
  console.log(env.EXAMPLE_TOKEN);
  console.log(env.WORKER_POOL_COUNT);
})();
