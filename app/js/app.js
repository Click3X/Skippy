define([
    'jquery',
    'underscore',
    'backbone',
    'router/router'
], function($,
    _,
    Backbone,
    Router) {

    'use strict';

    var initialize = function() {
        Backbone.pubSub = _.extend({}, Backbone.Events);
        Backbone.API_PATH = 'http://staging.click3x.com/skippy/phase_2/';
        Router.initialize();
    };

    return {
        initialize: initialize
    };
});