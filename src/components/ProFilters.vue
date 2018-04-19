<template>
  <div class="columns is-mobile">

    <div class="column is-half" v-if="filters.regionsList">
      <div class="field">
        <label class="label" for="select-region">World region</label>
        <div class="control">
          <div class="select">
            <select v-model="selectedRegion" v-bind:disabled="filters.regionsList.length === 0" id="select-region">
              <option value="">Please select</option>
              <option v-for="item in filters.regionsList" :key="item.value" :value="item">{{ item.label }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="column is-half" v-if="filters.regionsList">
      <div class="field">
        <label class="label" for="select-country">Primary country</label>
        <div class="control">
          <div class="select">
            <select v-model="selectedCountry" :disabled="!selectedRegion" id="select-country">
              <option value="">Please select</option>
              <option v-for="item in countriesList" :key="item.value" :value="item">{{ item }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data: function() {
    return {
      selectedRegion: null,
      selectedCountry: null,
      countriesList: null
    };
  },
  computed: {},
  props: ["filters", "sources"],
  watch: {
    selectedRegion: function(item) {
      this.filters.selectedRegion = item !== "" ? item.label : null;
      this.countriesList = item.countriesList || [];
      this.selectedCountry =
        this.countriesList.length === 1 ? this.countriesList[0] : "";
    },
    selectedCountry: function(label) {
      this.filters.selectedCountry = label !== "" ? label : null;
    }
  }
};
</script>
