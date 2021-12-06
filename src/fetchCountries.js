import countryCardTpl from "./templates/country.hbs";
import countryListTpl from "./templates/countryList.hbs";
import debounce from "lodash.debounce";
import { Notify } from "notiflix/build/notiflix-notify-aio";


const refs = {
    inputCountry: document.querySelector('[id = search-box]'),
    countryInfo: document.querySelector('.country-info'),
    countryList: document.querySelector('.country-list'),
}


const onInputChange = (e) => {
    let x = '';
    x = e.target.value;
    if (x === '') {
        onCleanFindCountries();
        return;
    }

    fetch(`https://restcountries.com/v3.1/name/${x.trim()}?fields=name,capital,population,flags,languages`)

        .then(response => {
            return response.json();
        })
    
        .then(country => {
            
            if (country.length > 10){
                onSpecificName();
                onCleanFindCountries();
                return;
            }

            if (country.length === 1) {
                onCleanFindCountries();
                const markup = countryCardTpl(country);
                refs.countryInfo.innerHTML = markup;
                return;
            }

            if (country.status === 404) {
                onCleanFindCountries();
                onerror();
                return;
            }

            onCleanFindCountries();
            const markup = country.map(countryListTpl).join('');
            refs.countryList.innerHTML = markup;
        })
    
        .catch(error => {
    });
}


refs.inputCountry.addEventListener('input', debounce(onInputChange, 300))