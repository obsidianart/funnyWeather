require([
        "jquery",
		"forecast"
	], function (
        $,
		Forecast
	) {	
		//location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(pos){
            $('.location-instruction').hide();
            $('#not-working').hide();

            //success
            $.ajax({
                url:"http://maps.googleapis.com/maps/api/geocode/json?latlng="+ pos.coords.latitude +","+ pos.coords.longitude +"&sensor=true",
                success:function(data){
                    var address = data.results;
                    var city = 'Somewhere';
                    if (address && address.length>0) {
                        //search for tube first
                        address = address[0].address_components; //assuming the best guess is good for the neighbour
                        for (var i=0; i<address.length;i++) {
                            if (address[i].types.indexOf('neighborhood') !== -1 ||
                                address[i].types.indexOf('locality') !== -1 ||
                                address[i].types.indexOf('administrative_area_level_2') !== -1 ||
                                address[i].types.indexOf('postal_town') !== -1 ) {
                                	city = address[i].long_name;
                                	break;
                            }
                        }
                    }

                    var lat = pos.coords.latitude.toFixed(4);
                    var lon = pos.coords.longitude.toFixed(4);
                    var latLon = lat + ',' +lon;

                    require(['https://api.darksky.net/forecast/f3a549e99fe815ba1da83dbe4d5146cb/'+latLon+'?units=uk&exclude=minutely,hourly&callback=define'], 
                   		function(wheather){
                   			//removing the loader
							$('#loader').fadeOut('normal',function(){
								this.remove();
							})

                    		Forecast({
		                		location:city,
		                		forecastData : wheather
		                	});
                    	}
                	)
                }
              
            })
          }, function(){
          	$('#message').html('Google is not helping me out in locating you, sorry.');
          });
        } else {
        	$('#message').html('<div class="error"><p class="main-error-message">Sorry, I can\'t understand where you are, I will tell you a joke instead...</p><p class="error-joke">Why did the weather want privacy?<br><i>It was changing<i></p>') 

        }

	}
);