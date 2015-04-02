Kinetic.PinchLayer = function(config) {
	self = this;
	Kinetic.Group.call(self, config);
	config.container.add(self);	
	// self.setDragBoundFunc(self.checkBounds);
	
	/*
	// set minScale so that the layer will always cover the whole screen if possible
	if (self.getWidth() / self.getParent().getWidth() < self.getHeight() / self.getParent().getHeight()) {
   	 self.minScale = self.getParent().getWidth() / self.getWidth();
    } else {
   	 self.minScale = self.getParent().getHeight() / self.getHeight();
    }
	*/
	
    self.minScale = config.minScale || 1;
    self.maxScale = config.maxScale || 4;
    self.maxSpeed = config.maxSpeed || 10;
    self.durationCoeff = config.durationCoeff || 0.05;
    
    self.dStage = config.stage.content;
    self.stage = config.stage;
	
	// self.dStage.addEventListener("touchmove", self.layerTouchMove, true);
	// self.dStage.addEventListener("touchend", self.layerTouchEnd, true);	

	self.setDraggable(true);    
	self.startDistance = undefined;
	self.startScale = 1;
	self.lastPosition = { x: 0, y: 0 }
	self.touchPosition = { x: 0, y: 0 }
	self.layerPosition = { x: 0, y: 0 }
	self.panDelta = { x: 0, y: 0 }
}

Kinetic.PinchLayer.prototype = new Kinetic.Group();

Kinetic.PinchLayer.prototype.checkBounds = function(pos) {
		var boundX, boundY, posX, posY;
		var picDimensionX = (-self.getWidth() * self.getScale().x) + self.getParent().getWidth();
		var picDimensionY = (-self.getHeight() * self.getScale().y) + self.getParent().getHeight();
		if (pos.x > 0) {
			boundX = 0;
		// } else if (pos.x < picDimensionX) {
			// boundX = picDimensionX;
		} else {
			boundX = pos.x;
		}
		if (pos.y > 0) {
			boundY = 0;
		// } else if (pos.y < picDimensionY) {
			// boundY = picDimensionY;
		} else {
			boundY = pos.y;
		}
		return { x: boundX, y: boundY }
}

Kinetic.PinchLayer.prototype.getDistance = function(touch1, touch2) {
	var x1 = touch1.clientX;
    var x2 = touch2.clientX;
    var y1 = touch1.clientY;
    var y2 = touch2.clientY;
    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
  }

Kinetic.PinchLayer.prototype.layerTouchMove = function(event) {
	
	var touch1 = event.touches[0];
	var touch2 = event.touches[1];
 	
 	if (touch1 && touch2) {
    	self.setDraggable(false);
    	if (self.trans != undefined) { self.trans.stop(); }
        if (self.startDistance === undefined) {
            self.startDistance = self.getDistance(touch1, touch2);
            self.touchPosition.x = (touch1.clientX + touch2.clientX) / 2;
            self.touchPosition.y = (touch1.clientY + touch2.clientY) / 2;
            self.layerPosition.x = (Math.abs(self.getX()) + self.touchPosition.x) / self.startScale;
            self.layerPosition.y = (Math.abs(self.getY()) + self.touchPosition.y) / self.startScale;
        } else {
			var dist = self.getDistance(touch1, touch2);
			var scale = (dist / self.startDistance) * self.startScale;
			if (scale < self.minScale) { scale = self.minScale; }
			if (scale > self.maxScale) { scale  = self.maxScale; }
			self.scale({ x: scale, y: scale });
			
			// adjust position after scale			
			var x = (self.layerPosition.x * scale) - self.touchPosition.x;
			var y = (self.layerPosition.y * scale) - self.touchPosition.y;
			var pos = self.checkBounds({ x: -x, y: -y });
			// var pos = { x: -x, y: -y };
			self.x(pos.x);
			self.y(pos.y);
			self.getParent().draw();
    	}
	}
}
		
Kinetic.PinchLayer.prototype.layerTouchEnd = function(event) {
   	self.setDraggable(true);
    self.startDistance = undefined;
    self.dragDistance = undefined;
    self.startScale = self.getScale().x;
}


