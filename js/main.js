requirejs.config({
	baseUrl: '',
	paths: {
	    text: 'js/vendor/text',
	    jquery: 'js/vendor/jquery-1.10.1',
	    underscore: 'js/vendor/underscore-min',
	    weatherApi: 'https://api.forecast.io/forecast/f3a549e99fe815ba1da83dbe4d5146cb/51.5072,0.1275?units=ca&callback=define'
	},
	shim: {
		'underscore': {
			exports: '_'
		}
	}
});

require([
	"jquery",
	"underscore",
	"weatherApi",
	"js/vendor/skycons",
	"js/quotes",
	"text!templates/nav.html",
	"text!templates/main.html"
	], function (
		$,
		_,
		weather,
		_Skycons,
		weatherQuotes,
		navTemplate,
		mainTemplate
	) {
		var navTemplate = _.template(navTemplate);
		var mainTemplate = _.template(mainTemplate);

		var skycons = new Skycons({"color": "#2da7df"});

		$('nav').html(navTemplate ({

		}));

		$('#main-forecast').html(mainTemplate ({
			location: "London",
			summary : weather.currently.summary,
			temperature : weather.currently.temperature,
			description : weatherQuotes.partlyCloudy[0]
		}));

		var iconContainer = $('#main-forecast').find('.condition-animation').get(0);
		skycons.add(iconContainer, Skycons[getSkyconStatus(weather.currently.icon)]);
		skycons.play();

		function getSkyconStatus(icon) {
			return icon.toUpperCase().replace(/-/gi,'_')
		}
	}
);