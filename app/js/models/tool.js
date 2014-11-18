define([
    'underscore',
    'backbone'
], function(_,
    Backbone) {

    'use strict';

    var ToolModel = Backbone.Model.extend({
        defaults: {
            name: '',
            url: '',
            icon: '',
            symbol: ''
        }
    });

    return ToolModel;
});