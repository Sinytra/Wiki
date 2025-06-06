import {defineConfig} from "eslint/config";
import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("next/core-web-vitals"),

    settings: {
        "better-tailwindcss": {
            entryPoint: "app/styles/globals.css",
        },
    },

    plugins: {
        "better-tailwindcss": eslintPluginBetterTailwindcss
    },

    rules: {
        "react/no-unescaped-entities": 0,
        "@next/next/no-img-element": "off",
        "import/no-anonymous-default-export": "off",
        "better-tailwindcss/multiline": ["warn", {
            printWidth: 120,
            preferSingleLine: true,
            group: 'never',
            callees: ["clsx", "cva", "ctl", "twMerge", "cn"]
        }],
        "better-tailwindcss/sort-classes": ["warn", { callees: ["clsx", "cva", "ctl", "twMerge", "cn"] }]
    }
}]);