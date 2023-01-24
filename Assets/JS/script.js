const APIKey = "4c8c080764185f72f0ba88307580a057"
const weatherInfoEl = $('#weatherinfo')
var weatherListEl = $('#weatherlist')
const forecast = document.getElementById("forecast");

$("#search-form").on("submit", function(event) {
    event.preventDefault();
    let searchInput = $("#search").val();
    searchWeather(searchInput);
    searchHistory(searchInput);
});

$(".search-btn").on("click", function(event) {
    event.preventDefault();
    let searchInput = $("#search").val();
    searchWeather(searchInput);
    searchHistory(searchInput);
});

function searchWeather(searchInput) {
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + APIKey + "&units=imperial",
      method: "GET"
    }).then((data) => {
        console.log(data)
  
        weatherInfoEl.empty();
        weatherListEl = [];
  
        weatherInfoEl.append($('<div>').addClass('row'));
        weatherInfoEl.children().eq(0).append($('<div>').addClass('container').attr('id', 'info-box'));
    
        for (let i = 0; i < 4; i++) {
        $('#info-box').append($('<div>'));
        };    
        $('#info-box').children().eq(0).append($('<h2>').text(`${data.name}`));
        $('#info-box').children().eq(1).append($('<p>').text(`Temp: ${data.main.temp} F`));
        $('#info-box').children().eq(2).append($('<p>').text(`Wind: ${data.wind.speed} MPH`));
        $('#info-box').children().eq(3).append($('<p>').text(`Humidity: ${data.main.humidity}%`));


        let getStorage = localStorage.getItem("weatherlist")
        if (getStorage) {
            weatherListEl = JSON.parse(localStorage.getItem("weatherlist"))
            weatherListEl.push(data.name);
            localStorage.setItem("weatherlist", JSON.stringify(weatherListEl));
        }else{
            weatherListEl.push(data.name);
            localStorage.setItem("weatherlist", JSON.stringify(weatherListEl));
        }
      
        let fiveDayWeather = document.createElement("div");
        fiveDayWeather.classList.add("five-day");
        fiveDayWeather.innerHTML = `<h2>filler</h2><p>Temp: ${data.main.temp}*C</p> <p>Wind: ${data.wind.speed} m/s</p> <p>Humidity: ${data.main.humidity}%</p>`;
        forecast.appendChild(fiveDayWeather);
    })
}

function searchForecast (searchInput) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + APIKey + "&units=imperial",
        method: "GET"
      }).then((data) => {
        let lat = data.coord.lat;
        let lon = data.coord.lon;
      });
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey,
        method: "GET"
    }).then((response) => response.JSON())
}

function searchHistory (searchInput) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + APIKey + "&units=imperial",
        method: "GET"
    }).then((data) => {
        $("#weatherlist").append($('<li>').text(data.name));
        $('li').addClass("past-search")
        
    let searchbuttons = document.querySelector(".past-search")
        searchbuttons.addEventListener("click", click => {
        searchWeather(click.target.innerText)
        })
    })
}
