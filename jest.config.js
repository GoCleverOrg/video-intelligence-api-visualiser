module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: [
      'js',
      'json',
      'vue',
      'ts'
    ],
    transform: {
      '^.+\\.ts$': 'ts-jest',
      '^.+\\.vue$': 'vue-jest'
    },
    globals: {
      'ts-jest': {
        tsConfig: 'tsconfig.json'
      }
    }
  };
  