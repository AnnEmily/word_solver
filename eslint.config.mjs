import { defineConfig } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: fixupConfigRules(compat.extends(
        "./.eslintrc.gts.json",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
    )),

    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },
}, {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],

    rules: {
        curly: ["error", "all"],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/no-non-null-assertion": "off",
        "node/no-unpublished-import": "off",
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
        }],

        "no-restricted-imports": ["error", {
            paths: [{
                name: "react-router-dom",
                importNames: ["Link"],
                message: "Please use Link from 'cortex-app/src/app/shared/components/link/link' instead.",
            }, {
                name: "@mui/material",
                importNames: ["Link"],
                message: "Please use Link from 'cortex-app/src/app/shared/components/link/link' instead.",
            }, {
                name: "@mui/material/Link",
                importNames: ["default"],
                message: "Please use Link from 'cortex-app/src/app/shared/components/link/link' instead.",
            }],
        }],

        "no-constant-binary-expression": "error",
        "@typescript-eslint/no-inferrable-types": "off",
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "error",
    },
}]);