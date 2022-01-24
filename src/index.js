//Feature #1 - Time and date
function currentTime() {
  let now = new Date();
  let date = document.querySelector("#date");

  let hours = now.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  date.innerHTML = `${day} ${hours}:${minutes}`;
}
currentTime();

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2" id="weather-forecast-icon" width=80px>
      <img
      src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png"
      alt="weather-forecast-icon"
      width="80px"
      />
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <div class="weather-forecast-temp">
          <span class="weather-forecast-temp-max">${Math.round(
            forecastDay.temp.max
          )}°</span> /
          <span class="weather-forecast-temp-min">${Math.round(
            forecastDay.temp.min
          )}°</span>
        </div>
      </div>
    `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

let form = document.querySelector(".search-bar");
form.addEventListener("submit", whichCity);

// search city
function whichCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchCity(city) {
  let apiKey = `53982876ff7765b389bc1a3133b58f62`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  linkCelcius.classList.add("active");
  linkFahrenheit.classList.remove("active");
  axios.get(apiUrl).then(displayWeather);
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = `53982876ff7765b389bc1a3133b58f62`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  console.log(response.data);
  celciusTemp = response.data.main.temp;
  document.querySelector("#city-header").innerHTML = response.data.name;
  document.querySelector("#current-temperature").innerHTML =
    Math.round(celciusTemp);
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#weather-icon")
    .setAttribute("alt", response.data.weather[0].description);
  showRain(response);

  getForecast(response.data.coord);
}

function showRain(response) {
  if (response.data.rain > 0) {
    document.querySelector("#rain").innerHTML = Math.round(response.data.rain);
  } else {
    document.querySelector("#rain").innerHTML = 0;
  }
}

// current position button
function searchLocation(position) {
  let apiKey = `53982876ff7765b389bc1a3133b58f62`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let button = document.querySelector("#get-current-weather-btn");
button.addEventListener("click", getCurrentLocation);

// celcius and fahrenheit
function selectCelcius(event) {
  event.preventDefault();
  document.querySelector("#current-temperature").innerHTML =
    Math.round(celciusTemp);
  linkFahrenheit.classList.remove("active");
  linkCelcius.classList.add("active");
}

function selectFahrenheit(event) {
  event.preventDefault();
  document.querySelector("#current-temperature").innerHTML = Math.round(
    celciusTemp * 1.8 + 32
  );
  linkCelcius.classList.remove("active");
  linkFahrenheit.classList.add("active");
}

let celciusTemp = null;

let linkCelcius = document.querySelector("#celcius-link");
linkCelcius.addEventListener("click", selectCelcius);

let linkFahrenheit = document.querySelector("#fahrenheit-link");
linkFahrenheit.addEventListener("click", selectFahrenheit);

searchCity("Copenhagen");
displayForecast();
