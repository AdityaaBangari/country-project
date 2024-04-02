/* eslint-disable */
<template>
  <div class="container main pt-3 pb-4" v-if="countryDetail && countryDetail.name">
    <div class="row">
      <div class="col-12 text-start" >
          <h3><b>{{ countryDetail.name.common }}</b></h3>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-6" v-if="countryDetail.flags">
        <img class="img-fluid h-100" :src="countryDetail.flags.png" :alt="countryDetail.flags.alt">
      </div>
      <div class="col-6 d-flex flex-column text-start" v-if="nativeName">
        <!-- Add additional details here -->
        <h4><b>Native Name:</b> {{ nativeName }}</h4>
        <h4><b>Capital:</b>  {{countryDetail.capital[0]}}</h4>
        <h4><b>Population:</b> {{countryDetail.population}}</h4>
        <h4><b>Region:</b> {{countryDetail.region}}</h4>
        <h4><b>Sub-region:</b> {{countryDetail.subregion}}</h4>
        <h4><b>Area:</b> {{countryDetail.area}}</h4>
        <h4><b>Country Code:</b> {{countryDetail.fifa}}</h4>
        <h4><b>Languages:</b> {{lang}}</h4>
        <h4><b>Currencies:</b> {{currencyArr[0].name}}</h4>
        <h4><b>Timezones:</b> {{countryDetail.timezones[0]}}</h4>
      </div>
    </div>
  </div>

  <div class="container my-5 neighbour-container pt-3" >
    <div class="row">
      <div class="col-12 text-start">
        <h3><b>Neighbour Countries</b></h3>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-4 my-3" v-for="borderCountry in countryDetail.borders" :key="borderCountry">
        <NeighbourFlag :name="borderCountry"></NeighbourFlag>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import NeighbourFlag from './neighbourFlag.vue';
const router = useRouter();
const countryDetail = ref({});
let id  = '';
let nativeName = '';
let lang  = '';
let currencyArr
const countryId = router.currentRoute.value.params.country;

const fetchCountryDetails = async () => {
  fetch(`https://restcountries.com/v3.1/alpha/${countryId}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network error');
      }
    })
    .then(data => {
      // Handle the fetched data here
      countryDetail.value = data[0];
      const nameArr = Object.keys(countryDetail.value.name.nativeName);
      const langArr = Object.values(countryDetail.value.languages);
      currencyArr = Object.values(countryDetail.value.currencies)
      nativeName = countryDetail.value.name.nativeName[nameArr[0]].common;
      if (langArr.length > 0) {
        getLanguages(langArr);
      }
      console.log(langArr, currencyArr)
    })
    .catch(error => {
      console.error('Error fetching country details:', error);
    });
};

function getLanguages(langArr) {
  langArr.forEach(element => {
    lang = langArr.join(', ');
  });
}


onMounted(fetchCountryDetails);
</script>

<style scoped>
/* Your scoped styles go here */
.main {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  border-radius: 6px;
}
.neighbour-container{
  box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
  border-radius: 6px;
}
</style>