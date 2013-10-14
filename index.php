<!DOCTYPE html>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>My weather app</title>
        <link rel="icon" type="image/png" href="img/favicon.ico">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="css/normalize.min.css">
        <link rel="stylesheet" href="css/main.css">
    </head>
    <body>
        <div class="container">
            <div class="content-wrapper">
                <nav></nav>
                <div id="forecast-wrapper">
                    <div id="forecast">

                    </div>
                </div>
                <div id="loader">
                    <div id="canvasloader-container" class="wrapper"></div>
                    <h2>Forecasting the weather!<br>Please wait...</h2>
                </div>
            </div>

        </div>
        <footer>
            <a target="_blank" href="http://www.obsidianart.com">Design and code: Stefano Solinas</a><br><br>

            <a target="_blank" href="http://forecast.io">Forecast.io</a> - 
            <a target="_blank" href="https://github.com/darkskyapp/skycons">Skycons</a> -
            <a target="_blank" href="https://github.com/darkskyapp/skycons">Mobile frame</a>

        </footer>

        <script src="http://heartcode-canvasloader.googlecode.com/files/heartcode-canvasloader-min-0.9.1.js"></script>
        <script>
            //loader
            var cl = new CanvasLoader('canvasloader-container');
            cl.setColor('#2da7df'); // default is '#000000'
            cl.setShape('spiral'); // default is 'oval'
            cl.setDiameter(100); // default is 40
            cl.setDensity(46); // default is 40
            cl.setSpeed(1); // default is 2
            cl.setFPS(30); // default is 24
            cl.show(); // Hidden by default
        </script>

        <script src="js/vendor/require.js"></script>
        <script src="js/main.js"></script>
    </body>
</html>
