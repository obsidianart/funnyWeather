
function init(data) {
	//location, temperature, description, summary
	var template = $('#weather-template').html();
	var genTemplate = _.template(template);
	$(".content-wrapper").html(genTemplate ({
		location: "London",
		summary : data.currently.summary,
		temperature : data.currently.temperature,
		description : weatherQuotes.partlyCloudy[0]
	}));
}

/*
$.ajax({
	url: "https://api.forecast.io/forecast//51.5072,0.1275?units=ca",
	//cache: false,
	dataType: "json"
}).done(function( data ) {


	var item = data.query.results.channel.item;
	var i;
	var foreItem;
	var foreText;
	var forecast = "";

	$('#title').html(item.title);
	$('#today .condition').html(item.condition.text + " and the temperature is " + item.condition.temp + "F");

	for (i=0; i<item.forecast.length; i++) {
		foreItem = item.forecast[i];
		foreText = "On" + foreItem.date + " it will be <strong>" + foreItem.text + "</strong> and the temperature is between " + foreItem.low + "F" + " and " + foreItem.high + "F";
		forecast += '<div><img src="../img/forecast-'+foreItem.code+'.png" alt="'+foreItem.text+'">'+ foreText + '</div>';
	}
	$('#forecast').html(forecast);
	

	var forecastTemplate = _.template("On <%= date %> it will be <strong> <%= forecast %></strong> and the temperature is between <%= min %>F and <%= max %>F");
	for (i=0; i<item.forecast.length; i++) {
		foreItem = item.forecast[i];

		foreText = forecastTemplate({
			date:foreItem.date,
			forecast: foreItem.text,
			min: foreItem.low,
			max: foreItem.high
		});
		
		forecast += '<div><img src="../img/forecast-'+foreItem.code+'.png" alt="'+foreItem.text+'">'+ foreText + '</div>';
	}
	$('#forecast').html(forecast);
	

	var template = $('#weather-template').html();
	var genTemplate = _.template(template);

	$("body").append(genTemplate ({
		title: "London",
		condition : "Rainy",
		forecast : forecast
	}));
});

*/

var weatherQuotes = {
	"partlyCloudy" : ['Just enough <span class="highlighted">sun</span> to forget your <span class="highlighted">umbrella</span>']
}
