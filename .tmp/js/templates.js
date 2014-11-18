define(function(){

this["JST"] = this["JST"] || {};

this["JST"]["app/js/templates/app.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div id="top-buttons" class="button-row">\n\t<div id="tools" class="overlay-button">drawing tools</div>\n\t<div id="tool-icons">\n\t\t<div id="tool-minus" class="tool-size"></div>\n\t\t<img id="icon" class="icon-spoon" src="images/icon-spoon.png" />\n\t\t<div id="tool-plus" class="tool-size"></div>\n\t</div>\n\t<div id="art-gallery" class="overlay-button">art gallery</div>\n</div>\n<div id="bottom-buttons" class="button-row">\n\t<div id="clear-it" class="overlay-button">clear it</div>\n\t<div id="frame-it" class="overlay-button">frame it</div>\n</div>';
return __p
};

this["JST"]["app/js/templates/canvas.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<canvas id="pb-canvas"></canvas>';
return __p
};

this["JST"]["app/js/templates/framing.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div id="frame-container">\n\t<canvas id="pb-frame" width="1000" height="1000"></canvas>\n</div>\n<div id="restart">\n\t<span>start again</span>\n\t<img src="images/start-over.png" />\n</div>\n<div class="controls">\n\t<div id="frame-select">\n\t\t<div class="select" id="select-left"></div>\n\t\t<span>select frame</span>\n\t\t<div class="select" id="select-right"></div>\n\t\t<div class="canvas-nav">\n\t\t\t<div id="zoom-in"></div>\n\t\t\t<div id="rotate"></div>\n\t\t\t<div id="zoom-out"></div>\n\t\t</div>\n\t</div>\n\t<p>Give your masterpiece a name!</p>\n\t<input id="name" placeholder="Enter your name here" />\n\t<div id="done" class="button">Done</div>\n</div>';
return __p
};

this["JST"]["app/js/templates/framing2.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div id="open-gallery-form" class="button">Submit to Gallery</div>\n<p>Share your masterpiece with the world!</p>\n<div class="social">\n  <img class="dl" src="../images/social/download.svg" />\n  <img class="fb" src="../images/social/facebook.svg" />\n  <img class="tw" src="../images/social/twitter.svg" />\n  <img class="pin" src="../images/social/pinterest.svg" />\n</div>\n<div id="make-more" class="button">Make more art!</div>';
return __p
};

this["JST"]["app/js/templates/framing3.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<p class="artist-name">' +
((__t = ( this.pbName )) == null ? '' : __t) +
'</p>\n<p>An artist must take credit for their work!</p>\n<input id="email" placeholder="Enter your e-mail" />\n<div id="submit-gallery" class="button">Submit</div>';
return __p
};

this["JST"]["app/js/templates/framing4.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<p class="artist-name">' +
((__t = ( this.pbName )) == null ? '' : __t) +
'</p>\n<p>Thank you for submitting your work to the gallery!</p>\n<div id="make-more" class="button">Make More Art!</div>';
return __p
};

this["JST"]["app/js/templates/gallery.ejs"] = function(data) {
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
__p += '<div id="gallery-view">\n\t<p class="title">PB Art Gallery</p>\n\t<p class="subtitle">from across the World Wide Web*</p>\n\t<section id="gallery">\n\t\t<section id="gal1" class="gallery-row"></section>\n\t\t<section id="gal2" class="gallery-row"></section>\n\t</section>\n\n\t<div class="see-more-wrapper clearfix">\n\t\t<div id="see-more">\n\t\t\t<div id="left" class="button"><</div>\n\t\t\t<div id="right" class="button">></div>\n\t\t</div>\n\t\t<p class="disclaimer">* Skippy Yippee is not responsible for the content of our contributor\'s art</p>\n\t</div>\n</div>\n\n\n';
 jQuery('head').append('<style>#outline {position:fixed;z-index:1000;bottom:50px;right:50px;} .outlines {outline:1px solid rgba(255, 0, 0, 0.3);}</style>');
    jQuery('body').append('<input id=\"outline\" type=\"button\">');

    jQuery('#outline').click(function() {
        jQuery('*').toggleClass('outlines');
   });
    ;

return __p
};

this["JST"]["app/js/templates/galleryDetail.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div id="close-detail">\n\t<span>close</span>\n\t<img src="images/close.png" />\n</div>\n<img id="detail-image" src="' +
((__t = ( this.model.get('url') )) == null ? '' : __t) +
'" />\n<div class="controls">\n\t<div id="left"></div>\n\t<span>browse</span>\n\t<div id="right"></div>\n</div>\n<div class="social">\n  <img class="fb" src="../images/social/facebook.svg" />\n  <img class="tw" src="../images/social/twitter.svg" />\n  <img class="pin" src="../images/social/pinterest.svg" />\n</div>';
return __p
};

this["JST"]["app/js/templates/galleryItem.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<img src="' +
((__t = ( this.model.get('smallUrl') )) == null ? '' : __t) +
'" />';
return __p
};

this["JST"]["app/js/templates/intro.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div id="intro-center">\n\t<div id="intro-inner">\n\t\t<img id="yippee-intro" src="images/yippee.png" />\n\t\t<img id="pbart" src="images/pbart.png" />\n\t\t<p id="pb-spiel">Nothing beats the feeling of dipping into a fresh new jar of Skippy. The untouched peanut butter is your blank canvas. It could be anything - a canine portrait, a picturesque landscape, or even an abstract masterpiece. No matter what it is, it\'ll be delicious.</p>\n\t\t<p id="peel-begin">Peel to begin</p>\n\t\t<div id="peel-circle"></div>\n\t</div>\n</div>\n<div id="the-peel"></div>';
return __p
};

this["JST"]["app/js/templates/tool.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div class="symbol">' +
((__t = ( this.model.get('symbol') )) == null ? '' : __t) +
'</div>\n<img src="' +
((__t = ( this.model.get('url') )) == null ? '' : __t) +
'" />';
return __p
};

this["JST"]["app/js/templates/tools.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div class="triangle"></div>\n<div id="sizing">tap your + / - keys to change sizes</div>';
return __p
};

  return this["JST"];

});