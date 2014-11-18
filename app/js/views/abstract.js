define([
    'jquery',
    'underscore',
    'backbone'
], function($,
    _,
    Backbone) {

    'use strict';

    var AbstractView = function(options) {
        Backbone.View.apply(this, [options]);
    };

    _.extend(AbstractView.prototype, Backbone.View.prototype, {
        initialize: function() {
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        },

        show: function() {
            this.$el.fadeIn(0);
        },

        hide: function(cb, scope, params) {
            this.$el.fadeOut(0, function() {
                if (typeof cb === 'function') {
                    if (typeof params === 'undefined') { params = []; }
                    cb.apply(scope, params);
                }
            });
        },

        test: function(obj) {
            console.log(obj);
        },

        /**
        Cleans up the view.  Unbinds its events and removes it from the DOM.

        @method clean

        @return {null}
        **/
        clean: function() {
            this.undelegateEvents();
            this.remove();
        }
    });

    AbstractView.extend = Backbone.View.extend;

    return AbstractView;
});