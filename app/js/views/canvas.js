define([
    'jquery',
    'underscore',
    'backbone',
    'views/abstract',
    'templates',
    'pbcanvas'
], function($,
    _,
    Backbone,
    AbstractView,
    JST,
    PbCanvas) {

    'use strict';

    var CanvasView = AbstractView.extend({
        className: 'canvas-container',
        template: JST['app/js/templates/canvas.ejs'],

        initialize: function(){
            this.render();
            this.canvas = this.$('#pb-canvas');

            this.canvas.attr('width', window.innerWidth);
            this.canvas.attr('height', window.innerHeight);

            this.pbCanvas = new PbCanvas({
                canvas: this.canvas[0],
                width: this.canvas.attr('width'),
                height: this.canvas.attr('height'),
            });
            this.pbCanvas.SetTool("spoon");

            Backbone.pubSub.on('swapTool', this.swapTool, this);
        },

        swapTool: function(opts) {
            this.pbCanvas.SetTool(opts.tool);
        },

        adjustBrush: function(multiplier) {
            this.pbCanvas.SetToolSize(multiplier);
        },

        getPNG: function(){
            return this.pbCanvas.GetPng();
        }
    });

    return CanvasView;
});