// global variables
const APIKey = "4c8c080764185f72f0ba88307580a057"
const weatherInfoEl = $('#weatherinfo')
const forecastEl = $('#forecast')
const searchEl = $('#search')
var searchHistory = JSON.parse(localStorage.getItem("cities")) || [];
let historyEl = document.querySelector("#history");

// history is retained on refresh of website
function init() {
    if (searchHistory.length > 0) {
        let max = searchHistory.length >= 5 ? 5 : searchHistory.length;
        let count = 0;
        for (let i = searchHistory.length - 1; i >= 0; i--) {
            let historyButtons = document.createElement("button");
            historyButtons.setAttribute("city", searchHistory[i]);
            historyButtons.innerHTML = searchHistory[i];
            historyEl.append(historyButtons);
            count++;
            if (count === max) {
                break;
            }
        }
    }
}

// various input methods for submits and clicks
$("#search-form").on("submit", function(event) {
    event.preventDefault();
    let searchInput = $('#search').val();
    searchWeather(searchInput);
    searchForecast(searchInput);
});

$(".search-btn").on("click", function(event) {
    event.preventDefault();
    let searchInput = $('#search').val();
    searchWeather(searchInput);
    searchForecast(searchInput);
});

let historyButtonClick = function(event) {
    let button = event.target;
    let searchInput = button.getAttribute("city");
    if (searchInput) {
        searchWeather(searchInput);
        searchForecast(searchInput);
    }
};

// pulls primary weather information box
function searchWeather(searchInput) {
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + APIKey + "&units=imperial",
      method: "GET"
    }).then((data) => {
        console.log(data)

        let iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        let icon = document.createElement("img");
        icon.setAttribute("src", iconURL);

        weatherInfoEl.empty();
        weatherInfoEl.append($('<div>').addClass('row'));
        weatherInfoEl.children().eq(0).append($('<div>').addClass('container').attr('id', 'info-box'));
        for (let i = 0; i < 5; i++) {
        $('#info-box').append($('<div>'));
        };    
        $('#info-box').children().eq(0).append($('<h2>').text(`${data.name}`));
        $('#info-box').children().eq(1).append($(icon));
        $('#info-box').children().eq(2).append($('<p>').text(`Temp: ${data.main.temp} F`));
        $('#info-box').children().eq(3).append($('<p>').text(`Wind: ${data.wind.speed} MPH`));
        $('#info-box').children().eq(4).append($('<p>').text(`Humidity: ${data.main.humidity}%`));

        searchHistory = [];
    
        let getStorage = localStorage.getItem("cities")
        if (getStorage) {
            searchHistory = JSON.parse(localStorage.getItem("cities"))
            searchHistory.push(data.name);
            localStorage.setItem("cities", JSON.stringify(searchHistory));
        }else{
            searchHistory.push(data.name);
            localStorage.setItem("cities", JSON.stringify(searchHistory));
        }

    });
}

// pulls 5 day weather forecast
function searchForecast(searchInput) {
    let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=${APIKey}&units=imperial`;
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        console.log(data)

        data.list.forEach((day) => {
            let noon = day.dt_txt.split(" ")[1];
            let date = dayjs(day.dt_txt).format("MMMM DD, YYYY");
            if (noon === "12:00:00") {
              let dayEl = document.createElement("div");
              dayEl.classList.add("day-element")
              dayEl.innerHTML += `<h5 class="font-bold">${date}</h5>`;
              dayEl.innerHTML += `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">`;
              dayEl.innerHTML += `<div>Temp: ${day.main.temp}°</div>`;
              dayEl.innerHTML += `<div>Wind: ${day.wind.speed} MPH</div>`;
              dayEl.innerHTML += `<div>Humidity ${day.main.humidity}%</div>`;
              forecastEl.append(dayEl);
            }
        });
    })
}

init();
historyEl.addEventListener("click", historyButtonClick);