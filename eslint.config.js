import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

const { configs: typescriptConfigs } = typescript;

export default [
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": typescript,
      prettier: prettier,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...typescriptConfigs.recommended.rules,
      ...prettier.rules,
      "no-console": "warn",
      "prettier/prettier": "off",
      curly: ["error", "all"],
      "lines-between-class-members": ["error", "always"],

      "@typescript-eslint/no-unsafe-assignment": ["off"],
      "@typescript-eslint/no-unsafe-call": ["off"],
      "@typescript-eslint/no-unsafe-return": ["off"],
      "@typescript-eslint/no-unsafe-member-access": ["off"],
      "@typescript-eslint/no-unsafe-argument": ["off"],
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",

      eqeqeq: "error",
    },
  },
];
