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
    JST,
    tinyscrollbar) {

    'use strict';

    var GalleryView = AbstractView.extend({
        id: 'gallery-container',
        template: JST['app/js/templates/gallery.ejs'],

        events: {
            'click #left': 'animateLeft',
            'click #right': 'animateRight'
        },

        initialize: function() {
            this.render();
            _.bindAll(this, 'addGalleryItems');
        },

        render: function() {
            this.$el.html(this.template());
            this.cacheSelectors();
            this.gallery.scroll(this.addGalleryItems);
            return this;
        },

        cacheSelectors: function() {
            this.gallery = this.$('#gallery');
            this.row1 = this.$('#gal1');
            this.row2 = this.$('#gal2');
        },

        addGalleryItems: function() {
            var view = $(this).parent();
            console.log($(this).scrollLeft(), view.width() * 0.9 - $(this).width());
            if($(this).scrollLeft() >= view.width() * 0.9 - $(this).width()){
                Backbone.pubSub.trigger('addGalleryItems');
            }
        },

        animateLeft: function() {
            var scroll = this.gallery.width() / 4;
            this.gallery.animate({ scrollLeft: '-='+scroll+'px' }, { duration: 100 } );
        },

        animateRight: function() {
            var scroll = this.gallery.width() / 4;
            this.gallery.animate({ scrollLeft: '+='+scroll+'px' }, { duration: 100 } );
        }
    });

    return GalleryView;
});