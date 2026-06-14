const apiKey = "0942972085971b33728a930f2dd002a9";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const input = document.getElementById("city-input");
const btn = document.getElementById("search-btn");
const card = document.getElementById("weather-card");

async function getWeather(city) {
  try {
    const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    if (data.cod === 401) {
      card.innerHTML = "<p>API key not activated yet. Try again in 2 hours.</p>";
      return;
    }

    if (data.cod === "404") {
      card.innerHTML = "<p>City not found. Please check the name.</p>";
      return;
    }

    card.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>🌡️ Temperature: ${data.main.temp}°C</p>
      <p>🌤️ ${data.weather[0].description}</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind: ${data.wind.speed} m/s</p>
      <p>feels like:${data.main.feels_like}°C</p>
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