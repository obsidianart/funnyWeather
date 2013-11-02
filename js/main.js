requirejs.config({
	baseUrl: '',
	paths: {
	    text: 'js/vendor/text',
	    jquery: 'js/vendor/jquery-1.10.1',
	    iscroll: 'js/vendor/iscroll/iscroll',
	    underscore: 'js/vendor/underscore-min',
	    //weatherApi: 'mocks/forecast',
	    weatherApi: 'https://api.forecast.io/forecast/f3a549e99fe815ba1da83dbe4d5146cb/51.5173,-0.1063?units=uk&exclude=minutely,hourly&callback=define',
		bootstrap: 'js/vendor/bootstrap'
	},
	shim: {
		'underscore': {
			exports: '_'
		},
		'iscroll': {
			exports : 'iscroll'
		},
	}
});

require([
	"jquery",
	"underscore",
	"iscroll",
	"weatherApi",
	"js/vendor/skycons",
	"js/quotes",
	"js/carousel",
	"text!templates/main.html"
	], function (
		$,
		_,
		_iscroll,
		weather,
		_Skycons,
		weatherQuotes,
		carousel,
		mainTemplate
	) {
		if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(function(pos){
		  	//success
		  	$.ajax({
		  		url:"http://maps.googleapis.com/maps/api/geocode/json?latlng="+ pos.coords.latitude +","+ pos.coords.longitude +"&sensor=true",
		  		success:function(data){
		  			var address = data.results;
		  			if (address) {
		  				//search for tube first

		  				address = address[0].address_components; //assuming the best guess is good for the neighbour
		  				for (var i=0; i<address.length;i++) {
		  					if (address[i].types.indexOf('neighborhood') !== -1 ||
		  						address[i].types.indexOf('locality') !== -1 ||
		  						address[i].types.indexOf('administrative_area_level_2') !== -1 ||
								address[i].types.indexOf('postal_town') !== -1 ) {
		  						console.log(address[i].long_name);
		  						break;
		  					}
		  				}
		  			}
		  		}
		  	})
		  }, function(){
		  	//error
		  });
		} else {
		  console.log('not supported');
		}

		//removing the loader
		$('#loader').fadeOut('normal',function(){
			this.remove();
		})

		var navLinkTemplate = _.template('<li class="<%= current?"current":"" %>"><a href="#day-<%= id %>" data-page="<%= id %>"><%= name %></a></li>'),
			mainTemplate = _.template(mainTemplate),
			$foreCast = $('#forecast'),
			location = "London",
			navDays = '';
			weekday= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
			skycons = new Skycons({"color": "#2da7df"});

		

		//adding today weather
		$foreCast.html(mainTemplate ({
			id: 1,
			location: location,
			summary : weather.currently.summary,
			temperature : Math.round(weather.currently.temperature) + "&#176;",
			description : weatherQuotes.partlyCloudy[0],
			icon:getSkyconStatus(weather.currently.icon),
			active: true
		}));
		
		navDays += navLinkTemplate({id:1, name:'Today', current:true});

		//adding forecast
		$.each(weather.daily.data, function(i,el){
			var date, day;

			if (i==0) return; //first one is today
			$foreCast.append(mainTemplate ({
				id:i+1,
				location: location,
				summary : el.summary,
				temperature : Math.round(el.temperatureMin) + "&#176; to " + Math.round(el.temperatureMax) + "&#176;",
				description : weatherQuotes.partlyCloudy[0],
				icon:getSkyconStatus(el.icon),
				active: false
			}));

			date = new Date(el.time*1000);
			day = i==1 ? "Tomorrow" : weekday[date.getDay()];
			navDays += navLinkTemplate({id:i+1, name:day, current:false});
		});

		//adding animated icons
		var iconContainer = $foreCast.find('.condition-animation').each(function(i,el){
			skycons.add(el, Skycons[$(el).data('icon')]);
		});
		
		skycons.play();

		//adding the nav
		$('nav ul').html(navDays);

		
		//iScroll
		$('#forecast').width(294*$('.day').length);
		window.myScroll = new iScroll('forecast-wrapper', {
			hScrollbar: false,
			vScrollbar: false,
			vScroll:false,
			snap: '.day',
			onScrollMove: function() { },
			onScrollEnd: function() { updateTopMenu(); }
			//onAnimationEnd: function() { updateTopMenu(); }
		});

		var $datemenu = $('.date-menu');
		//update top menu when bottom is scrolled
		function updateTopMenu(){
			$('.date-menu li.current').removeClass('current');
			var page = myScroll.currPageX;
			var pos = $datemenu.find('li')
				.eq(page)
				.addClass('current')
				.position()
				.left;

			//TODO:put the right number to be always on the left
			pos-=100; //I want the menu to be on the left
			pos = pos>0? pos : 0;
			$datemenu.css('left',pos * -1)
		}

		//Binding menus to iscroll
		$('nav ul a').click(function(e){
			e.preventDefault();
			myScroll.scrollToPage($(e.target).data('page') - 1, 500);
		})

		//adding Keyboard
		$(document).keydown(function(e){
		    if (e.keyCode === 37 || e.keyCode === 38 ) { //left and up
		       	myScroll.scrollToPage(myScroll.currPageX - 1, 500);
		       	return false;
		    } else if (e.keyCode === 39 || e.keyCode === 40 ) { //right and down
		    	myScroll.scrollToPage(myScroll.currPageX + 1, 500);
		       	return false;
		   }
		});




		function getSkyconStatus(icon) {
			return icon.toUpperCase().replace(/-/gi,'_')
		}

    }
);