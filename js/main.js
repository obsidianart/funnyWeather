requirejs.config({
	baseUrl: '',
	paths: {
	    text: 'js/vendor/text',
	    jquery: 'js/vendor/jquery-1.10.1',
	    iscroll: 'js/vendor/iscroll/iscroll',
	    underscore: 'js/vendor/underscore-min',
	    //weatherApi: 'forecast',
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
		//removing the loader
		$('#loader').fadeOut('normal',function(){
			this.remove();
		})

		var navTemplate = _.template(navTemplate);
		var mainTemplate = _.template(mainTemplate);
		var $foreCast = $('#forecast');
		var location = "London";
		var weekday= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

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
		$('nav .date-menu').append('<li><a href="#">Today</a></li>');

		//adding forecast
		$.each(weather.daily.data, function(i,el){
			if (i==0) return; //first one is today
			$foreCast.append(mainTemplate ({
				location: location,
				summary : el.summary,
				temperature : Math.round(el.temperatureMin) + "&#176; to " + Math.round(el.temperatureMax) + "&#176;",
				description : weatherQuotes.partlyCloudy[0],
				icon:getSkyconStatus(el.icon),
				active: false
			}));

			var date = new Date(el.time*1000);
			
			var day = weekday[date.getDay()];
			if (i==1){
				day = "Tomorrow";
			}
			$('nav .date-menu').append('<li><a href="#">' + day + '</a></li>');
		});

		var iconContainer = $foreCast.find('.condition-animation').each(function(i,el){
			skycons.add(el, Skycons[$(el).data('icon')]);
		});

		skycons.play();

		//iScroll
		$('#forecast').width(294*$('.day').length);
		window.myScroll = new iScroll('forecast-wrapper', {
			hScrollbar: false,
			vScrollbar: false,
			vScroll:false,
			snap: '.day',
		});

		function updateTopMenu(){
			$('.date-menu li.current').removeClass('current');

			var page = window.myScroll.currPageX;
			var pos = $('.date-menu li')
				.eq(page)
				.addClass('current')
				.position()
				.left;

			pos-=100;
			pos = pos>0? pos : 0;
			$('.date-menu').css('left',pos * -1)
		}

		window.updateTopMenu = updateTopMenu;

		setInterval(updateTopMenu,50)

		//requestAnimationFrame(updateTopMenu);


		function getSkyconStatus(icon) {
			return icon.toUpperCase().replace(/-/gi,'_')
		}

    }
);