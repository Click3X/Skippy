define([
    'jquery',
    'underscore',
    'backbone',
    'views/app'
], function($,
    _,
    Backbone,
    AppView) {

    'use strict';

    var newView = null,
        currentView = null,

    Router = Backbone.Router.extend({
        routes: {}
    }),

    initialize = function() {
        var router = new Router();

        Backbone.history.start();
        var appView = new AppView();

        //showView(appView);
    },

    showView = function(view) {
        newView = view;

        (currentView) ? currentView.hide(showNext) : showNext();
    },

    showNext = function() {
        if (currentView) { currentView.clean(); }
        currentView = newView;
        currentView.render();
    };

    return {
        initialize: initialize
    };
});