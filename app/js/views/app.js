define([
    'jquery',
    'underscore',
    'backbone',
    'views/abstract',
    'templates',
    'views/intro',
    'views/canvas',
    'views/tools',
    'views/framing',
    'views/gallery',
    'views/galleryDetail',
    'views/galleryItem',    
    'collections/galleryItems',
    'collections/tools',
    'tweenmax'
], function($,
    _,
    Backbone,
    AbstractView,
    JST,
    IntroView,
    CanvasView,
    ToolsView,
    FramingView,
    GalleryView,
    GalleryDetailView,
    GalItemView,
    GalleryItemsCollection,
    ToolsCollection,
    TweenMax) {

    'use strict';

    var AppView = AbstractView.extend({
        el: '#main-container',
        template: JST['app/js/templates/app.ejs'],

        events: {
            'click #tools': 'toggleTools',
            'click #art-gallery': 'openGallery',
            'click #frame-it': 'openFraming',
            'click #clear-it': 'reloadCanvas',
            'click #tool-plus': 'brushEnlarge',
            'click #tool-minus': 'brushReduce'
        },

        brushSize: 1,

        initialize: function () {
            this.render();
            this.cacheSelectors();
            var introView = new IntroView();
            this.$el.append(introView.el);

            this.loadCanvas();

            var tools = new ToolsCollection();
            var that = this;
            tools.fetch({url: 'data/tools.json', success: function(){
                var toolsView = new ToolsView({collection: tools});
                that.$('#tools').after(toolsView.el);
                that.toolbox = that.$('#toolbox');
            }, error: function(m, r){
                console.log('error in loading and processing the JSON file'+r.responseText);
            }});

            Backbone.pubSub.on('hideToolbox', this.hideToolbox, this);
            Backbone.pubSub.on('openGallery', this.openGallery, this);
            Backbone.pubSub.on('openGalleryDetail', this.openGalleryDetail, this);
            Backbone.pubSub.on('swapTool', this.swapTool, this);
            Backbone.pubSub.on('loadCanvas', this.loadCanvas, this);
            Backbone.pubSub.on('addGalleryItems', this.addGalleryItems, this);
        },

        loadCanvas: function() {
            this.currentView = 'canvas';
            this.bottomButtons.show();
            this.toolIcons.show();
            this.canvasView = new CanvasView();
            this.$el.append(this.canvasView.el);
            this.toolsButton.removeClass('gray');
            this.galleryButton.removeClass('gray');
        },

        reloadCanvas: function() {
            if(confirm('Want Some Fresh PB?')){
                this.loadCanvas();
                this.swapTool({icon: 'images/icon-spoon.png'});
            }
        },

        breakDownCanvas: function() {
            this.hideToolbox();
            this.toolIcons.hide();
            this.bottomButtons.hide();
            this.canvasView.clean();
        },

        cacheSelectors: function() {
            this.bottomButtons = this.$('#bottom-buttons');
            this.toolsButton = this.$('#tools');
            this.galleryButton = this.$('#art-gallery');
            this.toolIcon = this.$('#icon');
            this.toolIcons = this.$('#tool-icons');
        },

        toggleTools: function () {
            if(this.currentView === 'canvas'){
                if(this.toolbox.is(':visible')){
                    this.hideToolbox();
                }
                else{
                    this.toolsButton.addClass('blue');
                    this.toolbox.show();
                }
            }
            else{
                if(this.currentView === 'gallery'){
                    this.galleryView.clean();
                    this.galleryButton.removeClass('blue');
                }
                else if(this.currentView === 'detail'){
                    this.galleryView.clean();
                    this.galleryDetailView.clean();
                    this.galleryButton.removeClass('blue');
                }
                else if(this.currentView === 'framing'){
                    if(!confirm('want some fresh pb?')){
                        return;
                    }
                    this.framingView.clean();
                }
                this.loadCanvas();
            }
        },

        hideToolbox: function() {
            this.toolsButton.removeClass('blue');
            this.toolbox.hide();
        },

        openGallery: function() {
            if(this.currentView === 'gallery'){
                return;
            }
            else if(this.currentView === 'detail'){
                this.galleryView.galleryBox.show();
                this.galleryDetailView.clean();
            }
            else{
                if(this.currentView === 'framing'){
                    if(!this.framingView.restart('gallery')){
                        console.log('returned');
                        return;
                    }
                }
                else{
                    this.breakDownCanvas();
                }

                this.galleryView = new GalleryView();
                this.$el.append(this.galleryView.el);
                this.loadGalleryItems();

                this.toolsButton.addClass('gray');
                this.galleryButton.addClass('blue');
                this.galleryView.galleryBox = this.galleryView.$('#gallery-view');
            }
            this.currentView = 'gallery';
        },

        loadGalleryItems: function() {
            this.galItems = new GalleryItemsCollection();
            this.galIndex = 0;
            var that = this;
            this.galItems.fetch({url: Backbone.API_PATH+'tinderbox/jsonapi/gallerylist/', success: function(response){
                that.addGalleryItems(10, true);
            }, error: function(m, r){
                console.log('error in loading and processing the JSON file'+r.responseText);
            }});
        },

        addGalleryItems: function(max, recurse) {
            if(typeof recurse === 'undefined'){
                if(typeof max === 'undefined'){
                    max = this.galIndex + 10;
                }
                if(this.galItems.length === this.galItems.totalFrames){
                    console.log('hit total frames on server');
                    //event off
                    return;
                }
                if(this.galIndex >= this.galItems.length){
                    var that = this;
                    this.galItems.fetch({remove: false, url: Backbone.API_PATH+'tinderbox/jsonapi/gallerylist/'+this.galItems.length, success: function(response){
                        that.addGalleryItems(max, true);
                    }, error: function(m, r){
                        console.log('error in loading and processing remote JSON'+r.responseText);
                    }});
                    return;
                }
            }
            console.log(this.galItems);
            for(this.galIndex; this.galIndex <= max - 1; this.galIndex++){
                if(this.galIndex >= this.galItems.length){
                    console.log('hit max gallery');
                    break;
                }
                var galItem = this.galItems.at(this.galIndex);
                var galItemView = new GalItemView({model: galItem, index: this.galIndex});
                if(this.galIndex % 2 === 0){
                    this.galleryView.row1.append(galItemView.el);
                }
                else{
                    this.galleryView.row2.append(galItemView.el);
                }
            }
            // this.galleryView.gallery.tinyscrollbar({axis: 'x'});
        },

        openFraming: function() {
            this.currentView = 'framing';
            var png = this.canvasView.getPNG();
            this.framingView = new FramingView({png: png});
            this.$el.append(this.framingView.el);
            this.breakDownCanvas();
            this.toolsButton.addClass('gray');
            this.galleryButton.addClass('gray');
        },

        openGalleryDetail: function(opts) {
            this.currentView = 'detail';
            this.detailIndex = opts.index;
            if(opts.next === true){
                if(this.detailIndex + 1 >= this.galItems.totalFrames){
                    console.log('right bound');
                    return;
                }
                else{
                    this.detailIndex++;
                }
            }
            else if(opts.prev === true){
                if(this.detailIndex - 1 <= -1){
                    console.log('left bound');
                    return;
                }
                else{
                    this.detailIndex--;
                }
            }
            else{
                this.currentDetail = opts.model;
                this.galleryDetailView = new GalleryDetailView({model: this.currentDetail, index: this.detailIndex});
                this.galleryView.$el.append(this.galleryDetailView.el);
                this.galleryView.galleryBox.hide();
                return;
            }
            this.currentDetail = this.galItems.at(this.detailIndex);
            if(typeof this.currentDetail !== 'undefined'){
                this.galleryDetailView.model = this.currentDetail;
                this.galleryDetailView.index = this.detailIndex;
                this.galleryDetailView.rerender();
            }
            else{
                var that = this;
                this.galItems.fetch({remove: false, url: Backbone.API_PATH+'tinderbox/jsonapi/gallerylist/'+this.galItems.length+'/1', success: function(response){
                    that.addGalleryItems();
                    that.currentDetail = that.galItems.at(that.galItems.length - 1);
                    that.galleryDetailView.model = that.currentDetail;
                    that.galleryDetailView.index = that.detailIndex;
                    that.galleryDetailView.rerender();
                }, error: function(m, r){
                    console.log('error in loading and processing the JSON file'+r.responseText);
                }});
            }
        },

        swapTool: function(opts) {
            this.toolIcon.attr({'src': opts.icon, 'class': 'icon-'+opts.tool});
        },

        brushReduce: function() {
            if(this.brushSize <= 0.6){
                return;
            }
            TweenMax.to(this.toolIcon[0], 0.2, {height: '-=5px'});
            this.brushSize = this.brushSize - 0.4;
            this.canvasView.adjustBrush(this.brushSize);
        },

        brushEnlarge: function() {
            if(this.brushSize >= 1.4){
                return;
            }
            TweenMax.to(this.toolIcon[0], 0.2, {height: '+=5px'});
            this.brushSize = this.brushSize + 0.4;
            this.canvasView.adjustBrush(this.brushSize);
        }
    });

    return AppView;
});