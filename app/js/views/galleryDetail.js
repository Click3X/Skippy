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

    var GalleryDetailView = AbstractView.extend({
        id: 'gallery-detail',
        template: JST['app/js/templates/galleryDetail.ejs'],

        events: {
            'click #close-detail': 'closeDetail',
            'click #left': 'cyclePrev',
            'click #right': 'cycleNext',
            'mouseenter #close-detail': 'hoverDetailOn',
            'mouseleave #close-detail': 'hoverDetailOff',
            'mouseenter .social img': 'hoverSocialOn',
            'mouseleave .social img': 'hoverSocialOff'
        },

        initialize: function(opts) {
            this.model = opts.model;
            this.index = opts.index;
            this.render();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.cacheSelectors();
            return this;
        },

        rerender: function () {
            console.log(this.model);
            this.detailImg.attr('src', this.model.get('url'));
        },

        cacheSelectors: function () {
            this.closeImg = this.$('#close-detail').find('img');
            this.detailImg = this.$('#detail-image');
        },

        closeDetail: function() {
            Backbone.pubSub.trigger('openGallery');
        },

        hoverDetailOn: function() {
            this.closeImg.attr('src', 'images/close-hover.png');
        },

        hoverDetailOff: function() {
            this.closeImg.attr('src', 'images/close.png');
        },

        hoverSocialOn: function(e) {
            switch(e.target.className){
                case 'fb':
                    this.$el.find('.fb').attr('src', 'images/social/facebook-hover.svg');
                    break;
                case 'tw':
                    this.$el.find('.tw').attr('src', 'images/social/twitter-hover.svg');
                    break;
                case 'pin':
                    this.$el.find('.pin').attr('src', 'images/social/pinterest-hover.svg');
            }
        },

        hoverSocialOff: function(e) {
            switch(e.target.className){
                case 'fb':
                    this.$el.find('.fb').attr('src', 'images/social/facebook.svg');
                    break;
                case 'tw':
                    this.$el.find('.tw').attr('src', 'images/social/twitter.svg');
                    break;
                case 'pin':
                    this.$el.find('.pin').attr('src', 'images/social/pinterest.svg');
                    break;
            }
        },

        cyclePrev: function() {
            Backbone.pubSub.trigger('openGalleryDetail', {index: this.index, prev: true});
        },

        cycleNext: function() {
            Backbone.pubSub.trigger('openGalleryDetail', {index: this.index, next: true});
        }
    });

    return GalleryDetailView;
});