<?php
    include 'conf.php';
?>
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
                
            </div>
        </div>

        <script id="weather-template" type="template">
            <nav>
                <ul class="date-menu">
                    <li><a href="#">Today</a></li><li><a href="#">Tomorrow</a></li><li><a href="#">Wednesday</a></li><li><a href="#">Thursday</a></li>
                </ul>
            </nav>
            <h1 class="location"><%= location %></h1>
            <h2 class="condition"><%= summary %> • <%= temperature %>&#176;</h2>
            <p class="description"><%= description %></p>
        </script>

        <script src="js/vendor/jquery-1.10.1.js"></script>
        <script src="js/vendor/underscore-min.js"></script>
        <script src="js/main.js"></script>

        <script src="https://api.forecast.io/forecast/<?php echo WEATHER_KEY; ?>/51.5072,0.1275?units=ca&callback=init"></script>
        
    </body>
</html>