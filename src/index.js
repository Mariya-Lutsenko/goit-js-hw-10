import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(onSerch, DEBOUNCE_DELAY));

function onSerch(event) {
  const searchQuery = event.target.value.trim();
  //   deleteInfo();
  console.log(searchQuery);
  if (searchQuery === '') {
    deleteInfo();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountriesList(countries);
      } else if (countries.length === 1) {
        renderContryCard(countries);
      }
    })
    .catch(error => onFetchError());
}

function renderCountriesList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
             <b>${country.name.official}</p>
    </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderContryCard(countries) {
  const markup = countries
    .map(country => {
      return `
        <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" hight="20">
           <b>${country.name.official}</b></p>
              <p><b>Capital</b>: ${country.capital}</p>
              <p><b>Population</b>: ${country.population}</p>
              <p><b>Languages</b>: ${Object.values(country.languages)} </p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function deleteInfo() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
