export default {
  testEnvironment: "node",
  roots: ["<rootDir>/tests/unit"],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
};
