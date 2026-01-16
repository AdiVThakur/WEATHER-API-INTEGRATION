const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherByCity(city);
    }
});

// Helper function to turn numeric codes into descriptions
function getWeatherDescription(code) {
    const codes = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing Rime Fog",
        51: "Drizzle",
        61: "Rain",
        71: "Snow",
        95: "Thunderstorm"
    };
    return codes[code] || "Conditions Vary";
}

async function getWeatherByCity(city) {
    try {
        weatherResult.innerHTML = "<p>Searching for city...</p>";

        // 1. Convert City Name to Lat/Long (Geocoding)
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Try another name.");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Fetch Weather using Lat/Long
        weatherResult.innerHTML = "<p>Fetching weather data...</p>";
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        displayWeather(weatherData.current_weather, name, country);

    } catch (error) {
        weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

function displayWeather(current, cityName, countryName) {
    const description = getWeatherDescription(current.weathercode);

    weatherResult.innerHTML = `
        <h2>${cityName}, ${countryName}</h2>
        <p class="temp">${Math.round(current.temperature)}°C</p>
        <p><strong>Condition:</strong> ${description}</p>
        <p><strong>Wind Speed:</strong> ${current.windspeed} km/h</p>
    `;
}