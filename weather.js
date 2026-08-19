const searchBox = 
document.querySelector('.search-box input');
const searchBtn = document.getElementById('search-button');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const city = document.getElementById('city');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const apiKey = "c4b08155211a73b479320c8a1832c306";
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
async function
    checkWeather(cityName){
        const response = await fetch(`${apiUrl}${cityName}&appid=${apiKey}`);
        if(response.status === 404){
            alert("City not found");
            return;

    }
    const data = await response.json();
    console.log(data);
    console.log(data.weather[0].main);
    console.log(data.weather[0].description);
    temperature.innerHTML = `${Math.round(data.main.temp)}°C`;
    city.innerHTML = data.name;
    description.innerHTML = data.weather[0].description;
   humidity.innerHTML = data.main.humidity + "%";
    windSpeed.innerHTML = data.wind.speed + " km/h";
     
    if(data.weather[0].main === "Clouds"){
        weatherIcon.src="clouds.png";
    } else if(data.weather[0].main === "Clear"){
        weatherIcon.src="clear.png";
    } else if(data.weather[0].main === "Rain"){
        weatherIcon.src="rain.png";
    } else if (data.weather[0].main === "Drizzle"){
        weatherIcon.src="drizzle.png";

    }else if (data.weather[0].main === "Snow"){
        weatherIcon.src="snow.png";
    } else if (data.weather[0].main === "Thunderstorm"){
        weatherIcon.src="rain.png";
    }else{
        weatherIcon.src="clouds.png";
    }
}

searchBtn.addEventListener("click",()=>{
    checkWeather(searchBox.value);

});