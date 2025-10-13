const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const input = document.querySelector('.search-box input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');


// 🌤️ WELCOME ANIMATION
window.addEventListener("load", () => {
  const welcomeScreen = document.querySelector(".welcome-screen");
  const container = document.querySelector(".container");

  // Show welcome for 3 seconds, then fade out
  setTimeout(() => {
    welcomeScreen.classList.add("hide");
    container.classList.add("show");
  }, 3000);
});


const APIkey = '21e562c7f64c3044f3e002f51c251a03';

// Loader shimmer
const loader = document.createElement('div');
loader.classList.add('loader');
container.appendChild(loader);

async function getWeather() {
  const city = input.value.trim();
  if (city === '') return;

  // Show loader
  loader.classList.add('active');
  weatherBox.classList.remove('active');
  weatherDetails.classList.remove('active');
  error404.classList.remove('active');

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`
    );
    const json = await response.json();

    loader.classList.remove('active');

    if (json.cod == '404') {
      container.style.height = '400px';
      error404.classList.add('active');
      return;
    }

    container.style.height = '555px';
    weatherBox.classList.add('active');
    weatherDetails.classList.add('active');
    error404.classList.remove('active');

    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');

    const main = json.weather[0].main;
    const weatherConditions = {
      Clear: { img: 'images/clear_sky.png', color: 'rgba(255, 215, 0, 0.3)' },
      Rain: { img: 'images/rain.jpeg', color: 'rgba(52, 152, 219, 0.3)' },
      Snow: { img: 'images/snow.png', color: 'rgba(236, 240, 241, 0.3)' },
      Clouds: { img: 'images/cloud.png', color: 'rgba(149, 165, 166, 0.3)' },
      Mist: { img: 'images/mist_image.png', color: 'rgba(189, 195, 199, 0.3)' },
      Haze: { img: 'images/404.jpg', color: 'rgba(211, 84, 0, 0.3)' },
      Default: { img: 'images/clear_image.png', color: 'rgba(255,255,255,0.2)' },
    };

    const { img, color } = weatherConditions[main] || weatherConditions.Default;
    image.src = img;
    container.style.boxShadow = `0 0 60px ${color}`;

    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = json.weather[0].description;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)} km/h`;

    // Smooth animation
    weatherBox.classList.add('fade-in');
    weatherDetails.classList.add('fade-in');

    setTimeout(() => {
      weatherBox.classList.remove('fade-in');
      weatherDetails.classList.remove('fade-in');
    }, 1200);
  } catch (error) {
    loader.classList.remove('active');
    alert('Something went wrong. Please check your connection or try again.');
  }
}

// Event listeners
search.addEventListener('click', getWeather);
input.addEventListener('keypress', e => e.key === 'Enter' && getWeather());
