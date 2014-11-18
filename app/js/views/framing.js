define([
    'jquery',
    'underscore',
    'backbone',
    'views/abstract',
    'templates',
    'collections/frames',
    'pbframe'
], function($,
    _,
    Backbone,
    AbstractView,
    JST,
    FramesCollection,
    PbFrame) {

    'use strict';

    var FramingView = AbstractView.extend({
        id: 'framing-view',
        template: JST['app/js/templates/framing.ejs'],
        template2: JST['app/js/templates/framing2.ejs'],
        template3: JST['app/js/templates/framing3.ejs'],
        template4: JST['app/js/templates/framing4.ejs'],
        finished: false,

        events: {
            'mouseenter #restart': 'hoverRestartOn',
            'mouseleave #restart': 'hoverRestartOff',
            'click #restart, #make-more': 'restart',
            'click #select-left': 'cyclePrevFrame',
            'click #select-right': 'cycleNextFrame',
            'click #zoom-in': 'zoomIn',
            'click #zoom-out': 'zoomOut',
            'click #rotate': 'rotate',
            'click #done': 'done',
            'click #open-gallery-form': 'openGalleryForm',
            'click #submit-gallery': 'submitToGallery',
            'mouseenter .social img': 'hoverSocialOn',
            'mouseleave .social img': 'hoverSocialOff'
        },

        initialize: function(opts) {
            this.render();
            this.orientation = 'l';
            this.png = opts.png;

            this.frames = new FramesCollection();
            this.fIndex = 0;
            var that = this;
            this.frames.fetch({url: 'data/frames.json', success: function(){
                that.currentFrame = that.frames.at(0);
                that.importCanvas();
            }, error: function(m, r){
                console.log('error in loading and processing the JSON file'+r.responseText);
            }});
            this.cacheSelectors();

            this.pbFrame = new PbFrame({
                canvas: this.canvas[0],
            });
            _.bindAll(this, 'importCanvas');
            $(window).on('resize', this.importCanvas);
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        cacheSelectors: function() {
            this.restartDiv = this.$('#restart');
            this.restartImage = this.restartDiv.find('img');
            this.controls = this.$('.controls');
            this.framewrap = this.$('#frame-container');
            this.canvas = this.$('#pb-frame');
            this.canvasNav = this.$('.canvas-nav');
        },

        importCanvas: function() {
            this.framewrap.height(window.innerHeight * 0.8);
            var resize = this.pbFrame.ResizeFrame(this.framewrap.width(), this.framewrap.height());

            this.scaleMargin = resize.margin;
            this.canvasLeft = resize.canvasLeft;
            this.canvas.css({
                transformOrigin: 'left top', 
                left: this.canvasLeft + 'px', 
                transform: resize.transform, 
                top: (-1 * this.scaleMargin) + 'px'
            });
            this.setFrameImage();
            this.pbFrame.SetPbImage(this.png);

            this.controlsHeight = resize.controlsHeight;
            this.controls.css('top', this.controlsHeight + 'px');

            if(window.innerWidth > 1000){
                this.restartRight = (window.innerWidth - 1000) / 2;
            }
            else{
                this.restartRight = window.innerWidth * 0.1;
            }
            this.restartRight += this.canvasLeft;

            this.restartDiv.css({'top': '73px', right: this.restartRight + 'px'});
            //this.canvasNav.css({top: resize.zoom.top + 'px', right: resize.zoom.right + 'px'});
            //this.canvasRight = resize.zoom.right;
        },

        setFrameImage: function(){
            if(this.orientation === 'l'){
                this.pbFrame.SetFrameImage(this.currentFrame.get('landscape'), 'l');
            }
            else{
                this.pbFrame.SetFrameImage(this.currentFrame.get('portrait'), 'p');
            }
        },

        hoverRestartOn: function() {
            this.restartImage.attr('src', 'images/start-over-hover.png');
        },

        hoverRestartOff: function() {
            this.restartImage.attr('src', 'images/start-over.png');
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
                    break;
                case 'dl':
                    this.$el.find('.dl').attr('src', 'images/social/download-hover.svg');
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
                case 'dl':
                    this.$el.find('.dl').attr('src', 'images/social/download.svg');
            }
        },

        restart: function(gallery) {
            if(!this.finished){
                console.log(this.finished);
                if(confirm('get some fresh pb?')){
                    if(!gallery){
                        Backbone.pubSub.trigger('loadCanvas');
                    }
                    this.clean();
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                Backbone.pubSub.trigger('loadCanvas');
                this.clean();
            }
        },

        cyclePrevFrame: function() {
            if(--this.fIndex <= -1){
                this.fIndex = this.frames.length - 1;
            }
            this.currentFrame = this.frames.at(this.fIndex);
            this.setFrameImage();
        },

        cycleNextFrame: function() {
            if(++this.fIndex >= this.frames.length){
                this.fIndex = 0;
            }
            this.currentFrame = this.frames.at(this.fIndex);
            this.setFrameImage();
        },

        zoomIn: function() {
            this.pbFrame.ZoomIn();
        },

        zoomOut: function() {
            this.pbFrame.ZoomOut();
        },

        rotate: function() {
            if(this.orientation === 'p'){
                this.orientation = 'l';
                this.pbFrame.SetFrameImage(this.currentFrame.get('landscape'), 'l');
                this.canvas.css('top', (-1*this.scaleMargin)+'px');
                this.controls.css('top', this.controlsHeight + 'px');
                this.restartDiv.css('right', this.restartRight + 'px');
                //this.canvasNav.css('right', this.canvasRight + 'px');
            }
            else if(this.orientation === 'l'){
                this.orientation = 'p';
                this.pbFrame.SetFrameImage(this.currentFrame.get('portrait'), 'p');
                this.canvas.css('top', 0);
                this.controls.css('top', (this.controlsHeight + this.scaleMargin * 2) + 'px');
                this.restartDiv.css('right', (this.restartRight + this.scaleMargin) + 'px');
                //this.canvasNav.css('right', (this.canvasRight + this.scaleMargin) + 'px');
            }
        },

        swapControls: function(template){
            this.controls.empty();
            this.controls.append(template);
        },

        done: function() {
            this.pbName = this.$('#name').val();
            if(!this.pbName){
                this.$('#name').addClass('red');
                return;
            }
            this.swapControls(this.template2());
        },

        openGalleryForm: function() {
            this.swapControls(this.template3());
        },

        submitToGallery: function() {
            this.pbEmail = this.$('#email').val();
            if(!this.pbEmail){
                this.$('#email').addClass('red');
                return;
            }
            this.pbFrame.SaveCanvas(this.pbName, this.pbEmail, Backbone.API_PATH, this.confirm);
            this.swapControls(this.template4());
            this.finished = true;
        },

        confirm: function() {
            console.log('submitted, thanks');
        }
    });

    return FramingView;
});