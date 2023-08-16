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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function forecastingReport(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecastreport");

  let forecastHTML = `<div class="row-col-1">
 <table class="dailytable">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<tr>
          <td id="days">${formatDay(forecastDay.dt)}
          </td>
          <td class="tableemoji">
           <img src="https://openweathermap.org/img/wn/${
             forecastDay.weather[0].icon
           }@2x.png" width="30px" />
           </td>
           <td class="numbers">
               <span class="dailyMinTemp">${Math.round(forecastDay.temp.max)}
              </span> °C </td>
              
              <td class="numbers">
                <span class="dailyMaxTemp">${Math.round(forecastDay.temp.max)}
              </span> °C </td>
         </tr>`;
    }
  });
  forecastHTML = forecastHTML + `</table></div>`;
  forecastElement.innerHTML = forecastHTML;
}

function dailyForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "ad793a6d772939c31783de5822791acf";
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlForecast).then(forecastingReport);
}

function hourlyReport(response) {
  let hourforecast = response.data.hourly;
  let weatherTable = document.querySelector("#weatherTable");
  let hourlyForecastHTML = `<div class="row">

  hourforecast.forEach(function (forecastHour, index) {
    if (index < 8) {
      hourlyForecastHTML =
        hourlyForecastHTML +
        `<div class="row cols-3">
            <div class="col">
              <span id="time">${formatHour(forecastHour.dt)}</span>
              <span id="degree">${Math.round(forecastHour.temp)}</span>°C
              <span id="emoji">
                <img
                  src="https://openweathermap.org/img/wn/${
                    forecastHour.weather[0].icon
                  }.png"
                  width="20px"
                />
              </span>
            </div>
          </div>`;}

  });
hourlyForecastHTML = hourlyForecastHTML + `</div>`;
  weatherTable.innerHTML = hourlyForecastHTML;
}

function hourlyForecast(coordinates) {
  let apiKey = "ad793a6d772939c31783de5822791acf";
  let apiUrlHourly = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrlHourly).then(hourlyReport);
}

function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#tempNumber");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let feelsLikeElement = document.querySelector("#feelsLike");
  let windSpeedElement = document.querySelector("#windSpeed");
  let datetimeElement = document.querySelector("#datetime");
  let maxtempElement = document.querySelector("#maxtemperature");
  let mintempElement = document.querySelector("#mintemperature");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  console.log(response.data.main.temp);
  windSpeedElement.innerHTML = response.data.wind.speed;
  datetimeElement.innerHTML = formatDate(response.data.dt * 1000);
  maxtempElement.innerHTML = Math.round(response.data.main.temp_max);
  mintempElement.innerHTML = Math.round(response.data.main.temp_min);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  dailyForecast(response.data.coord);
  hourlyForecast(response.data.coord);
}

function search(city) {
  let apiKey = "ad793a6d772939c31783de5822791acf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function searchingCity(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#cityInput");
  search(cityInputElement.value);
}

function weatherDataByGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let apiKey = "ad793a6d772939c31783de5822791acf";
      let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      axios.get(apiUrlCurrent).then(displayTemperature);
    });
  }
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#tempNumber");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displaycelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#tempNumber");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchingCity);
let currentlocation = document.querySelector("#current-location-btn");
currentlocation.addEventListener("click", weatherDataByGeolocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displaycelsiusTemp);

search("London");
