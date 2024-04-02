<template>
    <a :href="'/' + countryDetail.cca3">
        <img style="max-width: 200px; max-height: 300px; min-height: 150px;" :src="countryDetail?.flags?.png" alt="">
    </a>
</template>
<script setup>
import { defineProps } from 'vue';
import {  onMounted, ref } from 'vue';
const countryId = defineProps(['name'])
const countryDetail = ref({});
const fetchCountryDetail = async () => {
    console.log()
    fetch(`https://restcountries.com/v3.1/alpha/${countryId.name}`)
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
            console.log(countryDetail)
        })
        .catch(error => {
            console.error('Error fetching country details:', error);
        });
}
onMounted(fetchCountryDetail);

</script>
<style></style>