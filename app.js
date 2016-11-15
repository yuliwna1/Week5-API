var mainInfo = {
	map: null,
	geocoder: null
};

//request data from geonames API

mainInfo.getData = function(postalCodeIn, latIn, lngIn) {
	$('.preloader').show();
	$.ajax({
		url: 'https://proxy.hackeryou.com',
		method: 'GET',
		type: 'json',
		data: {
			reqUrl: 'http://api.geonames.org/findNearbyWikipediaJSON',
			params: {
				username: 'yuliwna1',
				lat: latIn,
				lng: lngIn,
				type: 'json'
			}
		}
	}).then(function(dataResult) {
		$('.preloader').hide();
		console.log(dataResult);
		console.log(latIn + ", " + lngIn);
		mainInfo.updateMap(postalCodeIn, latIn, lngIn, dataResult.geonames);
		// call some other function
	});
};

//Here I generate my google map

mainInfo.initMap = function() {

	mainInfo.geocoder = new google.maps.Geocoder();
	mainInfo.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 9,
		center: {lat: 43.6532, lng: -79.3832}
	});
};

//Here I'm updating my map
mainInfo.markersArray = [];

mainInfo.updateMap = function(postalCode, latIn, lngIn, geonames) {
	//Clear the old markers 
	for (var i = 0; i < mainInfo.markersArray.length; i++) {
		mainInfo.markersArray[i].setMap(null);
	}
	mainInfo.markersArray.length = 0;

	mainInfo.map.setCenter({lat: latIn, lng: lngIn});
	mainInfo.map.setZoom(16);
	var marker = new google.maps.Marker({
        map: mainInfo.map,
        position: {
        	lat: latIn, 
        	lng: lngIn},
        title: postalCode
    });

    //Pushing markers in the array
    mainInfo.markersArray.push(marker);

	        
	for (var i = 0; i < geonames.length; i++) {

		var markerGeonames = new google.maps.Marker({
	    	map: mainInfo.map,
	        position: {lat: geonames[i].lat, lng: geonames[i].lng},
	        icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
	        title: geonames[i].title,
	        summary: geonames[i].summary,
	        wikipediaUrl: geonames[i].wikipediaUrl
	    });

	    //Pushing markers in the array
	    mainInfo.markersArray.push(markerGeonames);

	    var infoWindow = new google.maps.InfoWindow({

 			maxWidth: 250
	    });



	    google.maps.event.addListener(markerGeonames, 'click', function() {   	
	    	// infoWindow.setContent(this.summary + '<br/><a href="http://' + this.wikipediaUrl + '" target="_blank">Visit here</a>');
	    	infoWindow.setContent('<div id="infobox">' + this.summary + '<br/><a href="http://' + this.wikipediaUrl + '" target="_blank">Visit here</a>' + '</div>');
	    	infoWindow.open(mainInfo.map, this);
	    });
	}

mainInfo.stylePage();

};

//Allow the users search by postal code
mainInfo.init = function() {
	$('form').on('submit', function(e) {
		e.preventDefault();
		//User's postal code goes to the var postalCode
		var postalCode = $('input[type=search]').val();
		console.log(postalCode);

		mainInfo.geocoder.geocode({address: postalCode}, function(results, status) {
			if (status == 'OK') {
				//Passing var postalCode into mainInfo.getData
				var lat = results[0].geometry.location.lat();
				var lng = results[0].geometry.location.lng();
				mainInfo.getData(postalCode, lat, lng);	
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});

		
	});

	$('#submitSecond').on('click', function(e) {
		e.preventDefault();
		$('.preloader').show();

		if (navigator.geolocation) {

		        navigator.geolocation.getCurrentPosition(function(position) {
		        	mainInfo.getData('Your Location', position.coords.latitude, position.coords.longitude);

		        }, function() {
		        	$('.preloader').hide();
		        	alert('Sorry, we could not detect your location!');
		        });
		    } else {
		    	$('.preloader').hide();
		        alert('Geolocation is not supported by this browser.');
		    }
	
	})

	mainInfo.initMap();
};

//This is where I fade In my Map.
mainInfo.stylePage = function() {
	$('#map').css({
		'opacity': 1,
		'visibility': 'visible',
	});

	$('.wrapper').css({
		'margin': '0'
	});

//Adding closing icon on the map
	$('#map').append('<i>');
	$('#map i').addClass('fa fa-times');

//Closing map when the user clicks anywhere on the screen.

	$('section').on('click', function(event) {

		//I'm saying when the users clicks on map don't close the map attr('id') === '#map'

		if ($(event.target).hasClass('map')) {
			
		}
		else if ($(event.target).hasClass('fa-times')) {
			console.log('TEST');
			$('#map').css({	
				'visibility': 'hidden'
			});
		}
		else if($(event.target).hasClass('get_info')){
			$('#map').css({	
				'visibility': 'hidden'
			});
		}

	})

	//This is where I clear the search bar from the old postal code 

	$('input[type=search]').val('');
}



//calling back my mainInfo.getData function

$(function() {
	mainInfo.init();
});


