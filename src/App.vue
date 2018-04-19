<template>
  <div id="app">
    <EngagementTable/>
  </div>
</template>

<script>
import "./scss/main.scss";
import EngagementTable from "./components/EngagementTable.vue";

export default {
  name: "App",
  components: {
    EngagementTable
  }
};
</script>
