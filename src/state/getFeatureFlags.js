if (process.env.NODE_ENV === 'production') {
  module.exports = require('./getFeatureFlags.prod');
} else {
  module.exports = require('./getFeatureFlags.stage');
}
