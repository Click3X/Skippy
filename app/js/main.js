'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        tweenmax: {
            exports: 'TweenMax'
        },
        pbcanvas: {
            deps: [
                'easel',
                'canvas2image'
            ],
            exports: 'PbCanvas'
        },
        canvas2image: {
            deps: [
                'base64'
            ],
            exports: 'Canvas2Image'
        },
        pbframe: {
            deps: [
                'easel',
                'canvas2image'
            ],
            exports: 'PbFrame'
        },
        base64: {
            exports: 'Base64'
        },
        easel: {
            exports: 'createjs'
        }
    },
    paths: {
        jquery: '../js/libs/bower/jquery/jquery',
        backbone: '../js/libs/bower/backbone/backbone',
        underscore: '../js/libs/bower/underscore/underscore',
        tweenmax: '../js/libs/bower/greensock/src/minified/TweenMax.min',
        pbcanvas: '../js/libs/vendor/cPbCanvas',
        pbframe: '../js/libs/vendor/cPbFrame',
        canvas2image: '../js/libs/vendor/canvas2image',
        base64: '../js/libs/vendor/base64',
        easel: '../js/libs/vendor/easeljs-0.7.1.min',
        tinyscrollbar: '../js/libs/jquery.tinyscrollbar.min.js'
    }
});

require([
    'app'
], function (App) {
    window.App = App;

    jQuery(function() {
        App.initialize();
    });
});