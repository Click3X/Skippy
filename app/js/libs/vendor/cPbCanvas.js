function PbCanvas(options){

    // Canvas Variables
    this.canvas = options.canvas;
    this.canvasw = options.width;
    this.canvash = options.height;
    this.stage;
    this.wrapper;
    this.shadowWrapper;
    this.shadowbWrapper;
    this.hiliteWrapper;
    this.drawingCanvas;
    this.shadowCanvas;
    this.shadowbCanvas;
    this.hiliteCanvas;
    this.toolScale = 1;

    // Brush variables
    this.toolOpts = {
        spoon:{
            pC:1,
            bS:"round",
            sO:5,
            sOb:17,
            hO:-4,
            mS:20,
            sS:26,
            sSb:3,
            hS:24,
            sCb:"rgb(143,86,6)",
            sC:"rgb(172,119,39)",
            hC:"rgb(227,192,135)",
            mC:"rgb(207,162,87)",
            sSh:10,
            sShb:4,
            hSh:15,
            mSh:15
        },
        fork:{
            pC:4,
            bS:"round",
            sO:2,
            sOb:4,
            hO:-2,
            mS:2,
            sS:3,
            sSb:3,
            hS:5,
            sCb:"rgb(143,86,6)",
            sC:"rgb(172,119,39)",
            hC:"rgb(227,192,135)",
            mC:"rgb(172,119,39)",
            sSh:10,
            sShb:4,
            hSh:15,
            mSh:15
        },
        knife:{
            pC:1,
            bS:"round",
            sO:2,
            sOb:4,
            hO:-2,
            mS:2,
            sS:3,
            sSb:3,
            hS:5,
            sCb:"rgb(143,86,6)",
            sC:"rgb(172,119,39)",
            hC:"rgb(227,192,135)",
            mC:"rgb(172,119,39)",
            sSh:10,
            sShb:4,
            hSh:15,
            mSh:15
        },
        smooth:{
            pC:1,
            bS:"round",
            sO:0,
            sOb:0,
            hO:0,
            mS:30,
            sS:30,
            sSb:30,
            hS:30,
            sCb:"rgb(143,86,6)",
            sC:"rgb(172,119,39)",
            hC:"rgb(227,192,135)",
            mC:"rgb(207,162,87)",
            sSh:10,
            sShb:4,
            hSh:15,
            mSh:15
        }
    };
    this.selectedtool;
    this.jitter = 1;
    this.exprng = 20;
    this.oldPt;
    this.oldMidPt;

    // Bitmap Image Assets
    this.assets = {
        pbmed:{
            path:'images/pb_texture_2t.gif',
        },
    };
    this.assetLdCt = 0;

    this.postData = {
        artworkName: '',
        artworkImage: '',
        artworkComment: '',
        decoy: 'nothinghere',
    };


    //check to see if we are running in a browser with touch support
    this.stage = new createjs.Stage(this.canvas);
    this.stage.autoClear = false;
    this.stage.enableDOMEvents(true);

    this.wrapper = new createjs.Container();
    this.wrapper.hitArea = new createjs.Shape(new createjs.Graphics().f("#000").dr(0,0,options.width,options.height));
    this.wrapper.cache(0,0,options.width,options.height); // Cache it.

    this.shadowWrapper = new createjs.Container();
    this.shadowWrapper.hitArea = new createjs.Shape(new createjs.Graphics().f("#000").dr(0,0,options.width,options.height));
    this.shadowWrapper.cache(0,0,options.width,options.height); // Cache it.

    this.shadowbWrapper = new createjs.Container();
    this.shadowbWrapper.hitArea = new createjs.Shape(new createjs.Graphics().f("#000").dr(0,0,options.width,options.height));
    this.shadowbWrapper.cache(0,0,options.width,options.height); // Cache it.

    this.hiliteWrapper = new createjs.Container();
    this.hiliteWrapper.hitArea = new createjs.Shape(new createjs.Graphics().f("#000").dr(0,0,options.width,options.height));
    this.hiliteWrapper.cache(0,0,options.width,options.height); // Cache it.

    createjs.Touch.enable(this.stage);
    createjs.Ticker.setFPS(24);
    createjs.Ticker.addEventListener("tick", this.stage);

    this.LoadImages();
};

PbCanvas.prototype.SetTool = function(pName){
	this.selectedtool = pName;
};

PbCanvas.prototype.SetToolSize = function(pName){
    this.toolScale = pName;
    console.log('tool scale set to: '+this.toolScale);
};

PbCanvas.prototype.LoadImages = function(){
    //DebugOut(this.assets);
    for( idx in this.assets){
        this.assetLdCt++;
        //DebugOut('loading asset: '+idx+' ('+this.assetLdCt+')');
        // load the source image:
        var img = new Image();
        img.src = this.assets[idx].path;
        img.onload = this.HandleImageLoad(this, idx);
    }
};

PbCanvas.prototype.HandleImageLoad = function(self,alias) {
    return function(event){

        self.assets[alias].img = event.target;
        self.assetLdCt--;
        if( self.assetLdCt <= 0 ){
            self.SetUpCanvas();
        }
    };
};

PbCanvas.prototype.SetUpCanvas = function(){

    // Add the background
    var background = new createjs.Shape();
    // the mask's position will be relative to the parent of its target:
    background.x = 0;
    background.y = 0;
    // only the drawPolyStar call is needed for the mask to work:
    background.graphics.beginBitmapFill(this.assets['pbmed'].img).drawRect(0,0,this.canvasw,this.canvash).closePath();
    this.stage.addChild(background);

    // Add the background gradient
    var gradient = new createjs.Shape();
    gradient.graphics.beginLinearGradientFill(["rgba(227,192,135,0.5)","rgba(227,192,135,0)","rgba(165,110,17,0.5)"], [0.1, 0.33, 0.75], 0,0,this.canvasw,this.canvash).drawRect(0,0,this.canvasw,this.canvash);
    this.stage.addChild(gradient);

    // Add the wrapper to paint on
    // This is the order they will layer
    this.stage.addChild(this.shadowbWrapper);
    this.stage.addChild(this.hiliteWrapper);
    this.stage.addChild(this.shadowWrapper);
    this.stage.addChild(this.wrapper);


    // Add the mouse events
    this.wrapper.addEventListener("mousedown", this.HandleMouseDown(this));
    this.wrapper.addEventListener("mouseup", this.HandleMouseUp(this));

    // Add a shape container for the paths

    this.shadowCanvas = new createjs.Shape();
    this.shadowWrapper.addChild(this.shadowCanvas);
    this.shadowbCanvas = new createjs.Shape();
    this.shadowbWrapper.addChild(this.shadowbCanvas);
    this.hiliteCanvas = new createjs.Shape();
    this.hiliteWrapper.addChild(this.hiliteCanvas);
    this.drawingCanvas = new createjs.Shape();
    this.wrapper.addChild(this.drawingCanvas);

    this.stage.update();
};

PbCanvas.prototype.HandleMouseDown = function(self) {
    return function(event){
        self.oldPt = new createjs.Point(self.stage.mouseX, self.stage.mouseY);
        self.oldMidPt = self.oldPt;
        event.addEventListener("mousemove" , self.HandleMouseMove(self));
    };
};

PbCanvas.prototype.HandleMouseUp = function(self) {
    return function(event){
        self.stage.removeEventListener("stagemousemove" , self.HandleMouseMove);
    };
};

PbCanvas.prototype.GetJitterVal = function() {
	return Math.floor(Math.random()*(this.jitter*2))-this.jitter;
};

PbCanvas.prototype.GetBrushDivisor = function( point1, point2 ){
  var result = 0;

  result = this.GetDistance( point1, point2 )/this.exprng;
  result *= 1.2;
  if( result > 1 ) result = 1;

  return result;
};

PbCanvas.prototype.GetDistance = function( point1, point2 ){
  var xs = 0;
  var ys = 0;

  xs = point2.x - point1.x;
  xs = xs * xs;

  ys = point2.y - point1.y;
  ys = ys * ys;

  return Math.sqrt( xs + ys );
};

PbCanvas.prototype.GetShiftedColor = function( pColor, pSColor, point1, point2 ){
  //return pColor;
  var result = 0;

  bD = this.GetDistance( point1, point2 )/this.exprng;
  bD *= 1.5;
  if( bD > 1 ) bD = 1;

  ma = pColor.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  mb = pSColor.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  var r = ma[1] - Math.floor((ma[1]-mb[1])-((ma[1]-mb[1])*bD));
  var g = ma[2] - Math.floor((ma[2]-mb[2])-((ma[2]-mb[2])*bD));
  var b = ma[3] - Math.floor((ma[3]-mb[3])-((ma[3]-mb[3])*bD));

  //console.log("rgba",r,g,b);

  result = 'rgb('+r+','+g+','+b+')';

  return result;
};

PbCanvas.prototype.HandleMouseMove = function(self) {
    return function(event){
        //DebugOut('moving sir: '+self.erasing);

        var midPt = new createjs.Point(self.oldPt.x + self.stage.mouseX>>1, self.oldPt.y+self.stage.mouseY>>1);

        // Scale brush by speed
        var bD = self.GetBrushDivisor(self.oldPt,midPt);

        //Add position jitter
        midPt.x += self.GetJitterVal();
        midPt.y += self.GetJitterVal();

        /////////////////////////////////////////////////////////////////////////////
        // Erase any underlying shape info
        /////////////////////////////////////////////////////////////////////////////

        for( idx=0; idx<self.toolOpts[self.selectedtool].pC; idx++ ){
             // // Draw the shadow line
             // self.shadowCanvas.graphics.setStrokeStyle((self.toolOpts[self.selectedtool].sS+(self.toolOpts[self.selectedtool].sSh*0.4))*bD, self.toolOpts[self.selectedtool].bS, 'round')
                 // .beginStroke('#000000')
                 // .moveTo(midPt.x+(20*idx), midPt.y-self.toolOpts[self.selectedtool].sO)
                 // .curveTo(self.oldPt.x+(20*idx), self.oldPt.y-self.toolOpts[self.selectedtool].sO, self.oldMidPt.x+(20*idx), self.oldMidPt.y-self.toolOpts[self.selectedtool].sO);
//
             // //Draw the darker shadow line
             // self.shadowbCanvas.graphics.setStrokeStyle((self.toolOpts[self.selectedtool].sSb+(self.toolOpts[self.selectedtool].sShb*0.5))*bD, self.toolOpts[self.selectedtool].bS, 'round')
                 // .beginStroke('#000000')
                 // .moveTo(midPt.x+(20*idx), midPt.y-(self.toolOpts[self.selectedtool].sOb*bD))
                 // .curveTo(self.oldPt.x+(20*idx), self.oldPt.y-(self.toolOpts[self.selectedtool].sOb*bD), self.oldMidPt.x+(20*idx), self.oldMidPt.y-(self.toolOpts[self.selectedtool].sOb*bD));
//
             // // Draw the hilite line
             // self.hiliteCanvas.graphics.setStrokeStyle((self.toolOpts[self.selectedtool].hS+(self.toolOpts[self.selectedtool].hSh*0.1))*bD, self.toolOpts[self.selectedtool].bS, 'round')
                 // .beginStroke('#000000')
                 // .moveTo(midPt.x+(20*idx), midPt.y-self.toolOpts[self.selectedtool].hO)
                 // .curveTo(self.oldPt.x+(20*idx), self.oldPt.y-self.toolOpts[self.selectedtool].hO, self.oldMidPt.x+(20*idx), self.oldMidPt.y-self.toolOpts[self.selectedtool].hO);
//
//

            var sizemult = 0.8;

            self.shadowCanvas.graphics.setStrokeStyle((self.toolOpts[self.selectedtool].mS*sizemult)*bD, self.toolOpts[self.selectedtool].bS, 'round')
                .beginStroke('#000000')
                .moveTo(midPt.x+(20*idx), midPt.y)
                .curveTo(self.oldPt.x+(20*idx), self.oldPt.y, self.oldMidPt.x+(20*idx), self.oldMidPt.y);

            self.shadowbCanvas.graphics.setStrokeStyle((self.toolOpts[self.selectedtool].mS*sizemult)*bD, self.toolOpts[self.selectedtool].bS, 'round')
                .beginStroke('#000000')
                .moveTo(midPt.x+(20*idx), midPt.y)
                .curveTo(self.oldPt.x+(20*idx), self.oldPt.y, self.oldMidPt.x+(20*idx), self.oldMidPt.y);

            self.hiliteCanvas.graphics.setStrokeStyle((self.toolOpts[self.selectedtool].mS*sizemult)*bD, self.toolOpts[self.selectedtool].bS, 'round')
                .beginStroke('#000000')
                .moveTo(midPt.x+(20*idx), midPt.y)
                .curveTo(self.oldPt.x+(20*idx), self.oldPt.y, self.oldMidPt.x+(20*idx), self.oldMidPt.y);

            //Draw the main line
            self.drawingCanvas.graphics.setStrokeStyle((self.toolOpts[self.selectedtool].mS*sizemult)*bD, self.toolOpts[self.selectedtool].bS, 'round')
                .beginStroke('#000000')
                .moveTo(midPt.x+(20*idx), midPt.y)
                .curveTo(self.oldPt.x+(20*idx), self.oldPt.y, self.oldMidPt.x+(20*idx), self.oldMidPt.y);



        }

        self.wrapper.updateCache("destination-out");
        self.shadowWrapper.updateCache("destination-out");
        self.shadowbWrapper.updateCache("destination-out");
        self.hiliteWrapper.updateCache("destination-out");
        // self.wrapper.updateCache("source-over");
        // self.shadowWrapper.updateCache("source-over");
        // self.shadowbWrapper.updateCache("source-over");
        // self.hiliteWrapper.updateCache("source-over");
        self.drawingCanvas.graphics.clear();
        self.shadowCanvas.graphics.clear();
        self.shadowbCanvas.graphics.clear();
        self.hiliteCanvas.graphics.clear();

        /////////////////////////////////////////////////////////////////////////////

        for( idx=0; idx<self.toolOpts[self.selectedtool].pC; idx++ ){
             // Draw the shadow line
             self.shadowCanvas.graphics.setStrokeStyle(((self.toolOpts[self.selectedtool].sS)*bD)*self.toolScale, self.toolOpts[self.selectedtool].bS, 'round')
                 .beginStroke(self.GetShiftedColor(self.toolOpts[self.selectedtool].sC, self.toolOpts[self.selectedtool].sCb, self.oldPt,midPt))
                 .moveTo(midPt.x+((20*self.toolScale)*idx), midPt.y-(self.toolOpts[self.selectedtool].sO*self.toolScale))
                 .curveTo(self.oldPt.x+((20*self.toolScale)*idx), self.oldPt.y-self.toolOpts[self.selectedtool].sO, self.oldMidPt.x+((20*self.toolScale)*idx), self.oldMidPt.y-(self.toolOpts[self.selectedtool].sO*self.toolScale));
             self.shadowCanvas.shadow = new createjs.Shadow(self.GetShiftedColor(self.toolOpts[self.selectedtool].sC, self.toolOpts[self.selectedtool].sCb, self.oldPt,midPt),0,0,self.toolOpts[self.selectedtool].sSh);

             //Draw the darker shadow line
             self.shadowbCanvas.graphics.setStrokeStyle(((self.toolOpts[self.selectedtool].sSb)*bD)*self.toolScale, self.toolOpts[self.selectedtool].bS, 'round')
                 .beginStroke(self.toolOpts[self.selectedtool].sCb)
                 .moveTo(midPt.x+((20*self.toolScale)*idx), midPt.y-((self.toolOpts[self.selectedtool].sOb*bD)*self.toolScale))
                 .curveTo(self.oldPt.x+((20*self.toolScale)*idx), self.oldPt.y-((self.toolOpts[self.selectedtool].sOb*bD)*self.toolScale), self.oldMidPt.x+((20*self.toolScale)*idx), self.oldMidPt.y-((self.toolOpts[self.selectedtool].sOb*bD)*self.toolScale));
             self.shadowbCanvas.shadow = new createjs.Shadow(self.toolOpts[self.selectedtool].sCb,0,0,self.toolOpts[self.selectedtool].sShb);


             // Draw the hilite line
             self.hiliteCanvas.graphics.setStrokeStyle(((self.toolOpts[self.selectedtool].hS)*bD)*self.toolScale, self.toolOpts[self.selectedtool].bS, 'round')
                 .beginStroke(self.GetShiftedColor(self.toolOpts[self.selectedtool].hC, self.toolOpts[self.selectedtool].mC, self.oldPt,midPt))
                 .moveTo(midPt.x+((20*self.toolScale)*idx), midPt.y-(self.toolOpts[self.selectedtool].hO*self.toolScale))
                 .curveTo(self.oldPt.x+((20*self.toolScale)*idx), self.oldPt.y-(self.toolOpts[self.selectedtool].hO*self.toolScale), self.oldMidPt.x+((20*self.toolScale)*idx), self.oldMidPt.y-(self.toolOpts[self.selectedtool].hO*self.toolScale));
             self.hiliteCanvas.shadow = new createjs.Shadow(self.GetShiftedColor(self.toolOpts[self.selectedtool].hC, self.toolOpts[self.selectedtool].mC, self.oldPt,midPt),0,0,self.toolOpts[self.selectedtool].hSh);

            //Draw the main line
            self.drawingCanvas.graphics.setStrokeStyle(((self.toolOpts[self.selectedtool].mS)*bD)*self.toolScale, self.toolOpts[self.selectedtool].bS, 'round')
                .beginStroke(self.GetShiftedColor(self.toolOpts[self.selectedtool].mC, self.toolOpts[self.selectedtool].sCb, self.oldPt,midPt))
                .moveTo(midPt.x+((20*self.toolScale)*idx), midPt.y)
                .curveTo(self.oldPt.x+((20*self.toolScale)*idx), self.oldPt.y, self.oldMidPt.x+((20*self.toolScale)*idx), self.oldMidPt.y);
            self.drawingCanvas.shadow = new createjs.Shadow(self.GetShiftedColor(self.toolOpts[self.selectedtool].mC, self.toolOpts[self.selectedtool].sCb, self.oldPt,midPt),1,-5,self.toolOpts[self.selectedtool].mSh);


        }

        //console.log('hSh',self.toolOpts[self.selectedtool].hSh);

        self.oldPt.x = self.stage.mouseX;
        self.oldPt.y = self.stage.mouseY;

        self.oldMidPt.x = midPt.x;
        self.oldMidPt.y = midPt.y;

        // Draw onto the canvas, and then update the container cache.
        self.wrapper.updateCache((self.selectedtool=="smooth")?"destination-out":"source-over");
        self.shadowWrapper.updateCache((self.selectedtool=="smooth")?"destination-out":"source-over");
        self.shadowbWrapper.updateCache((self.selectedtool=="smooth")?"destination-out":"source-over");
        self.hiliteWrapper.updateCache((self.selectedtool=="smooth")?"destination-out":"source-over");
        self.drawingCanvas.graphics.clear();
        self.shadowCanvas.graphics.clear();
        self.shadowbCanvas.graphics.clear();
        self.hiliteCanvas.graphics.clear();

        self.stage.update();
    };
};

PbCanvas.prototype.GetPng = function(){

    var result = null;

    // Get png preview of the cloud
    var screenshot = Canvas2Image.saveAsPNG(this.canvas, true);

    document.body.appendChild(screenshot);
    screenshot.id = "canvasimage";
    result = document.getElementById('canvasimage').src;
    document.body.removeChild(screenshot);

    return result;
};

PbCanvas.prototype.SaveCanvas = function(self){
    return function(){
        DebugOut(self.canvas);
        // Get png preview of the cloud
        var screenshot = Canvas2Image.saveAsPNG(self.canvas, true);

        self.canvas.parentNode.appendChild(screenshot);
        screenshot.id = "canvasimage";
        self.postData.artworkImage = document.getElementById('canvasimage').src;
        self.canvas.parentNode.removeChild(screenshot);

        self.postData.artworkName = "My PB Art";

        //$.post(API_PATH+'tinderbox/artwork/add/json',self.postData,self.HandleSaveResponse);
    };
};

PbCanvas.prototype.HandleSaveResponse = function(response){
    //DebugOut(JSON.stringify(response));
    //DebugOut(response);

    DebugOut(response.id);

    //if( response.id != undefined ){
    //    $.get(API_PATH+'reactor/cloud/get/'+response.id,self.SendToCloud(self));
    //}else{
    //    self.panel.elem.find('#btnsave').show();
    //    self.panel.elem.find('#lblsaving').hide();
    //}

    alert("saved! id: "+response.id);

    return false;
};
