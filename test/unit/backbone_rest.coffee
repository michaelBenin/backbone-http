module.exports = (options, callback) ->
  test_parameters =
    sync: require('../../sync')
    before: require('../lib/build_mocks')

  require('backbone-rest/test/generators/all')(test_parameters, callback)
