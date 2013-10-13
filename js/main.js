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
	"js/quotes",
	"text!templates/nav.html",
	"text!templates/main.html"
	], function (
		$,
		_,
		weather,
		weatherQuotes,
		navTemplate,
		mainTemplate
	) {
		var navTemplate = _.template(navTemplate);
		var mainTemplate = _.template(mainTemplate);

		$('nav').html(navTemplate ({

		}));

		$('#main-forecast').html(mainTemplate ({
			location: "London",
			summary : weather.currently.summary,
			temperature : weather.currently.temperature,
			description : weatherQuotes.partlyCloudy[0]
		}));
	}
);