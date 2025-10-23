const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const input = document.querySelector('.search-box input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const forecastContainer = document.querySelector('.forecast-container');

// 🌤️ WELCOME ANIMATION
window.addEventListener("load", () => {
  const welcomeScreen = document.querySelector(".welcome-screen");

  setTimeout(() => {
    welcomeScreen.classList.add("hide");
    container.classList.add("show");
  }, 3000);
});

// Replace with your OpenWeatherMap API key
const APIkey = '21e562c7f64c3044f3e002f51c251a03';

// Loader shimmer
const loader = document.createElement('div');
loader.classList.add('loader');
container.appendChild(loader);

// =====================
// Fetch weather by city
// =====================
async function getWeatherForecast() {
  const city = input.value.trim();
  if (city === '') return;

  loader.classList.add('active');
  weatherBox.classList.remove('active');
  weatherDetails.classList.remove('active');
  error404.classList.remove('active');
  forecastContainer.innerHTML = '';

  try {
    // 1️⃣ Get lat/lon for the city
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`
    );
    const geoData = await geoRes.json();

    if (!geoData[0]) {
      loader.classList.remove('active');
      container.style.height = '400px';
      error404.classList.add('active');
      return;
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // 2️⃣ Fetch 5-day forecast using lat/lon
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`
    );
    const forecastData = await forecastRes.json();
    loader.classList.remove('active');

    container.style.height = '650px';
    weatherBox.classList.add('active');
    weatherDetails.classList.add('active');
    error404.classList.remove('active');

    // Current weather (first forecast entry)
    const current = forecastData.list[0];
    updateWeatherDisplay(current);

    // Next 2-day forecast (12:00 entries)
    const nextTwoDays = forecastData.list.filter(f => f.dt_txt.includes("12:00:00")).slice(1, 3);

    // Display visually
    displayForecastCards(nextTwoDays);

    // Speak weather
    speakForecast(city, nextTwoDays, current);

  } catch (error) {
    loader.classList.remove('active');
    alert('Something went wrong. Please check your connection or try again.');
    console.error(error);
  }
}

// =====================
// Update current weather display
// =====================
function updateWeatherDisplay(data) {
  const image = document.querySelector('.weather-box img');
  const temperature = document.querySelector('.weather-box .temperature');
  const description = document.querySelector('.weather-box .description');
  const humidity = document.querySelector('.weather-details .humidity span');
  const wind = document.querySelector('.weather-details .wind span');

  temperature.innerHTML = `${parseInt(data.main.temp)}<span>°C</span>`;
  description.innerHTML = data.weather[0].description;
  humidity.innerHTML = `${data.main.humidity}%`;
  wind.innerHTML = `${parseInt(data.wind.speed)} km/h`;

  const main = data.weather[0].main;
  const weatherConditions = {
    Clear: 'images/clear_sky.png',
    Rain: 'images/rain.png',
    Snow: 'images/snow.png',
    Clouds: 'images/cloud.png',
    Mist: 'images/mist.png',
    Haze: 'images/mist.png',
    Default: 'images/clear_sky.png'
  };
  image.src = weatherConditions[main] || weatherConditions.Default;

  // Smooth animation
  weatherBox.classList.add('fade-in');
  weatherDetails.classList.add('fade-in');
  setTimeout(() => {
    weatherBox.classList.remove('fade-in');
    weatherDetails.classList.remove('fade-in');
  }, 1200);
}

// =====================
// Display next 2-day forecast cards
// =====================
function displayForecastCards(forecasts) {
  forecastContainer.innerHTML = '';

  forecasts.forEach(f => {
    const date = new Date(f.dt_txt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const temp = parseInt(f.main.temp);
    const desc = f.weather[0].description;
    const main = f.weather[0].main;

    const weatherConditions = {
      Clear: 'images/clear_sky.png',
      Rain: 'images/rain.png',
      Snow: 'images/snow.png',
      Clouds: 'images/cloud.png',
      Mist: 'images/mist.png',
      Haze: 'images/mist.png',
      Default: 'images/clear_sky.png'
    };
    const imgSrc = weatherConditions[main] || weatherConditions.Default;

    const card = document.createElement('div');
    card.classList.add('forecast-card');

    card.innerHTML = `
        <p><strong>${date}</strong></p>
        <img src="${imgSrc}" alt="${desc}">
        <p>${temp}°C</p>
        <p>${desc}</p>
    `;

    forecastContainer.appendChild(card);
  });
}

// =====================
// Speak weather
// =====================
function speakForecast(city, forecasts, current) {
  let speechText = `The current weather in ${city} is ${current.weather[0].description} with a temperature of ${parseInt(current.main.temp)} degrees Celsius. Humidity is ${current.main.humidity} percent and wind speed is ${parseInt(current.wind.speed)} kilometers per hour. `;

  speechText += `Here is the forecast for the next two days: `;
  forecasts.forEach(f => {
    const date = new Date(f.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
    speechText += `${date}: ${f.weather[0].description}, temperature around ${parseInt(f.main.temp)} degrees Celsius. `;
  });

  const msg = new SpeechSynthesisUtterance(speechText);
  msg.lang = "en-US";
  window.speechSynthesis.speak(msg);
}

// =====================
// Event listeners
// =====================
search.addEventListener('click', getWeatherForecast);
input.addEventListener('keypress', e => e.key === 'Enter' && getWeatherForecast());

// =====================
// Floating container effect
// =====================
document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.pageX) / 60;
  const y = (window.innerHeight / 2 - e.pageY) / 60;
  container.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateZ(0px)`;
});
document.addEventListener("mouseleave", () => {
  container.style.transform = "rotateY(0deg) rotateX(0deg)";
});
