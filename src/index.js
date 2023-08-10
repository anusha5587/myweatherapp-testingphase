let form = document.querySelector("#enterCity-form");
let formInput = document.querySelector("#search-form");
let cityHeading = document.querySelector(".city");
let searchIcon = document.querySelector(".search-icon");
let searchButton = searchIcon.closest("button");
if (searchButton) {
  searchButton.addEventListener("click", searchingCity);
}

function retrieveCurrentDate(response) {
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let currentDate = new Date();
  let day = weekdays[currentDate.getDay()];
  let currentDay = currentDate.getDate();
  let month = months[currentDate.getMonth()];
  let year = currentDate.getFullYear();
  let dateAndTime = `${day}, ${currentDay} ${month}`;

  let dateTime = document.querySelector(".datetime");
  dateTime.textContent = dateAndTime;

  console.log(response);
}

function time(timestamp) {
  let currentTime = new Date();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let minutesString = minutes.toString().padStart(2, "0");
  let currentTimeString = hours + ":" + minutesString;

  let nowTime = document.querySelector(".nowtime");
  let nowTimeFormat = `Current time is ${currentTimeString}`;
  nowTime.textContent = nowTimeFormat;

  console.log(timestamp);
}

function weatherData(data) {
  let temperatureInCelsius = 17;
  let roundedTemperature = temperatureInCelsius.toFixed(2);
  console.log(roundedTemperature);

  let temperatureElement = document.querySelector("#temperature-value");
  temperatureElement.innerHTML = Math.round(data.main.temp) + "°C";

  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");

  function convertToCelsius() {
    temperatureElement.textContent = temperatureInCelsius.toFixed(2);
  }

  function convertToFahrenheit() {
    const temperatureInFahrenheit = (temperatureInCelsius * 9) / 5 + 32;
    temperatureElement.textContent = temperatureInFahrenheit.toFixed(2);
  }

  celsiusLink.addEventListener("click", convertToCelsius);
  fahrenheitLink.addEventListener("click", convertToFahrenheit);

  console.log(data);
}

function updateLastUpdated(data, timestamp) {
  console.log(timestamp);
  let currentTime = new Date();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let minutesString = minutes.toString().padStart(2, "0");
  let currentTimeString = hours + ":" + minutesString;
  let updateTime = document.querySelector(".updation");
  updateTime.textContent = `Updated at ${currentTimeString}`;
}

function updateWeatherData(data) {
  console.log(data);
  let feelsLike = document.querySelector(".feels-like");
  feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°`;

  let windSpeed = document.querySelector(".wind-speed");
  windSpeed.textContent = `Wind ${data.wind.speed} kph`;

  let sunsetData = { sys: { sunset: 1691501788000 } };
  let { sunset } = sunsetData.sys;
  let locale = "en-GB";

  function getFormattedTime(timestamp, locale) {
    let date = new Date(timestamp * 1000);
    let options = { hour: "numeric", minute: "numeric" };
    return new Intl.DateTimeFormat(locale, options).format(date);
  }
  let sunsetTime = document.querySelector(".sunset-time");
  sunsetTime.textContent = `Sunset: ${getFormattedTime(sunset, locale)}`;

  let hiLoTemp = document.querySelector(".hi-lo-temp");
  let hiLoTempFormat = `Hi: ${Math.round(
    data.main.temp_max
  )}° | Lo: ${Math.round(data.main.temp_min)}°`;
  hiLoTemp.textContent = hiLoTempFormat;
}

function handleWeatherData(data) {
  let cityName = data.name;
  cityHeading.textContent = cityName;
  console.log(cityName);
  let timestamp = data.dt;
  retrieveCurrentDate(cityName);
  time(timestamp);
  weatherData(data);
  updateWeatherData(data);
  updateLastUpdated(data, timestamp);
  formInput.value = "";
}

function getWeatherData(cityName) {
  let apiKey = "88724523008dc9e1be18f6eb6a959b67";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      handleWeatherData(data);
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
}

function weatherDataByGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let apiKey = "88724523008dc9e1be18f6eb6a959b67";
      let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      fetch(apiUrlCurrent)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          handleWeatherData(data);
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
    });
  }
}
function searchingCity(event) {
  event.preventDefault();
  let cityName = formInput.value;
  cityHeading.textContent = cityName;
  console.log(cityName);
  getWeatherData(cityName);

  formInput.value = "";
}
form.addEventListener("submit", searchingCity);

let locationButton = document.querySelector(".locationButton");
locationButton.addEventListener("click", weatherDataByGeolocation);
