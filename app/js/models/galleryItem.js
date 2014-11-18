define([
    'underscore',
    'backbone'
], function(_,
    Backbone) {

    'use strict';

    var GalleryItemModel = Backbone.Model.extend({
        defaults: {
			id: '',
            name: '',
			smallUrl: '',
			url: ''
        }
    });

    return GalleryItemModel;
});