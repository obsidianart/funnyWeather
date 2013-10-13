requirejs.config({
	baseUrl: '',
	paths: {
	    text: 'js/vendor/text',
	    jquery: 'js/vendor/jquery-1.10.1',
	    hammer: 'js/vendor/jquery.hammer',
	    underscore: 'js/vendor/underscore-min',
	    weatherApi: 'https://api.forecast.io/forecast/f3a549e99fe815ba1da83dbe4d5146cb/51.5072,0.1275?units=uk&exclude=minutely,hourly&callback=define',
		bootstrap: 'js/vendor/bootstrap'
	},
	shim: {
		'underscore': {
			exports: '_'
		},
		'hammer': {
			exports : 'hammer'
		},
		'bootstrap' : {
			exports : 'bootstrap'
		}
	}
});

require([
	"jquery",
	"underscore",
	"bootstrap",
	"weatherApi",
	"hammer",
	"js/vendor/skycons",
	"js/quotes",
	"js/carousel",
	"text!templates/nav.html",
	"text!templates/main.html"
	], function (
		$,
		_,
		_bootstrap,
		weather,
		_hammer,
		_Skycons,
		weatherQuotes,
		carousel,
		navTemplate,
		mainTemplate
	) {
		var navTemplate = _.template(navTemplate);
		var mainTemplate = _.template(mainTemplate);
		var $foreCast = $('#forecast');
		var location = "London"

		var skycons = new Skycons({"color": "#2da7df"});

		//adding the nav
		$('nav').html(navTemplate ({}));

		//adding today weather
		$foreCast.html(mainTemplate ({
			location: location,
			summary : weather.currently.summary,
			temperature : Math.round(weather.currently.temperature) + "&#176;",
			description : weatherQuotes.partlyCloudy[0],
			icon:getSkyconStatus(weather.currently.icon),
			active: true
		}));

		//adding forecast
		$.each(weather.daily.data, function(i,el){
			$foreCast.append(mainTemplate ({
				location: location,
				summary : el.summary,
				temperature : Math.round(el.temperatureMin) + "&#176; to " + Math.round(el.temperatureMax) + "&#176;",
				description : weatherQuotes.partlyCloudy[0],
				icon:getSkyconStatus(el.icon),
				active: false
			}));
		})


		var iconContainer = $foreCast.find('.condition-animation').each(function(i,el){
			skycons.add(el, Skycons[$(el).data('icon')]);
		})

		skycons.play();


		$foreCast.hammer({ drag_lock_to_axis: true })
	        .on("release dragleft dragright swipeleft swiperight", handleHammer);
		
		

		function getSkyconStatus(icon) {
			return icon.toUpperCase().replace(/-/gi,'_')
		}

		function handleHammer(ev) {
	        // disable browser scrolling
	        ev.gesture.preventDefault();

	        switch(ev.type) {
	            case 'dragright':
	            case 'dragleft':
	            
	            /*
	                // stick to the finger
	                var pane_offset = -(100/pane_count)*current_pane;
	                var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

	                // slow down at the first and last pane
	                if((current_pane == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
	                    (current_pane == pane_count-1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
	                    drag_offset *= .4;
	                }

	                setContainerOffset(drag_offset + pane_offset);
	                break;
	                */

	            case 'swipeleft':
	            	console.log("next")
	                $('#forecast').carousel('next');
	                ev.gesture.stopDetect();
	                break;

	            case 'swiperight':
	            	console.log("prev")
	                $('#forecast').carousel('prev');
	                ev.gesture.stopDetect();
	                break;

	            case 'release':/*
	                // more then 50% moved, navigate
	                if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
	                    if(ev.gesture.direction == 'right') {
	                        self.prev();
	                    } else {
	                        self.next();
	                    }
	                }
	                else {
	                    self.showPane(current_pane, true);
	                }
	                break;*/
	        }
	    }
    }
);