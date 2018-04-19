<template>
  <div class="engagements-table">

    <div class="header-wrapper row">
      <div class="pro cell">
        Professionals
      </div>
      <div class="col-headers row -scroll-h" ref="hscroll">
        <div v-for="ev in sources.eventsList" v-bind:key="ev.id" class="cell">
          {{ ev.name }}
        </div>
      </div>
    </div>

    <div class="body-wrapper row">
      <div class="pro body-fixed">
        <div class="-scroll-v" ref="vscroll">
          <div v-for="pr in sources.professionalsList" v-bind:key="pr.id" class="cell">
            <drag class="dragpro" 
              v-on:dragstart="currentlyDraggedPro = pr.id" 
              v-on:dragend="onDragend"
            >:: {{ pr.firstName }} - {{ pr.lastName }}</drag>
          </div>
        </div>
      </div>
      <div class="body-scrolled" ref="body">
        <div class="body">
          <div v-for="pr in sources.professionalsList" v-bind:key="pr.id" class="row">
            <div v-for="ev in sources.eventsList" v-bind:key="ev.id" class="cell">
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
      currentlyOverSpot: null
    };
  },
  props: ["sources", "onUpdateAttendee"],
  methods: {
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
