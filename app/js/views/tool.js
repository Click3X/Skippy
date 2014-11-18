define([
    'jquery',
    'underscore',
    'backbone',
    'views/abstract',
    'templates',
    'tweenmax'
], function($,
    _,
    Backbone,
    AbstractView,
    JST,
    TweenMax) {

    'use strict';

    var ToolView = AbstractView.extend({
        className: 'tool',
        template: JST['app/js/templates/tool.ejs'],

        events: {
            'click': 'swapTool',
            'mouseenter': 'hoverOn',
            'mouseleave': 'hoverOff',
        },

        initialize: function() {
            this.render();
            this.cacheSelectors();
        },

        render: function () {
            this.el.id = this.model.get('name');
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        cacheSelectors: function() {
            this.symbols = this.$('.symbol').children();
            this.img = this.$('img')[0];
        },

        swapTool: function () {
            Backbone.pubSub.trigger('swapTool', {tool: this.model.get('name'), icon: this.model.get('icon')});
            Backbone.pubSub.trigger('hideToolbox');
        },

        hoverOn: function() {
            this.symbols.addClass('hover');
            TweenMax.to(this.img, 0.2, {bottom: '55px'});
        },

        hoverOff: function() {
            this.symbols.removeClass('hover');
            TweenMax.to(this.img, 0.2, {bottom: '50px'});
        }
    });

    return ToolView;
});