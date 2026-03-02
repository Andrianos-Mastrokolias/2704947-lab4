const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
if (!countryName) return;

spinner.classList.remove('hidden');
countryInfo.classList.add('hidden');
borderingCountries.classList.add('hidden');
errorMessage.classList.add('hidden');

try {
const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
if (!response.ok) {
throw new Error('Country not found');
}

const data = await response.json();
const country = data[0];

countryInfo.innerHTML = `
<h2>${country.name.common}</h2>
<p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
<p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
<p><strong>Region:</strong> ${country.region}</p>
<img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
`;
countryInfo.classList.remove('hidden');

// Borders
borderingCountries.innerHTML = '';

if (country.borders && country.borders.length > 0) {
for (const code of country.borders) {
const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
const borderData = await borderResponse.json();
const borderCountry = borderData[0];

const div = document.createElement('div');
div.innerHTML = `
<p>${borderCountry.name.common}</p>
<img src="${borderCountry.flags.svg}" width="80">
`;
borderingCountries.appendChild(div);
}
borderingCountries.classList.remove('hidden');
} else {
borderingCountries.innerHTML = '<p>No bordering countries</p>';
borderingCountries.classList.remove('hidden');
}

} catch (error) {
errorMessage.textContent = 'Error: Please enter a valid country name.';
errorMessage.classList.remove('hidden');
} finally {
spinner.classList.add('hidden');
}
}

// Button click
searchBtn.addEventListener('click', () => {
searchCountry(countryInput.value.trim());
});

// Enter key
countryInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter') {
searchCountry(countryInput.value.trim());
}
});