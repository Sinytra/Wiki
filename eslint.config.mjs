import {defineConfig} from "eslint/config";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import {nextJsConfig} from "@repo/eslint-config/next-js";

export default defineConfig([
    ...nextJsConfig,
    {
        settings: {
            "better-tailwindcss": {
                entryPoint: "src/app/styles/globals.css",
            },
        },

        plugins: {
            "better-tailwindcss": eslintPluginBetterTailwindcss
        },

        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "react/no-unescaped-entities": 0,
            "@next/next/no-img-element": "off",
            "import/no-anonymous-default-export": "off",
            "better-tailwindcss/multiline": ["warn", {
                printWidth: 120,
                preferSingleLine: true,
                group: 'never',
                callees: ["clsx", "cva", "ctl", "twMerge", "cn"]
            }],
            "better-tailwindcss/sort-classes": ["warn", {callees: ["clsx", "cva", "ctl", "twMerge", "cn"]}]
        }
    }
]);