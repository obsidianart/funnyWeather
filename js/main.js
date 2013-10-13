requirejs.config({
	baseUrl: '',
	paths: {
	    text: 'js/vendor/text',
	    jquery: 'js/vendor/jquery-1.10.1',
	    iscroll: 'js/vendor/iscroll/iscroll',
	    underscore: 'js/vendor/underscore-min',
	    weatherApi: 'https://api.forecast.io/forecast/f3a549e99fe815ba1da83dbe4d5146cb/51.5072,0.1275?units=uk&exclude=minutely,hourly&callback=define',
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
	"text!templates/nav.html",
	"text!templates/main.html"
	], function (
		$,
		_,
		_iscroll,
		weather,
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
		});
		skycons.play();

		myScroll = new iScroll('forecast-wrapper', {
			hScrollbar: false,
			vScrollbar: false,
			snap: '.day',
		});





		function getSkyconStatus(icon) {
			return icon.toUpperCase().replace(/-/gi,'_')
		}

    }
);