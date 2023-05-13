import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(findCountries, DEBOUNCE_DELAY)
);

function findCountries(event) {
  const countryName = event.target.value.trim();

  clear(refs.countryList);
  clear(refs.countryInfo);

  if (countryName === '') {
    return;
  }

  getCountries(fetchCountries(countryName));
}

function getCountries(countries) {
  countries
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            timeout: 2000,
          }
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountriesList(countries);
      } else {
        renderCountryInfo(countries);
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name', {
        timeout: 2000,
      });
    });
}

function renderCountriesList(countries) {
  const markup = countries
    .map(({ flags: { svg }, name: { official } }) => {
      return `<li class="country-list-item">
        <img src=${svg} class="country-list-img" />
        <p class="country-list-name">${official}</p>
      </li>`;
    })
    .join('');

  refs.countryList.innerHTML = markup;
}

function renderCountryInfo(countries) {
  const {
    name: { official },
    flags: { svg },
    capital,
    population,
    languages,
  } = countries[0];

  const languagesValue = Object.values(languages).join(', ');

  const markup = `<h2 class="country-name"><img src=${svg} class="country-list-img">${official}</h2>
    <ul class="country-list">
        <li class="country-info-item">Capital: <span>${capital[0]}</span></li>
        <li class="country-info-item">Population: <span>${population}</span></li>
        <li class="country-info-item">Languages: <span>${languagesValue}</span></li>
    </ul>`;

  refs.countryInfo.innerHTML = markup;
}

function clear(el) {
  el.innerHTML = '';
}
