provider = require './provider'

module.exports =
  activate: ->
      provider.loadPlaycanvas()

  getProvider: ->
      provider
