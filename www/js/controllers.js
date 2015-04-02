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


	$scope.addGrid = function() {

		$scope.gridPopover.hide();
		var svg = d3.select("#grid")
		var amount = 5000;
	
		d3.range(amount).forEach(function(j) {
			var square = svg
			.append("div")
			.attr("class", "square")
		})
	
	}
		
	$scope.device_width = $window.innerWidth;
	$scope.device_scale = $scope.device_width/640;

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
					// save chosen photos
			    	$scope.uploaded_image = results[0];
			    	$scope.imageData = $scope.uploaded_image;
			    }, function (error) {
			        console.log('Error: ' + error);
			    }, {
					maximumImagesCount: 1,
					width: 640,
					quality: 60
				}
			);
		} else {
			console.log("no plugin found");
			$scope.imageData = "img/ionic.png";
		}

	    $scope.imageObj = new Image();
	    $scope.imageObj.src = $scope.imageData;
	
	    // when we get the photo data from camera
	    $scope.imageObj.onload = function() {
	    
	        // create new image object for photo
	        var image = new Kinetic.Image({
	            id: 'photo',
	            image : $scope.imageObj,
			});
	
	        // create new photo layer
	        var layer = new Kinetic.Layer({
	            width: image.getWidth(),
	            height: image.getHeight()
	        });
	
	        // create pinch/zoom layer
	        $scope.group = new Kinetic.PinchLayer({
	            stage: $scope.stage,
	            container: layer,
	            id: 'group',
	            draggable: true,
	            width: image.getWidth(),
	            height: image.getHeight()
	        });
	
	        // enable pinch-zoom
	        if ($scope.group) $scope.group.dStage.addEventListener("touchmove", $scope.group.layerTouchMove, true);
	        if ($scope.group) $scope.group.dStage.addEventListener("touchend", $scope.group.layerTouchEnd, true);

	        // add image to group, group to canvas
	        $scope.group.add(image);
	        $scope.stage.add(layer);
	        $scope.stage.draw();	
	    };
    };

	$scope.init();

});
