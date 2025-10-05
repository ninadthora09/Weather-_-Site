const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const input = document.querySelector('.search-box input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const APIkey = '21e562c7f64c3044f3e002f51c251a03';

// 🔹 Function to fetch weather
function getWeather() {
  const city = input.value.trim();
  if (city === '') return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`)
    .then(response => response.json())
    .then(json => {
      if (json.cod == '404') {
        container.style.height = '400px';
        weatherBox.classList.remove('active');
        weatherDetails.classList.remove('active');
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

      switch (json.weather[0].main) {
        case 'Clear':
          image.src = 'images/clear_sky.png';
          break;
        case 'Rain':
          image.src = 'images/rain.jpeg';
          break;
        case 'Snow':
          image.src = 'images/snow.png';
          break;
        case 'Clouds':
          image.src = 'images/cloud.png';
          break;
        case 'Mist':
          image.src = './images/mist_image.png';
          break;
        case 'Haze':
          image.src = './images/404.jpg';
          break;
        default:
          image.src = './images/clear_image.png';
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)}km/h`;
    });
}

// 🔹 Run when search button is clicked
search.addEventListener('click', getWeather);

// 🔹 Run when Enter is pressed
input.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // prevent accidental form submission or reload
    getWeather();
  }
});
