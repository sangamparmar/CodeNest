export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    transformIgnorePatterns: [
        'node_modules/(?!(@uiw|colors-named)/)', // Allow Jest to transform specific ES Modules
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // Use ts-jest for TypeScript files
        '^.+\\.(js|jsx)$': 'babel-jest', // Use babel-jest for JavaScript files
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
        '^@/(.*)$': '<rootDir>/src/$1', // Resolve '@/' alias
        '\\.(svg|jpg|jpeg|png)$': '<rootDir>/__mocks__/fileMock.js', // Mock static file imports
    },
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json', // Ensure ts-jest uses the correct TypeScript config
        },
    },
};