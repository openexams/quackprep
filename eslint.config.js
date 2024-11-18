import eslintPluginPromise from "eslint-plugin-promise";

export default [
  {
    files: ["**/*.js"], // Adjust the glob pattern as needed
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        // Define global variables for Node.js and ES6
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      promise: eslintPluginPromise,
    },
    rules: {
      "no-console": "off", // Allows console statements
      "no-var": "warn", // Warns on using var instead of let/const
      "no-undef": "error", // This rule ensures variables are declared
      "prefer-const": "warn", // Suggests using const if a variable is not reassigned
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Warns on unused variables but ignores those starting with _
      "require-await": "error", // Ensures that async functions have an await expression
      "no-return-await": "warn", // Warns on returning await unnecessarily
      "promise/always-return": "off", // Turns off strict promise handling rules
      "promise/no-return-in-finally": "warn", // Warns about returning inside finally blocks
      "promise/catch-or-return": "warn", // Warns if a promise does not have a catch or return
      "promise/prefer-await-to-then": "warn", // Prefers async/await over .then
      "promise/prefer-await-to-callbacks": "off", // Disables the rule for using async/await over callbacks
    },
  },
];
