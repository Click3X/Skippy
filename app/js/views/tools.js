define([
    'jquery',
    'underscore',
    'backbone',
    'views/abstract',
    'templates',
    'views/tool'
], function($,
    _,
    Backbone,
    AbstractView,
    JST,
    ToolView) {

    'use strict';

    var ToolsView = AbstractView.extend({
        template: JST['app/js/templates/tools.ejs'],

        id: 'toolbox',

        initialize: function (options) {
            _.bindAll(this, 'addAll', 'addOne');
            this.tools = options.collection;
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
            this.addAll();
            return this;
        },

        addAll: function (tools) {
            this.tools.each(this.addOne);
        },

        addOne: function (tool) {
            var view = new ToolView({model: tool});
            this.$el.append(view.el);
        }
    });

    return ToolsView;
});