import { createPreset } from "fumadocs-ui/tailwind-plugin";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./content/**/*.mdx",
    "./mdx-components.tsx",
    "../node_modules/fumadocs-ui/dist/**/*.js",
  ],
  presets: [createPreset()],
  theme: {
    extend: {
      colors: {
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        cal: ["var(--font-cal)"],
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
        "repeat-gradient-to-r":
          "repeating-linear-gradient(to right, var(--tw-gradient-stops))",
        "repeat-gradient-to-br":
          "repeating-linear-gradient(to bottom right, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "80%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "80%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        updown: {
          "from, to": {
            transform: "translateY(-20px)",
          },
          "50%": {
            transform: "translateY(20px)",
          },
        },
        light: {
          "from, to": {
            opacity: "0.7",
          },
          "50%": {
            opacity: "1",
          },
        },
        stroke: {
          from: {
            "stroke-dasharray": "1000",
          },
          to: {
            "stroke-dasharray": "1000",
            "stroke-dashoffset": "2000",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s",
        "fade-down": "fade-down 0.5s",
        stroke: "stroke 5s linear infinite",
        light: "light 2s ease-in-out infinite",
        updown: "updown 3s ease-in-out infinite",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
