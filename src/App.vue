<template>
  <div id="app">

    <!-- Engagement plans menu -->
    <PlansMenu v-if="datasSources.engagementPlansList && datasSources.engagementPlansList.length > 1"
      :filters="filters"
      :items="datasSources.engagementPlansList"
    />

    <section class="section">
      <div class="container">
      
        <!-- Filters -->
        <ProFilters
          :filters="filters"
          :sources="datasSources"
        />

        <EngagementTable 
          :sources="datasSources" 
          :on-update-attendee="onUpdateAttendee"
        />

      </div>
    </section>

  </div>
</template>

<script>
import "./scss/main.scss";
import WindowDatas from "./components/datas.js";
import ProFilters from "./components/ProFilters.vue";
import EngagementTable from "./components/EngagementTable.vue";
import PlansMenu from "./components/PlansMenu.vue";

import DataManager from "./components/data-manager.js";

export default {
  name: "App",
  components: {
    PlansMenu,
    ProFilters,
    EngagementTable
  },
  data() {
    return {
      // filters
      filters: {
        regionsList: null,
        selectedEngagementPlan: null,
        selectedRegion: null,
        selectedCountry: null,
        professionalsFilters: []
      },
      DM: null
    };
  },
  beforeMount() {
    this.DM = new DataManager();
    this.DM.importDatas(WindowDatas);
    this.filters.selectedEngagementPlan = this.DM.engagementPlansList[0].id;
    this.filters.regionsList = this.DM.regionsList;
  },
  computed: {
    datasSources() {
      const selectedPlanId = this.filters.selectedEngagementPlan,
        selectedPlan = selectedPlanId
          ? this.DM.engagementPlansList.find(item => item.id === selectedPlanId)
          : null,
        eventsList = selectedPlan ? selectedPlan.eventsList : [],
        professionalsList = this.DM.professionalsList.filter(item => {
          let matchRegion =
              !this.filters.selectedRegion ||
              this.filters.selectedRegion === item.region,
            matchCountry =
              !this.filters.selectedCountry ||
              this.filters.selectedCountry === item.country;
          return matchRegion && matchCountry;
        });
      return {
        refresh: this.refresh,
        professionalsList,
        engagementPlansList: this.DM.engagementPlansList,
        eventsList,
        // Filters
        professionalsFilters: this.DM.professionalsFilters
      };
    }
  },
  methods: {
    onUpdateAttendee(pro, event) {
      if (!pro || !event) {
        console.warn("onUpdateAttendee, something is missing:", pro, event);
        return;
      }
      // update source:

      const argObj = this.DM.updateAttendee(pro, event);
      console.log("Toggle attendee", argObj);
    },
    onChangeProfesionalsFilter(obj) {
      // $(this.$el).trigger($.Event('filterProfesionalsList'), obj)
    }
  }
};
</script>
