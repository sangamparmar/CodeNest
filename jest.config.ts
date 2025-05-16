// export default {
//   setupFilesAfterEnv: ['<rootDir>/setupTests.ts'], // Ensure this points to your setupTests.ts file
//   testEnvironment: 'jsdom', // Required for React testing
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   transform: {
//     '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for TypeScript files
//   },
// };
module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  testMatch: ["**/test/**/*.test.(js|ts)"],
  transform: {
    "^.+\\.(ts|js)$": "ts-jest"
  }
};