angular.module('trace.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('TraceCtrl', function($scope, $stateParams, $window, $ionicPopover, $cordovaBrightness) {

	$ionicPopover.fromTemplateUrl('image-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.imagePopover = popover;
	});

	$ionicPopover.fromTemplateUrl('grid-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.gridPopover = popover;
	});

	$ionicPopover.fromTemplateUrl('global-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.globalPopover = popover;
	});

	$scope.openImagePopover = function($event) {
		$scope.imagePopover.show($event);
	};

	$scope.openGridPopover = function($event) {
		$scope.gridPopover.show($event);
	};

	$scope.openGlobalPopover = function($event) {
		$scope.globalPopover.show($event);
	};
	
	// Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.gridPopover.remove();
		$scope.imagePopover.remove();
		$scope.globalPopover.remove();
	});
		
	$scope.global = {}
	
    function win(status) {
        console.log('Message: ' + status);
    }
    function fail(status) {
        console.log('Error: ' + status);
    }

	// brightness plugin not working
	/*
	if ($window.cordova) $scope.global.brightness = $cordovaBrightness.get()
	
    $scope.$watch('global.brightness', function() {
		if ($window.cordova) $cordovaBrightness.set($scope.global.brightness);
    });
    */


	$scope.grid = {}
	
	$scope.grid.showGrid = true;
	$scope.grid.size = 32;

	$scope.grid.opacity = 50;
	$scope.grid.hue = 25;
	$scope.grid.saturation = 10;
	$scope.grid.lightness = 50;
		
	$scope.grid.gridStyle={
		'opacity': $scope.grid.opacity,
		'background-size': $scope.grid.size+'px ' + $scope.grid.size+'px',
		'background-image': 'repeating-linear-gradient(0deg, ' + hsl() + ', ' + hsl() + ' 1px, transparent 1px, transparent ' + $scope.grid.size + 'px),repeating-linear-gradient(-90deg, ' + hsl() + ', ' + hsl() +' 1px, transparent 1px, transparent ' + $scope.grid.size + 'px)'
	};
	
    $scope.$watch('grid.size', function() {        
		$scope.grid.gridStyle['background-size'] = $scope.grid.size+'px ' + $scope.grid.size+'px',
		$scope.grid.gridStyle['background-image'] = 'repeating-linear-gradient(0deg, ' + hsl() + ', ' + hsl() + ' 1px, transparent 1px, transparent ' + $scope.grid.size + 'px),repeating-linear-gradient(-90deg, ' + hsl() + ', ' + hsl() +' 1px, transparent 1px, transparent ' + $scope.grid.size + 'px)'
    });
    
    $scope.$watch('grid.opacity', function() {        
		$scope.grid.gridStyle["opacity"] = $scope.grid.opacity/100;
    });

    function hsl() {
		return 'hsl(' + ( $scope.grid.hue * 360 / 100 ) + ', ' + $scope.grid.saturation + '%,' + $scope.grid.lightness + '%)';
	}
	
    function updateColor() {
		$scope.grid.gridStyle["background-image"] = 'repeating-linear-gradient(0deg, ' + hsl() + ', ' + hsl() + ' 1px, transparent 1px, transparent ' + $scope.grid.size + 'px),repeating-linear-gradient(-90deg, ' + hsl() + ', ' + hsl() +' 1px, transparent 1px, transparent ' + $scope.grid.size + 'px)'
	}

    $scope.$watch('grid.hue', updateColor);    
    $scope.$watch('grid.saturation', updateColor);    
    $scope.$watch('grid.lightness', updateColor);    
	updateColor();

	$scope.image = {}
	$scope.image.grayscale = false;

    $scope.$watch('image.brightness', function() {       
    	if ($scope.imageKinetic) $scope.imageKinetic.brightness($scope.image.brightness);
		$scope.stage.draw();	
    });

    $scope.$watch('image.grayscale', function() {
    	if ($scope.imageKinetic) {
	    	if ($scope.image.grayscale == true) {
				$scope.imageKinetic.filters([Kinetic.Filters.Brighten, Kinetic.Filters.Grayscale]);
			} else {
				$scope.imageKinetic.filters([Kinetic.Filters.Brighten]);
			}
		} 
		$scope.stage.draw();	
    });
	
	$scope.image_size = 512;
	$scope.device_width = $window.innerWidth;
	$scope.device_scale = $scope.device_width / $scope.image_size;
	$scope.imageObj = new Image();

    $scope.init = function() {

        // init canvas stage
        $scope.stage = new Kinetic.Stage({
            container : 'kcontainer',
            width : $scope.device_width,
            height : $scope.device_width,
        });

        $scope.stage.scale({ x: $scope.device_scale, y: $scope.device_scale });

    };
    
    $scope.addPhoto = function() {

		$scope.imagePopover.hide();

		if (window.imagePicker) {
			window.imagePicker.getPictures(
			    function(results) {
					// load chosen photo
					$scope.imageObj.src = results[0];
			    }, function (error) {
			        console.log('Error: ' + error);
			    }, {
					maximumImagesCount: 1,
					width: $scope.image_size,
					quality: 70
				}
			);
		} else {
			console.log("no plugin found, loading default image");
			// $scope.imageObj.src = "img/ionic.png";
			$scope.imageObj.src = "http://www.leighcox.com/images/design/harmony_full.png";
		}

	    // when we get the photo data from camera
	    $scope.imageObj.onload = function() {
	    
	        // create new image object for photo
	        $scope.imageKinetic = new Kinetic.Image({
	            id: 'photo',
	            image : $scope.imageObj,
			});
	
	        // if there's an old template layer
            if ($scope.layer) {
                // kill old template layer
                $scope.layer.destroy();
            } else {
		        // create new photo layer
		        $scope.layer = new Kinetic.Layer({
		            width: $scope.imageKinetic.getWidth(),
		            height: $scope.imageKinetic.getHeight()
		        });
            }
            	
	        // create pinch/zoom layer
	        $scope.group = new Kinetic.PinchLayer({
	            stage: $scope.stage,
	            container: $scope.layer,
	            id: 'group',
	            draggable: true,
	            width: $scope.imageKinetic.getWidth(),
	            height: $scope.imageKinetic.getHeight(),
	            x: 0,
	            y: 0,
	        });
	
	        // enable pinch-zoom
	        if ($scope.group) $scope.group.dStage.addEventListener("touchmove", $scope.group.layerTouchMove, true);
	        if ($scope.group) $scope.group.dStage.addEventListener("touchend", $scope.group.layerTouchEnd, true);

	        $scope.group.add($scope.imageKinetic);
	        $scope.stage.add($scope.layer);
			$scope.imageKinetic.cache();
			$scope.imageKinetic.filters([Kinetic.Filters.Brighten]);
			$scope.imageKinetic.brightness(0);
			$scope.stage.draw();	

	    };
    };

	$scope.init();

});

