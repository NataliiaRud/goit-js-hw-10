import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const countryEl = document.querySelector('.country-info');
listEl.style.listStyle = 'none';
function onInput(e) {
  e.preventDefault();
  const inputValue = inputEl.value.trim();
  if (inputValue) {
    fetchCountries(inputValue)
      .then(countries => {
        console.log(countries);
        if (countries.length > 1 && countries.length < 11) {
          countryEl.innerHTML = '';
          renderCountryList(countries);
        } else if (countries.length === 1) {
          listEl.innerHTML = '';
          renderCountryCard(countries);
        } else if (countries.length > 10) {
          listEl.innerHTML = '';
          countryEl.innerHTML = '';
          Notiflix.Notify.success(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(error => {
        countryEl.innerHTML = '';
        listEl.innerHTML = '';
        console.log(error.name);
      });
  } else {
    countryEl.innerHTML = '';
    listEl.innerHTML = '';
  }
}
function renderCountryCard(countries) {
  const { flags, name, capital, population, languages } = countries[0];
  const markup = `
  <span><img src = "${flags.svg}" width = "30"/></span>
  <span style= "font-size:30px;font-weight:bold">${name.official}</span>
  <p style="font-weight:bold">Capital: ${capital}</p>
  <p style="font-weight:bold">Population: ${population}</p>
  <p style="font-weight:bold">Languages: ${Object.values(languages)}</p>`;
  countryEl.innerHTML = markup;
}
function renderCountryList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li><span><img src = "${flags.svg}" width = "30"/></span><span> ${name.official}</span></li>`;
    })
    .join('');

  listEl.innerHTML = markup;
}

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
