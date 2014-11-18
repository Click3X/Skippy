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

    var IntroView = AbstractView.extend({
        template: JST['app/js/templates/intro.ejs'],

        id: 'intro-wrap',

        events: {
            'click': 'startPeel'
        },

        initialize: function() {
            this.render();
            this.thePeel = this.$('#the-peel');
            _.bindAll(this, 'removePeel', 'peel', 'removeIntro');
        },

        startPeel: function() {
            TweenMax.to(this.thePeel[0], 0.2, {bottom: '-180px', onComplete: this.peel, ease: 'Linear.easeNone'});
        },

        peel: function() {
            TweenMax.to(this.$('#intro-center')[0], 0.3, {opacity: 0});
            TweenMax.to(this.el, 0.75, {height: '0%', onComplete: this.removePeel, ease: 'Linear.easeNone'});
            //TweenMax.to(this.$('#the-peel')[0], 0.3, {height: '+=100px'});
        },

        removePeel: function() {
            TweenMax.to(this.thePeel[0], 0.3, {bottom: '90px', onComplete: this.removeIntro, ease: 'Linear.easeNone'});
        },

        removeIntro: function() {
            this.clean();
        }
    });

    return IntroView;
});