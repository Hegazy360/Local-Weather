var latitude;
var longitude;
var location_html;
var date_html;
var summary_html;
var temperature_html;
var high_low_html;
var day_container_html;
var icons = {};
var country;
var city;
var unit;
$(document).ready(function() {
  geoFindMe();
});

function getWeather(unit) {
  summary_html = "";
  temperature_html = "";
  high_low_html = "";
  $.ajax({
    url: 'https://api.forecast.io/forecast/9f2821a3c8a5fbf998ee9cd72792d94e/' + latitude + ',' + longitude, // The URL to the API. 
    type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
    data: {}, // Additional parameters here
    dataType: 'jsonp',
    success: function(data) {
      var skycons = new Skycons({
        "color": "#f5f5f5"
      });
      var skycons_day = new Skycons({
        "color": "#F2B83B"
      });
      $(".icon").removeClass("hidden")
      skycons.set("icon0", data.currently.icon);
      skycons.play();
      display_days(0);

      function display_days(unit_day) {
        $(".days-container").html("");
        if (unit_day == 0) {
          $.each(data.daily.data, function(name, value) {
            
            if (name !== 0) {
              day_weather_html = "<div class=\"day-weather col-xs-6 animated fadeIn nopadding\">";
              day_weather_html += "<div class=\"row\"><p class=\"col-xs-6 col-xs-offset-3 text-center day-name\">" + moment.unix(value.time).format('dddd') + "</p></div>";

              day_weather_html += "<div class=\"flex-row-day\"><canvas class=\"icon icon-day img img-responsive center-block animated fadeIn\" id=\"icon" + name + "\" height=\"64px\" width=\"64px\"></canvas>";
              day_weather_html += "<div class=\"col-xs-6 temperature2 text-left\"><div class=\"high-low2 flex-column nopadding\"><p class=\"high2 text-right nopadding animated fadeIn\">" + Math.floor((value.temperatureMax - 32) * 5 / 9) + "&deg;C</p><p class=\"low2 text-right nopadding animated fadeIn\">" + Math.floor((value.temperatureMin - 32) * 5 / 9) + "&deg;C</p></div><p class=\"temperature2 animated fadeIn nopadding\">" + Math.floor(((value.temperatureMax + value.temperatureMin) / 2 - 32) * 5 / 9) + "&deg;C</p></div></div>"
              day_weather_html += "</div>";
              $(".days-container").append(day_weather_html);
              skycons_day.set("icon" + name, value.icon);
              skycons_day.play();
            }
          });
        } else {
          $.each(data.daily.data, function(name, value) {
            
            if (name !== 0) {
              day_weather_html = "<div class=\"day-weather col-xs-6 animated fadeIn nopadding\">";
              day_weather_html += "<div class=\"row\"><p class=\"col-xs-6 col-xs-offset-3 text-center day-name\">" + moment.unix(value.time).format('dddd') + "</p></div>";

              day_weather_html += "<div class=\"flex-row-day\"><canvas class=\"icon icon-day img img-responsive center-block animated fadeIn\" id=\"icon" + name + "\" height=\"64px\" width=\"64px\"></canvas>";
              day_weather_html += "<div class=\"col-xs-6 temperature2 text-left\"><div class=\"high-low2 flex-column nopadding\"><p class=\"high2 text-right nopadding animated fadeIn\">" + Math.floor(value.temperatureMax) + "&deg;F</p><p class=\"low2 text-right nopadding animated fadeIn\">" + Math.floor(value.temperatureMin) + "&deg;F</p></div><p class=\"temperature2 animated fadeIn nopadding\">" + Math.floor((value.temperatureMax + value.temperatureMin) / 2) + "&deg;F</p></div></div>"
              day_weather_html += "</div>";
              $(".days-container").append(day_weather_html);
              skycons_day.set("icon" + name, value.icon);
              // skycons_day.play();
            }
          });
        }

      }

      summary_html = "<p class=\"details-1 summary animated fadeIn\">" + data.currently.summary + "</p>";
      date_html = "<p class=\"animated fadeIn text-right\">" + moment.unix(data.currently.time).format('dddd,LL') + "</p>";

      $(".date").html(date_html);
      $(".details-1").append(summary_html);
      display_current(0);

      function display_current(unit2) {
        if (unit2 == 0) {
          temperature_html = "<p class=\"temperature animated fadeIn nopadding\">" + Math.floor((data.currently.temperature - 32) * 5 / 9) + "&deg;C</p>";
          high_low_html = "<p class=\"high text-right nopadding animated fadeIn\">" + Math.floor((data.daily.data[0].temperatureMax - 32) * 5 / 9) + "&deg;C</p><p class=\"low text-right nopadding animated fadeIn\">" + Math.floor((data.daily.data[0].temperatureMin - 32) * 5 / 9) + "&deg;C</p>"
          $(".temperature-container").html(temperature_html);
          $(".high-low").html(high_low_html);
        } else {
          temperature_html = "<p class=\"temperature animated fadeIn nopadding\">" + Math.floor(data.currently.temperature) + "&deg;F</p>";
          high_low_html = "<p class=\"high text-right nopadding animated fadeIn\">" + Math.floor(data.daily.data[0].temperatureMax) + "&deg;F</p><p class=\"low text-right nopadding animated fadeIn\">" + Math.floor(data.daily.data[0].temperatureMin) + "&deg;F</p>"
          $(".temperature-container").html(temperature_html);
          $(".high-low").html(high_low_html);

        }
      }
      unit = 0;
      $(".temperature-container,.days-container").click(function(event) {
        event.stopPropagation();
        unit = !unit;
        display_current(unit);
        display_days(unit);
      });
      $("#cssload-pgloading").addClass("hide");
      $(".main-container").removeClass("hide");
    },
    error: function(err) {
      alert("error");
    },
    beforeSend: function(xhr) {

    }
  });
}

function getLocation() {
  location_html = "";

  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true', // The URL to the API. 
    type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
    data: {}, // Additional parameters here
    dataType: 'json',
    success: function(data) {
      $.each(data.results[0].address_components, function(name, value) {
        if (value.types[0] == "country") {
          country = value.long_name;
          getPicture();
        }
        if (value.types[0] == "administrative_area_level_1") {
          city = value.long_name;
        }
      });
      location_html += "<p class=\"animated fadeIn\">" + city + "," + country + "</p>";
      $(".location").html(location_html);
    },
    error: function(err) {
      alert("error");
    },
    beforeSend: function(xhr) {

    }
  });
}

function getPicture() {

  $.ajax({
    url: 'https://api.flickr.com/services/rest/', // The URL to the API. 
    type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
    data: {
      method: "flickr.photos.search",
      api_key: "f6120bd126e919b47a378ff08384f492",
      tags: country + ",nature",
      content_type: "photos",
      per_page: 20,
      sort: "interestingness-desc",
      is_getty: true,
      format: "json",
      nojsoncallback: 1
    }, // Additional parameters here
    dataType: 'json',
    success: function(data) {
      var random_photo = Math.floor((Math.random() * data.photos.photo.length - 1) + 1);
      var value = data.photos.photo[random_photo];

      var url = 'https://farm' + value.farm + '.staticflickr.com/' + value.server + '/' + value.id + '_' + value.secret + '.jpg';
      $(".top-container").css("background-image", "url( " + url + ")");

    },
    error: function(err) {
      alert("error");
    },
    beforeSend: function(xhr) {

    }
  });
}

function geoFindMe() {
  
  if (!navigator.geolocation) {
    alert("ERROR");

    alert("Geolocation is not supported by your browser");
    return;
  }

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    getWeather();
    getLocation();
    //     output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    //     var img = new Image();
    //     img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    //     output.appendChild(img);
  };

  function error() {
    alert("Unable to retrieve your location");
  };
  // output.innerHTML = "<p>Locating…</p>";
  navigator.geolocation.getCurrentPosition(success, error);
}