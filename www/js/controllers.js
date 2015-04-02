angular.module('trace.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('TraceCtrl', function($scope, $stateParams, $window, $ionicPopover) {

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

	$scope.openImagePopover = function($event) {
		$scope.imagePopover.show($event);
	};

	$scope.openGridPopover = function($event) {
		$scope.gridPopover.show($event);
	};
	
	// Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.gridPopover.remove();
		$scope.imagePopover.remove();
	});
		
	$scope.grid = {}
	$scope.grid.showGrid = false;
	var svg = d3.select("#grid")
	var amount = 5000;

	d3.range(amount).forEach(function(j) {
		var square = svg
		.append("div")
		.attr("class", "square")
	})
		
	$scope.device_width = $window.innerWidth;
	$scope.device_scale = $scope.device_width/2560;
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
					width: 2560,
					quality: 100
				}
			);
		} else {
			console.log("no plugin found, loading default image");
			$scope.imageObj.src = "img/ionic.png";
		}

	    // when we get the photo data from camera
	    $scope.imageObj.onload = function() {
	    
	        // create new image object for photo
	        var image = new Kinetic.Image({
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
		            width: image.getWidth(),
		            height: image.getHeight()
		        });
            }
            	
	        // create pinch/zoom layer
	        $scope.group = new Kinetic.PinchLayer({
	            stage: $scope.stage,
	            container: $scope.layer,
	            id: 'group',
	            draggable: true,
	            width: image.getWidth(),
	            height: image.getHeight(),
	            x: 0,
	            y: 0,
	        });
	
	        // enable pinch-zoom
	        if ($scope.group) $scope.group.dStage.addEventListener("touchmove", $scope.group.layerTouchMove, true);
	        if ($scope.group) $scope.group.dStage.addEventListener("touchend", $scope.group.layerTouchEnd, true);

	        $scope.group.add(image);
	        $scope.stage.add($scope.layer);
	        $scope.stage.draw();	
	    };
    };

	$scope.init();

});
