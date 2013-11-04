define([
	"jquery",
	"underscore",
	"iscroll",
	"js/vendor/skycons",
	"js/quotes",
	"js/carousel",
	"text!templates/main.html"
	], function (
		$,
		_,
		_iscroll,
		_Skycons,
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

			
			var dayWidth = $('#forecast-wrapper').width();
			$('.day').width(dayWidth);

			//iScroll
			$('#forecast').width(dayWidth *$('.day').length);

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
    }
);