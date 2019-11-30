module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    eqeqeq: [2, "allow-null"],
    "no-duplicate-case": 2,
    "eol-last": ["error", "always"]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
