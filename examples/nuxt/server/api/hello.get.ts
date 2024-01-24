import { env } from "~~/env";

export default defineEventHandler(() => {
    return {
        secret: `Server says ${env.SECRET}`,
    };
});
