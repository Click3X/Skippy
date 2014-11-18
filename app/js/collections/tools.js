define([
    'underscore',
    'backbone',
    'models/tool'
], function(_,
    Backbone,
    ToolsModel) {

    'use strict';

    var ToolsCollection = Backbone.Collection.extend({
        model: ToolsModel
    });

    return ToolsCollection;
});