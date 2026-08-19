const apiKey ="ea8ad6e454264f968eb90342250204"; // No space before API key

const toggleBtn = document.getElementById("theme-toggle");

// 🌗 Theme toggle functionality
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");

  toggleBtn.textContent = document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
  localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
});

// 🌗 Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
    toggleBtn.textContent = "☀️";
  } else {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
    toggleBtn.textContent = "🌙";
  }
});

// ☁️ Main weather fetch function
async function getWeather() {
  const city = document.getElementById("city-input").value;
  const resultDiv = document.getElementById("weather-result");

  if (!city) {
    resultDiv.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  resultDiv.innerHTML = `
    <div class="loading">
      <img src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="loading" class="spin">
      <p>Fetching weather data...</p>
    </div>
  `;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  try {
    const forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;
    const historyURL = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${yesterdayStr}`;

    const [forecastRes, historyRes] = await Promise.all([
      fetch(forecastURL),
      fetch(historyURL)
    ]);

    const forecastData = await forecastRes.json();
    const historyData = await historyRes.json();

    if (forecastData.error || historyData.error) {
      resultDiv.innerHTML = `<p>City not found or API error.</p>`;
      return;
    }

    const { name, country } = forecastData.location;
    const current = forecastData.current;
    const forecastDays = forecastData.forecast.forecastday;
    const yesterdayWeather = historyData.forecast.forecastday[0].day;

    const weatherText = current.condition.text.toLowerCase();
    const isRainyOrCloudy = weatherText.includes("rain") || weatherText.includes("cloud") || weatherText.includes("overcast");
    const isSunnyOrPartlyCloudy = weatherText.includes("sun") || weatherText.includes("clear") || weatherText.includes("partly");

    document.body.classList.toggle("raining", isRainyOrCloudy);
    document.body.classList.toggle("sunny", isSunnyOrPartlyCloudy);

    resultDiv.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p><strong>Now:</strong> ${current.condition.text}, ${current.temp_c}°C</p>
      <img src="https:${current.condition.icon}" alt="Current Weather Icon">

      <div class="forecast-card">
        <h3>Next 2 Days Forecast</h3>
        <ul>
          ${forecastDays.slice(1).map(day => `
            <li>
              <strong>${day.date}:</strong> ${day.day.condition.text}, 
              Max: ${day.day.maxtemp_c}°C, Min: ${day.day.mintemp_c}°C
              <img src="https:${day.day.condition.icon}" alt="icon">
            </li>
          `).join("")}
        </ul>
      </div>

      <div class="history-card">
        <h3>Yesterday's Overview</h3>
        <p><strong>Humidity:</strong> ${yesterdayWeather.avghumidity}%</p>
        <p><strong>Cloud Cover:</strong> ${yesterdayWeather.avgvis_km} km visibility</p>
      </div>
    `;
  } catch (err) {
    console.error("Fetch error:", err);
    resultDiv.innerHTML = "<p>Error fetching weather data. Check your API key and internet connection.</p>";
  }
}

// 🔥 Popular Cities Mini Weather Cards (Using WeatherAPI)
async function fetchCityWeather(city, prefix) {
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const current = data.current;

    document.getElementById(`${prefix}-temp`).innerText = `Temp: ${current.temp_c}°C`;
    document.getElementById(`${prefix}-humidity`).innerText = `Humidity: ${current.humidity}%`;
    document.getElementById(`${prefix}-rain`).innerText = `Precipitation: ${current.precip_mm} mm`;
    document.getElementById(`${prefix}-condition`).innerText = `Condition: ${current.condition.text}`;
    document.getElementById(`${prefix}-icon`).src = `https:${current.condition.icon}`;
    document.getElementById(`${prefix}-icon`).alt = current.condition.text;
    document.getElementById(`${prefix}-icon`).style.display = "inline-block";

  } catch (err) {
    console.error(`Error fetching weather for ${city}:`, err);
    document.getElementById(`${prefix}-temp`).innerText = "Temp: Error";
    document.getElementById(`${prefix}-humidity`).innerText = "Humidity: Error";
    document.getElementById(`${prefix}-rain`).innerText = "Precipitation: Error";
    document.getElementById(`${prefix}-condition`).innerText = "Condition: Error";
    document.getElementById(`${prefix}-icon`).style.display = "none";
  }
}
// 🌍 Fetch and display popular cities weather on page load
window.onload = () => {
  // Load theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    toggleBtn.textContent = "☀️";
  } else {
    document.body.classList.add("light-theme");
    toggleBtn.textContent = "🌙";
  }

  // Fetch weather for cities
  fetchCityWeather('Delhi,IN', 'delhi');
  fetchCityWeather('Kolkata', 'kolkata');
  fetchCityWeather('Mumbai', 'mumbai');
  fetchCityWeather('Chennai', 'chennai');
};

// const cards = document.querySelectorAll('.city-card');

// cards.forEach(card => {
//   card.addEventListener('mouseenter', () => {
//     cards.forEach(c => c.classList.remove('focused'));
//     card.classList.add('focused');
//   });
// });






