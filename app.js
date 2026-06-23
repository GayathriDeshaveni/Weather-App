const apiKey = "0942972085971b33728a930f2dd002a9";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

const input = document.getElementById("city-input");
const btn = document.getElementById("search-btn");
const card = document.getElementById("weather-card");

const weatherIcons = {
  Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️",
  Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Fog: "🌫️",
  Haze: "🌫️", Smoke: "🌫️", Dust: "🌪️", Sand: "🌪️"
};

async function getWeather(city) {
  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`),
      fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`)
    ]);

    const weather = await weatherRes.json();
    const forecast = await forecastRes.json();

    if (weather.cod === 401 || forecast.cod === "401") {
      card.innerHTML = "<p>API key not activated yet. Try again later.</p>";
      return;
    }

    if (weather.cod === "404") {
      card.innerHTML = "<p>City not found. Please check the name.</p>";
      return;
    }

    const icon = weatherIcons[weather.weather[0].main] || "🌤️";

    // Get one forecast per day (every 8th item = 24hrs)
    const dailyForecasts = forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5);

    const forecastHTML = dailyForecasts.map(day => {
      const date = new Date(day.dt * 1000);
      const dayName = date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
      const dayIcon = weatherIcons[day.weather[0].main] || "🌤️";
      return `
        <div class="forecast-card">
          <p class="forecast-day">${dayName}</p>
          <p class="forecast-icon">${dayIcon}</p>
          <p class="forecast-desc">${day.weather[0].description}</p>
          <p class="forecast-temp">${Math.round(day.main.temp)}°C</p>
          <p class="forecast-feels">Feels ${Math.round(day.main.feels_like)}°C</p>
          <p class="forecast-humidity">💧 ${day.main.humidity}%</p>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div class="current-weather">
        <h2>${weather.name}, ${weather.sys.country}</h2>
        <p class="weather-icon-big">${icon}</p>
        <p class="temp-big">${Math.round(weather.main.temp)}°C</p>
        <p class="weather-desc">${weather.weather[0].description}</p>
        <div class="weather-details">
          <span>🌡️ Feels ${Math.round(weather.main.feels_like)}°C</span>
          <span>💧 ${weather.main.humidity}%</span>
          <span>💨 ${weather.wind.speed} m/s</span>
          <span>👁️ ${(weather.visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>
      <div class="forecast-section">
        <h3>5-Day Forecast</h3>
        <div class="forecast-grid">
          ${forecastHTML}
        </div>
      </div>
    `;
  } catch (error) {
    card.innerHTML = "<p>Something went wrong. Try again.</p>";
  }
}

btn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city) getWeather(city);
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = input.value.trim();
    if (city) getWeather(city);
  }
});
