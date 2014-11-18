define([
    'jquery',
    'underscore',
    'backbone',
    'views/abstract',
    'templates'
], function($,
    _,
    Backbone,
    AbstractView,
    JST) {

    'use strict';

    var GalleryitemView = AbstractView.extend({
        className: 'gallery-item',
        template: JST['app/js/templates/galleryItem.ejs'],

        events: {
            'click': 'openGalleryDetail'
        },

        initialize: function (opts) {
            this.render();
            this.index = opts.index;
        },

        render: function () {
            this.$el.html(this.template(this.model));
            return this;
        },

        openGalleryDetail: function() {
            Backbone.pubSub.trigger('openGalleryDetail', {model: this.model, index: this.index});
        }
    });

    return GalleryitemView;
});