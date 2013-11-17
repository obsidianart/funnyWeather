// Are you thinking that I should have separated the data from the template so I could have change the forecast system at any time? I agree http://xkcd.com/974/
// There's already libraries that do that, this application is an example of require with ajax call not a production ready app.
			
define([
	"jquery",
	"jquerytextfit",
	"underscore",
	"iscroll",
	"js/vendor/skycons",
	"js/vendor/js-weighted-list",
	"js/quotes",
	"js/carousel",
	"text!templates/main.html"
	], function (
		$,
        textFit,
		_,
		_iscroll,
		_Skycons,
		_weightedList,
		weatherQuotes,
		carousel,
		_mainTemplate
	) {
		return function(options){
			var navLinkTemplate = _.template('<li class="<%= current?"current":"" %>"><a href="#day-<%= id %>" data-page="<%= id %>"><%= name %></a></li>'),
				mainTemplate = _.template(_mainTemplate),
				$foreCast = $('#forecast'),
				location = options.location,
				navDays = '';
				weekday= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
				skycons = new Skycons({"color": "#2da7df"}),
				weather = options.forecastData;

			

			//adding today weather
			$foreCast.html(mainTemplate ({
				id: 1,
				location: location,
				summary : weather.currently.summary,
				temperature : Math.round(weather.currently.temperature) + "&#176;",
				description : getQuotes(weather.currently),
				icon:getSkyconStatus(weather.currently.icon),
				active: true
			}));

			navDays += navLinkTemplate({id:1, name:'Today', current:true});

			//adding forecast
			$.each(weather.daily.data, function(i,el){
				var date, day;

				if (i==0) return; //first one is today
				var minTemp = el.temperatureMin ? Math.round(el.temperatureMin) : '?';
				$foreCast.append(mainTemplate ({
					id:i+1,
					location: location,
					summary : el.summary,
					temperature : minTemp + "&#176; to " + Math.round(el.temperatureMax) + "&#176;",
					description : getQuotes(el),
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

			
			var dayWidth = $('#forecast-wrapper').width();
			$('.day').width(dayWidth);

			//iScroll
			$('#forecast').width(dayWidth * $('.day').length);

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
			};

			//update text height with real heigth

			//fitting text for location
			$('.location').each(function(i,el){
				textFit(el,{
					maxFontSize: $(el).css('font-size'),
					multiLine: false,
					detectMultiLine: false
				});
			})

			//fitting text for descriptions
			$('.description').each(function(i,el){
				textFit(el,{
					maxFontSize: $(el).css('font-size'),
					multiLine: true,
					detectMultiLine: false
				});
			});

			
			

			//Binding menus to iscroll
			$('nav ul a').click(function(e){
				e.preventDefault();
				myScroll.scrollToPage($(e.target).data('page') - 1, 500);
			});

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


			//Return the right quote
			function getQuotes(el){
				var quoteWeights = [],
				weightedList,
				weight,
				chooseQuote,
				fMin = el.temperatureMin || el.apparentTemperature || el.temperatureMax ,
				fMax = el.temperatureMax || el.apparentTemperature || el.temperatureMin ,
				fPrecProb = el.precipProbability || 0,
				ret = '';

				/*
					['wind',0],
					['rain',0],
					['littleRain',0]
				*/

				//is cold
				if (fMin <= 12 && fMin>0) {
					weight = Math.floor(fMin)+1;
					quoteWeights.push(['cold',weight]);
				}

				//is very cold
				if (fMin <= 0) {
					weight = Math.floor(Math.abs(fMin))+1;
					quoteWeights.push(['veryCold',weight]);
				}

				//is hot
				if (fMax >22) {
					weight = Math.floor(Math.abs(fMax))+1;
					quoteWeights.push(['warm',weight]);
				}

				//Slight rain
				if (fPrecProb>0.1 && fPrecProb<0.5 && el.precipType ==='rain') {
					weight = Math.floor(Math.abs(fPrecProb)*20);
					quoteWeights.push(['littleRain',weight]);
				}

				//Rain
				if (fPrecProb>0.5 && el.precipType ==='rain' && el.precipIntensity > 0.2) {
					weight = Math.floor(Math.abs(fPrecProb)*20);
					quoteWeights.push(['rain',weight]);
				}

				if (quoteWeights.length > 0) {
					weightedList = new WeightedList(quoteWeights);
					chooseQuote = weatherQuotes[weightedList.peek()];
				} else {
					chooseQuote = weatherQuotes.generic;
				}
				
				ret = chooseQuote[getRnd(chooseQuote.length) ];
				ret = ret.replace(/{/gi,'<span class="highlighted">');
				ret = ret.replace(/}/gi,'</span>');

				return ret;
			}

			function getRnd(n) {
				return parseInt(Math.random() * n);
			}

			function getSkyconStatus(icon) {
				return icon.toUpperCase().replace(/-/gi,'_')
			}
		}
    }
);