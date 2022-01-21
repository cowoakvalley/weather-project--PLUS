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

// search city
function whichCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchCity(city) {
  let apiKey = `53982876ff7765b389bc1a3133b58f62`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeather);
}

function displayWeather(response) {
  console.log(response.data);
  document.querySelector("#city-header").innerHTML = response.data.name;
  document.querySelector("#current-temperature").innerHTML =
    Math.round(celciusTemp);
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  celciusTemp = response.data.main.temp;
  showRain(response);
}

function showRain(response) {
  if (response.data.rain > 0) {
    document.querySelector("#rain").innerHTML = Math.round(
      response.data.rain.value
    );
  } else {
    document.querySelector("#rain").innerHTML = 0;
  }
}

let form = document.querySelector(".search-bar");
form.addEventListener("submit", whichCity);

searchCity("Copenhagen");

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
