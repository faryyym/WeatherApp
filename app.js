
/********************************CLASSES**************************************/
// Storage

class Storage {
    constructor() {
        this.city;
        this.defaultCity = 'Male';
    }

    getLocationFromLS() {
        if (localStorage.getItem('city') === null) {
            this.city = this.defaultCity;
        } else {
            this.city = localStorage.getItem('city');
        }

        return {
            city: this.city
        }
    }

    setLocationToLS(city) {
        localStorage.setItem('city', city)
    }
}

// Weather Class
class Weather {
    constructor(city) {
        this.apiKey = '2b403805c70374b90e3525a54825f917';
        this.city = city;
    }

    async getWeather() {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`)

        const data = await response.json()
        return data;

        //     return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`)
        //         .then(res => res.json())
        //         .then(data => data)
        // }


    }

    changeLocation(city) {
        this.city = city;
    }
}

// User Interface Class
class UI {
    constructor() {
        this.location = document.getElementById('location')
        this.date = document.getElementById('date')
        this.time = document.getElementById('time')

        this.icon = document.getElementById('icon')
        this.degree = document.getElementById('degree')
        this.desc = document.getElementById('desc')

        this.sun = document.querySelector('.sun')
        this.sunriseClass = document.querySelector('.sunrise')
        this.sunsetClass = document.querySelector('.sunset')
        this.sunrise = document.getElementById('sunrise')
        this.sunset = document.getElementById('sunset')

        this.windSpeed = document.querySelector('.circle p')
        this.windDir = document.querySelector('.arrow')

        this.weather = document.querySelector('.weather')
        this.changeLocationModal = document.querySelector('.modal-container')

    }

    display(data) {
        this.location.textContent = `${data.name}, ${data.sys.country}`;
        this.degree.textContent = `${Math.round(data.main.temp)}°C`;
        this.desc.textContent = data.weather[0].description;
        this.icon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        this.sunrise.textContent = this.convertTime(data.sys.sunrise);
        this.sunset.textContent = this.convertTime(data.sys.sunset)
        this.windSpeed.innerHTML = `Wind<br>${this.convertToKmph(data.wind.speed)} km/h`;
        this.windDir.style.transform = `rotate(${data.wind.deg}deg)`;
        this.theme(data.weather[0].main);


    }

    getDateTime() {
        let months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        let days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];

        let fullDate = new Date();
        let day = days[fullDate.getDay()];
        let month = months[fullDate.getMonth()];
        let date = fullDate.getDate();

        let formatDate = `${day}, ${month} ${date}`;

        let hr = fullDate.getHours();
        let min = (function () {
            const m = fullDate.getMinutes();
            if (m < 10) {
                return '0' + m.toString();
            } else {
                return m;
            }
        })();

        let ampm = (function () {
            if (hr < 12) {
                return 'AM'
            } else {
                return 'PM'
            }
        })();

        let formatTime = `${hr}:${min} ${ampm}`;

        this.date.textContent = formatDate;
        this.time.textContent = formatTime;
    }

    convertTime(timeStamp) {
        let fullDate = new Date(timeStamp * 1000);
        let min = fullDate.getMinutes();
        let hr = fullDate.getHours();
        function addZero(m) {
            if (m < 10) {
                return '0' + m.toString();
            } else {
                return m;
            }
        }

        min = addZero(min)
        hr = addZero(hr)

        let ampm = (function () {
            if (hr < 12) {
                return 'AM'
            } else {
                return 'PM'
            }
        })();

        let fullTime = `${hr}:${min} ${ampm}`;
        return fullTime;
    }

    convertToKmph(meters) {
        // meters per seconds to meters per hour and to km/h
        return Math.floor(meters * 60 * 60 / 1000)
    }

    showModal(e) {
        if (e.target.classList.contains('changelocal')) {
            ui.changeLocationModal.classList.remove('invisible')
        }
    }

    theme(desc) {
        let descArrays = {
            orangetheme: ['Clear', 'Sand'],
            bluetheme: ['Clouds', 'Snow', 'Drizzle', 'Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Dust', 'Ash'],
            darktheme: ['Thunderstorm', 'Rain', 'Squall', 'Tornado']
        }

        //  https://bit.ly/30OrjnJ 
        function getTheme(descArrays, weatherCondition) {
            for (let theme in descArrays) {
                if (descArrays.hasOwnProperty(theme) && Array.isArray(descArrays[theme])) {
                    if (descArrays[theme].indexOf(weatherCondition) != -1) {
                        return theme
                    }
                }
            }
        }

        let currentTheme = getTheme(descArrays, desc);


        if (currentTheme === 'orangetheme' || 'bluetheme') {
            this.weather.style.color = '#2d2d2d';
            this.sunsetClass.style.color = '#2d2d2d';
            this.sunriseClass.style.color = '#2d2d2d';
        }

        if (currentTheme === 'darktheme') {
            this.weather.style.color = 'white';
            this.sunsetClass.style.color = 'white';
            this.sunriseClass.style.color = 'white';
        }


        this.weather.classList = 'weather';
        this.sun.classList = 'sun';
        this.weather.classList.toggle(currentTheme);
        this.sun.classList.toggle(`${currentTheme}2`)


    }



}

/*********************************INITIALISATIONS************************************/
const storage = new Storage();

const storageLocationData = storage.getLocationFromLS();

const weather = new Weather(storageLocationData.city);
const ui = new UI();


function displayWeatherData() {
    weather.getWeather()
        .then(data => {
            ui.display(data);
            console.log(data);
        })
        .catch(err => console.log(err))
}

function modalButtons(e) {
    const modalText = document.getElementById('city')

    if (e.target.classList.contains('cancel')) {
        ui.changeLocationModal.classList.add('invisible')
    }

    if (e.target.classList.contains('save')) {
        weather.changeLocation(modalText.value);
        storage.setLocationToLS(modalText.value);
        displayWeatherData();
        ui.changeLocationModal.classList.add('invisible')
    }

    modalText.value = '';
}



// https://bit.ly/2DVkCY1
setInterval(function syncTime() {
    ui.getDateTime();
    return syncTime;
}(), 1000)


/********************************LISTENERS**************************************/
document.addEventListener('DOMContentLoaded', displayWeatherData);
document.querySelector('.change-location').addEventListener('click', ui.showModal)
document.querySelectorAll('.modal-container button')
    .forEach(button => button.addEventListener('click', modalButtons))

