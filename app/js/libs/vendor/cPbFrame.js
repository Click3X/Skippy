function PbFrame(options){

    // Canvas Variables
    this.canvas = options.canvas;
    this.canvasw = options.width;
    this.canvash = options.height;
    this.frameSize = 1000;
    this.panStep = 10;
    this.zoomStep = 0.1;
    this.fstage;
    this.bFrame;
    this.bPb;
    this.mFrame;
    this.oldPt;
    this.oldMidPt;



    createjs.Ticker.setFPS(24);

    this.fstage = new createjs.Stage(this.canvas);
    this.fstage.autoClear = false;
    this.fstage.enableDOMEvents(true);

    createjs.Touch.enable(this.fstage);

    //Set up the frame and pb placeholders
    this.bPb = new createjs.Bitmap();
    this.bFrame = new createjs.Bitmap();

    // Add the mouse events
    this.fstage.addEventListener("mousedown", this.HandleMouseDown(this));
    this.fstage.addEventListener("mouseup", this.HandleMouseUp(this));

};

PbFrame.prototype.ResizeFrame = function(pWidth, pHeight){

  var scaleref = pWidth;
  var posref = pHeight;
  if( scaleref > pHeight ){ scaleref = pHeight; posref = pWidth; }

  console.log("scaleref", scaleref);
  console.log("width", pWidth);
  console.log("height", pHeight);

  //$(this.canvas).css('transform-origin', 'left top');
  //$(this.canvas).css('transform', 'scale('+(scaleref/this.frameSize)+') translate('+(((pWidth-(1000*(scaleref/this.frameSize)))/2))+'px, '+(((pHeight-(1000*(scaleref/this.frameSize)))/2))+'px)');

  var translateVal = 'scale('+(scaleref/this.frameSize)+') translate('+(((pWidth-(this.frameSize*(scaleref/this.frameSize)))/2))+'px, '+(((pHeight-(this.frameSize*(scaleref/this.frameSize)))/2))+'px)';

  var scale = scaleref/this.frameSize;

  translateVal = 'scale('+(scale)+')';

  var canvasLeft = (1000 - scale * 1000) / 2;

  var scaleMargin = scale * 107;
  var controlsHeight = scale * 1000 + 100 - scaleMargin * 2;
  var zoom = {right: scale * 126.98 + scaleMargin, top: scale * -276.03};

  return {transform: translateVal, 
    margin: scaleMargin, 
    controlsHeight: controlsHeight, 
    zoom: zoom,
    canvasLeft: canvasLeft};
};

PbFrame.prototype.SetFrameImage = function(pImg, pOrient){
    var fimg = new Image();
    fimg.src = pImg;
    fimg.onload = this.HandleFrameImage(this, pOrient);
};

PbFrame.prototype.HandleFrameImage = function(self, pOrient){
    return function(event){
        self.bFrame = new createjs.Bitmap(event.target);
        self.bFrame.x = 0;
        self.bFrame.y = 0;
        self.bFrame.rotation = 0;
        self.bFrame.name = "frame";
        self.bFrame.cursor = "pointer";

        self.mFrame = new createjs.Shape();
        self.mFrame.x = 0;
        self.mFrame.y = 0;
        if(pOrient=='p'){
            self.mFrame.graphics.beginStroke("#FF0").setStrokeStyle(5).drawRect(200,95,605,810).closePath();
        }else{
            self.mFrame.graphics.beginStroke("#FF0").setStrokeStyle(5).drawRect(90,200,815,610).closePath();
        }

        self.bPb.mask = self.mFrame;

        self.Refresh();
    };
};

PbFrame.prototype.SetPbImage = function(pImg){
    //console.log('loading img 2', pImg);
    var img = new Image();
    img.src = pImg;
    img.onload = this.HandlePbImage(this);

};

PbFrame.prototype.HandlePbImage = function(self){
    return function(event){
        //console.log(self.fstage);
        console.log("img loaded", this.width, this.height);
        //star = new createjs.Shape();
        // the mask's position will be relative to the parent of its target:
        //star.x = 20;
        //star.y = 40;
        // only the drawPolyStar call is needed for the mask to work:
        //star.graphics.beginStroke("#FF0").setStrokeStyle(5).drawRect(98,189,783,565).closePath();
        //console.log(event.target);

        // Find the smaller dimension
        var smallsideref = this.width;
        if( this.height < this.width ) smallsideref = this.height;
        var scaleby = 1+((self.frameSize-smallsideref)/smallsideref);

        console.log('smaller dimension',smallsideref);
        console.log('scale by',scaleby);


        self.bPb = new createjs.Bitmap(event.target);
        //self.bPb.x = self.frameSize/2-(this.width*(self.frameSize/this.width))/2;
        //self.bPb.y = self.frameSize/2-(this.height*(self.frameSize/this.width))/2;
        self.bPb.x = (self.frameSize-(this.width*scaleby))/2;
        self.bPb.y = (self.frameSize-(this.height*scaleby))/2;
        self.bPb.scaleX = scaleby;
        self.bPb.scaleY = scaleby;
        self.bPb.rotation = 0;
        self.bPb.name = "sav";
        self.bPb.cursor = "pointer";
        self.bPb.mask = self.mFrame;

        self.Refresh();
    };
};

PbFrame.prototype.Refresh = function(){
    console.log('refreshing sir');
    this.fstage.removeAllChildren();

    this.fstage.addChild(this.bPb);
    this.fstage.addChild(this.bFrame);

    this.fstage.clear();
    this.fstage.update();
};

PbFrame.prototype.MoveDown = function(){
    //return function(){
        self.bPb.y += self.panStep;
        self.fstage.clear();
        self.fstage.update();
    //};
};

PbFrame.prototype.MoveUp = function(){
    //return function(){
        self.bPb.y -= self.panStep;
        self.fstage.clear();
        self.fstage.update();
    //};
};

PbFrame.prototype.MoveRight = function(){
    //return function(){
        self.bPb.x += self.panStep;
        self.fstage.clear();
        self.fstage.update();
    //};
};

PbFrame.prototype.MoveLeft = function(){
    //return function(){
        self.bPb.x -= self.panStep;
        self.fstage.clear();
        self.fstage.update();
    //};
};

PbFrame.prototype.ZoomIn = function(){
    //return function(){
        this.bPb.scaleX += this.zoomStep;
        this.bPb.scaleY += this.zoomStep;
        this.bPb.x = (this.fstage.getBounds().width-(this.bPb.getBounds().width*this.bPb.scaleX))/2;
        this.bPb.y = (this.fstage.getBounds().height-(this.bPb.getBounds().height*this.bPb.scaleY))/2;
        this.fstage.clear();
        this.fstage.update();
    //};
};

PbFrame.prototype.ZoomOut = function(){
    //return function(){
        this.bPb.scaleX -= this.zoomStep;
        this.bPb.scaleY -= this.zoomStep;
        this.bPb.x = (this.fstage.getBounds().width-(this.bPb.getBounds().width*this.bPb.scaleX))/2;
        this.bPb.y = (this.fstage.getBounds().height-(this.bPb.getBounds().height*this.bPb.scaleY))/2;
        this.fstage.clear();
        this.fstage.update();
    //};
};

PbFrame.prototype.SaveCanvas = function(pName, pEmail, api_path, pSaveResponse){
    var postData = {
        artworkName: '',
        artworkEmail: '',
        artworkImage: '',
        decoy: 'nothinghere',
    };

    // Get png preview of the cloud
    var screenshot = Canvas2Image.saveAsPNG(this.canvas, true);

    this.canvas.parentNode.appendChild(screenshot);
    screenshot.id = "frameimage";
    postData.artworkImage = document.getElementById('frameimage').src;
    this.canvas.parentNode.removeChild(screenshot);

    postData.artworkName = pName;
    postData.artworkEmail = pEmail;

    console.log('saving to: '+api_path+'tinderbox/artwork/add/json');

    $.post(api_path+'tinderbox/artwork/add/json',postData,pSaveResponse);
};

PbFrame.prototype.HandleMouseDown = function(self) {
    return function(event){
        self.oldPt = new createjs.Point(self.fstage.mouseX, self.fstage.mouseY);
        self.oldMidPt = self.oldPt;
        event.addEventListener("mousemove" , self.HandleMouseMove(self));
    };
};

PbFrame.prototype.HandleMouseUp = function(self) {
    return function(event){
        self.fstage.removeEventListener("stagemousemove" , self.HandleMouseMove);
    };
};

PbFrame.prototype.HandleMouseMove = function(self) {
    return function(event){

      self.bPb.x -= (self.oldPt.x-self.fstage.mouseX);
      self.bPb.y -= (self.oldPt.y-self.fstage.mouseY);

      self.oldPt.x = self.fstage.mouseX;
      self.oldPt.y = self.fstage.mouseY;

      self.fstage.clear();
      self.fstage.update();
    }
};
