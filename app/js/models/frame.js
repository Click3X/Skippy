define([
    'underscore',
    'backbone'
], function(_,
    Backbone) {

    'use strict';

    var FrameModel = Backbone.Model.extend({
        defaults: {
            landscape: '',
            portrait: ''
        }
    });

    return FrameModel;
});