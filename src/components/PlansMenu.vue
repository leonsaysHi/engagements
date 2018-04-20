<template>
  <div class="plans-menu" v-bind:class="{ '-enabled': enableSlide }">
    <div>

      <div class="tabs" ref="slides">
        <ul>
          <li 
            :class="{ 'is-active': item.id === filters.selectedEngagementPlan }"
            v-for="item in items" 
            :key="item.id"
          ><a v-on:click="selectItem(item.id)">
            <div><strong>{{ item.name }}</strong></div>
            <div><small>{{ getDateToString(item.startDate, item.endDate) }}</small></div>
          </a></li>
        </ul>
      </div>
      
    </div>
    <menu class="sliders">
      <a v-on:click="slide(1)">&lt;</a>
      <a v-on:click="slide(-1)">&gt;</a>
    </menu>
  </div>
</template>

<script>
import $ from "jquery";
import Slick from "vue-slick";

export default {
  components: {
    Slick
  },
  props: ["filters", "items"],
  data() {
    return {
      enableSlide: false,
      slideVal: 0,
      minSlideVal: 0
    };
  },
  methods: {
    isNeeded() {
      let $e = $(this.$refs["slides"]),
        w = $e.width(),
        pw = $e.parent().width();
      this.enableSlide = w > pw;
    },
    slide(way) {
      const $e = $(this.$refs["slides"]);
      let w = $e.width(),
        pw = $e.parent().width();

      this.minSlideVal = -w + pw;
      this.slideVal = Math.max(
        Math.min(0, this.slideVal + pw * 0.25 * way),
        this.minSlideVal
      );
      $e.css({ transform: `translateX(${this.slideVal}px)` });
    },
    selectItem(id) {
      this.filters.selectedEngagementPlan = id;
    },
    getDateToString(from, to) {
      if (from.isSame(to, "day")) {
        // same day
        return from.format("D MMM YYYY");
      }
      if (from.isSame(to, "month")) {
        // same month
        return `${from.format("D")} - ${to.format("D MMM YYYY")}`;
      }
      if (from.isSame(to, "year")) {
        // same year
        return `${from.format("MMM")} - ${to.format("MMM YYYY")}`;
      }
      return `${from.format("MMM YYYY")} - ${to.format("MMM YYYY")}`;
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.isNeeded);
      this.isNeeded();
    });
  }
};
</script>
