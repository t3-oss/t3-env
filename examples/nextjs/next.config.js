import createJiti from "jiti";
const jiti = createJiti(new URL(import.meta.url).pathname);

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./app/env");

/** @type {import('next').NextConfig} */
export default {
  eslint: { ignoreDuringBuilds: true },
};
