function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = weekdays[date.getDay()];

  return `${day}, ${hours}:${minutes}`;
}

function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#tempNumber");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let feelsLikeElement = document.querySelector("#feelsLike");
  let windSpeedElement = document.querySelector("#windSpeed");
  let datetimeElement = document.querySelector("#datetime");
  let sunsetElement = document.querySelector("#sunset");
  let maxtempElement = document.querySelector("#maxtemperature");
  let mintempElement = document.querySelector("#mintemperature");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  console.log(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  console.log(response.data.main.temp);
  windSpeedElement.innerHTML = response.data.wind.speed;
  datetimeElement.innerHTML = formatDate(response.data.dt * 1000);
  sunsetElement.innerHTML = formatDate(response.data.sys.sunset * 1000);
  maxtempElement.innerHTML = Math.round(response.data.main.temp_max);
  mintempElement.innerHTML = Math.round(response.data.main.temp_min);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

function search(city) {
  let apiKey = "88724523008dc9e1be18f6eb6a959b67";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function searchingCity(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#cityInput");
  search(cityInputElement.value);
  console.log(cityInputElement.value);
}

function weatherDataByGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let apiKey = "88724523008dc9e1be18f6eb6a959b67";
      let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      axios.get(apiUrlCurrent).then(displayTemperature);
    });
  }
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#tempNumber");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displaycelsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#tempNumber");
  temperatureElement.innerHTML = celsiusTemperature;
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchingCity);
let currentlocation = document.querySelector("#current-location-btn");
currentlocation.addEventListener("click", weatherDataByGeolocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
fahrenheitLink.addEventListener("click", displaycelsiusTemp);

search("London");
