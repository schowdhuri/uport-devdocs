const { defaults } = require('jest-config')

module.exports = {
  preset: 'jest-puppeteer',
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, '.cache', 'repos', 'plugins'],
  verbose: true
}
