requirejs.config({
	baseUrl: '',
	paths: {
	    text: 'js/vendor/text',
	    jquery: 'js/vendor/jquery-1.10.1',
	    iscroll: 'js/vendor/iscroll/iscroll',
	    underscore: 'js/vendor/underscore-min',
	    forecast: 'js/forecast',
	    //weatherApi: 'mocks/forecast',
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