const API_KEY = "2149008f87e5124132528e3187a96434";

const btn = document.getElementById("checkBtn");
const input = document.getElementById("cityInput");
const container = document.getElementById("weatherContainer");

btn.addEventListener("click", () => {
  const city = input.value.trim();
  if (!city) return;

  fetchWeather(city);
});

async function fetchWeather(city) {
  try {
    container.innerHTML = "Ładowanie...";

    const currentData = await getCurrentWeatherXHR(city);
    console.log("CURRENT:", currentData);

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastRes.json();
    console.log("FORECAST:", forecastData);
    renderWeather(currentData, forecastData);

  } catch (err) {
    container.innerHTML = "Błąd fetchowania danych";
    console.error(err);
  }
}

function getCurrentWeatherXHR(city) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject("Błąd XHR");
      }
    };

    xhr.onerror = function () {
      reject("Request failed");
    };

    xhr.send();
  });
}

function renderWeather(current, forecast) {
  container.innerHTML = "";

  const currentEl = document.createElement("div");
  currentEl.className = "weather-card";

  currentEl.innerHTML = `
        <h3>${current.name}</h3>
        <p><b>${current.main.temp} °C</b></p>
        <p>${current.weather[0].description}</p>
    `;

  container.appendChild(currentEl);

  forecast.list.slice(0, 5).forEach(item => {
    const el = document.createElement("div");
    el.className = "weather-card";

    el.innerHTML = `
            <p>${item.dt_txt}</p>
            <p><b>${item.main.temp} °C</b></p>
            <p>${item.weather[0].description}</p>
        `;

    container.appendChild(el);
  });
}
