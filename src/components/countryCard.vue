/* eslint-disable */
<template>
  <div class="container" v-if="countryList">
    <div class="row">
      <div class="col-12">
        <h2> <b>Countries</b></h2>
      </div>
    </div>
    <div class="row">
      <div class="col d-flex justify-content-center px-3">
        <input class="searchbar" v-on:keyup="onEnter" type="text" name="Search" id="search"
          placeholder="Search Countries">
        <svg class="searchIcon" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"
          fill="grey">
          <path
            d="M779.385-153.846 528.923-404.307q-30 25.538-69 39.538-39 14-78.385 14-96.1 0-162.665-66.529-66.566-66.529-66.566-162.577t66.529-162.702q66.529-66.654 162.577-66.654 96.049 0 162.702 66.565Q610.769-676.101 610.769-580q0 41.692-14.769 80.692-14.769 39-38.769 66.693l250.462 250.461-28.308 28.308ZM381.538-390.769q79.616 0 134.423-54.808Q570.769-500.385 570.769-580q0-79.615-54.808-134.423-54.807-54.808-134.423-54.808-79.615 0-134.423 54.808Q192.308-659.615 192.308-580q0 79.615 54.807 134.423 54.808 54.808 134.423 54.808Z" />
        </svg>
      </div>
    </div>

    <div class="row my-3" v-for="country in countries" :key="country.id">
      <div class="col-12">
        <div class="container-fluid d-flex justify-content-center">
          <div class="row w-50 px-2 py-3 country-card">
            <div class="col-6 ">
              <img class="img-fluid h-100" :src="country.flags.png" :alt="country.flags.alt">
            </div>
            <div class="col-6 d-flex justify-content-between flex-column">
              <div>
                <h3 class="text-start">
                  <b>{{ country.name.common }}</b>
                </h3>
                <h5 class="text-start">
                  <b>Currency:</b> {{ getCurrency(country).code }} ({{ getCurrency(country).name }})
                </h5>
                <h5 class="text-start">
                  <b>Current date and time:</b> {{ country.timezones[0] }}
                </h5>
              </div>
              <div class="d-flex justify-content-between">
                <button class="btn btn-primary countryBtn" v-on:click="showMap(country)">Show Map</button>

                <button class="btn btn-primary countryBtn" v-on:click="goToDetails(country.cca3)">Details</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-12">

      </div>
    </div>
  </div>
</template>



<script setup>

/* eslint-disable */
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { computed } from 'vue';
const router = useRouter();
const countries = ref([]);
const originalCountryList = ref([]);
const imageUrl = ref('');
const searchedCountry = ref('');
let countryList = ref(true);
let id = '';





const fetchCountries = async () => {
  fetch('https://restcountries.com/v3.1/all')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network error');
      }
    })
    .then(data => {
      data.sort((a, b) => {
        const nameA = a.name.common.toLowerCase();
        const nameB = b.name.common.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      originalCountryList.value = data;
      countries.value = data;
      id = data.cca3
    })
    .catch(error => {
      console.error('Error fetching countries:', error);
    });
};

function showMap(country) {
  window.open(country.maps.googleMaps, '_blank');
}
function sortFunction(a, b) {
  return a.name.common.localeCompare(b.name.common);
}

async function onEnter(e) {
  const inputValue = e.target.value.toLowerCase();

  // Checking if input is empty
  if (inputValue === '') {
    // Reset to the original list of countries
    countries.value = originalCountryList.value;
  } else {
    // Filtering the countries based on the input value
    const filteredCountries = originalCountryList.value.filter(country =>
      country.name.common.toLowerCase().startsWith(inputValue)
    );
    // Sorting the filtered countries
    filteredCountries.sort(sortFunction);
    // Update the countries value with the filtered list
    countries.value = filteredCountries;
  }
}

function goToDetails(countryId) {
  console.log(router, 'YUeas');
  if (router) {
    router.push({ name: 'country', params: { country: countryId } })
  } else {
    console.error("Router is not available.");
  }
}


const searchCountry = computed(() => {
  const query = searchedCountry.value.trim().toLowerCase();
  if (!query) {
    return countries.value;
  } else {
    // Filter the array based on the condition
    const filteredCountries = countries.value.filter(country =>
      country.name.toLowerCase().includes(query)
    );

    // Log the lowercase names to the console
    filteredCountries.forEach(country => {
      console.log(country.name.toLowerCase());
    });

    // Return the filtered array
    return filteredCountries;
  }
});
const getCurrentDateTime = (country) => {
  const timezone = country.timezones[0]; // Assuming the first timezone is the primary one
  const date = new Date().toLocaleString('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
    hour12: false
  });
  return date;
};

const getCurrency = (country) => {
  // Check if the `currencies` property exists and is not empty
  if (country.currencies && Object.keys(country.currencies).length > 0) {
    const currencyCode = Object.keys(country.currencies)[0];
    const currencyName = country.currencies[currencyCode].name;
    return { code: currencyCode, name: currencyName };
  } else {
    return { code: "-", name: "Unknown" }; // Or any default value you prefer
  }
};

console.log(countries, 'countries');
onMounted(fetchCountries);

</script>







<style>
.flag {
  max-width: 200px;
  height: auto;
}

.searchbar {
  width: 45% !important;
  border: 1px solid lightgrey;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 0;
}

.searchbar:focus-visible {
  outline: none;
}

.searchIcon {
  border: 1px solid lightgrey;
  border-left: 0;

}

.country-card {
  /* box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px; */
  box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
  border-radius: 6px;
}
.countryBtn{
  background-color: white;
  color: blue;
  border: none;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}
</style>