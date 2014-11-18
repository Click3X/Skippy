define([
    'underscore',
    'backbone',
    'models/galleryItem'
], function(_,
    Backbone,
    GalleryItemModel) {

    'use strict';

    var GalleryItemsCollection = Backbone.Collection.extend({
        model: GalleryItemModel,
        parse: function(response) {
            console.log(response);
            this.totalFrames = response.totalcount;
            var data = response.data;
            var gallery = [];
            for(var i = 0, len = data.length; i < len; i++){
                gallery[i] = {
                    'id': data[i].artworkId,
                    'name': data[i].artworkName,
                    'smallUrl': data[i].artworkThumb,
                    'url': data[i].artworkImage
                };
            }
            return gallery;
        }
    });

    return GalleryItemsCollection;
});