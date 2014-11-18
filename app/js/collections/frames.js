define([
    'underscore',
    'backbone',
    'models/frame'
], function(_,
    Backbone,
    FrameModel) {

    'use strict';

    var FrameCollection = Backbone.Collection.extend({
        model: FrameModel,
        parse: function(response) {
            return response;
        }
    });

    return FrameCollection;
});