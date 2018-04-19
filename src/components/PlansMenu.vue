<template>
  <div class="plans-menu slds-m-bottom_large" v-bind:class="{ '-enabled': enableSlide }">
    <div>
      <menu class="items" ref="slides">
        <a
          v-for="item in items"
          :key="item.id"
          v-on:click="selectItem(item.id)"
          :class="{ active: item.id === filters.selectedEngagementPlan }">
          <div class="slds-text-heading_medium slds-m-bottom_xx-small"><strong v-html="item.name"></strong></div>
          <div class="slds-text-body_small slds-text-color_weak" v-html="getDateToString(item.startDate, item.endDate)"></div>
        </a>
      </menu>
    </div>
    <menu class="sliders">
      <a v-on:click="slide(1)"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronleft"></use></svg></a>
      <a v-on:click="slide(-1)"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use></svg></a>
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
