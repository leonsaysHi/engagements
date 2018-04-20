<template>
  <div class="engagements-table box">

    <div class="header-wrapper row">
      <div class="pro cell" @click="toggleOrder('rows')">
        <div class="columns is-mobile">
          <div class="column is-four-fifths">Professionals</div>
          <div class="column">
            <span v-if="order.by === 'rows' && order.way > 0">&uarr;</span>
            <span v-if="order.by === 'rows' && order.way < 0">&darr;</span>
          </div>
        </div>
      </div>
      <div class="col-headers row -scroll-h" ref="hscroll">
        <div v-for="ev in cols" v-bind:key="ev.id" class="cell">
          {{ ev.name }}
        </div>
      </div>
    </div>

    <div class="body-wrapper row">
      <div class="pro body-fixed">
        <div class="-scroll-v" ref="vscroll">
          <div v-for="pr in rows" v-bind:key="pr.id" class="cell">
            <drag class="dragpro" 
              v-on:dragstart="currentlyDraggedPro = pr.id" 
              v-on:dragend="onDragend"
            >:: {{ pr.firstName }} - {{ pr.lastName }}</drag>
          </div>
        </div>
      </div>
      <div class="body-scrolled" ref="body">
        <div class="body">
          <div v-for="pr in rows" v-bind:key="pr.id" class="row">
            <div v-for="ev in cols" v-bind:key="ev.id" class="cell">
              <div @click="onUpdateAttendee(pr, ev)">
                <div class="droppro" :class="{'-attend': isAttending(pr, ev), '-disabled': isDisabledSpot(pr), '-isover': isOveredSpot(pr, ev) }">
                  <drop 
                    @drop="handleDrop(pr, ev)" 
                    v-on:dragover="currentlyOverSpot = { pro: pr.id, event: ev.id }" 
                    v-on:dragleave="currentlyOverSpot = null"
                  ></drop>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "EngagementTable",
  data() {
    return {
      currentlyDraggedPro: null,
      currentlyOverSpot: null,
      order: { by: 'rows', way: 0 }
    };
  },
  props: ["sources", "onUpdateAttendee"],
  computed: {
    cols () {
      return this.sources.eventsList
    },
    rows () {
      if (this.order.by === 'rows' && this.order.way !== 0) {
        return this.sources.professionalsList.slice().sort( (a, b) => { 
          if (a.firstName < b.firstName) return this.order.way * -1;
          if (a.firstName > b.firstName) return this.order.way * 1;
          return 0;
        })
      }
      else {
        return this.sources.professionalsList.slice()
      }
    }
  },
  methods: {
    toggleOrder (by) {
      this.order.by = by
      const ways = [0, 1, -1]
      let idx = ways.findIndex( w => w===this.order.way ) + 1
      this.order.way = idx === ways.length ? ways[0] : ways[idx]
    },
    isAttending(pro, event) {
      return event.professionalsList.findIndex(p => p.id === pro.id) > -1;
    },
    onDragend() {
      this.currentlyDraggedPro = null;
      this.currentlyOverSpot = null;
    },
    handleDrop(pro, event) {
      if (pro.id === this.currentlyDraggedPro) {
        this.onUpdateAttendee(pro, event);
      }
    },
    isOveredSpot(pro, event) {
      return (
        !this.isDisabledSpot(pro) &&
        this.currentlyOverSpot !== null &&
        this.currentlyOverSpot.pro === pro.id &&
        this.currentlyOverSpot.event === event.id
      );
    },
    isDisabledSpot(pro) {
      return (
        this.currentlyDraggedPro !== null && this.currentlyDraggedPro !== pro.id
      );
    }
  },
  mounted: function() {
    const $body = $(this.$refs.body),
      $hscroll = $(this.$refs.hscroll),
      $vscroll = $(this.$refs.vscroll);

    $body
      .scroll(function(e) {
        $vscroll.css({ height: $body[0].clientHeight + "px" });
        $hscroll.css({ flex: "0 0 " + $body[0].clientWidth + "px" });
        let h_scroll = $body.scrollLeft();
        let v_scroll = $body.scrollTop();
        $hscroll.scrollLeft(h_scroll);
        $vscroll.scrollTop(v_scroll);
      })
      .trigger("scroll");
  }
};
</script>
