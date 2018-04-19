<template>
  <div class="engagements-table">

    <div class="header-wrapper row">
      <div class="pro cell">
        Professionals
      </div>
      <div class="col-headers row -scroll-h" ref="hscroll">
        <div v-for="ev in eventsList" class="cell">
          {{ ev.name }}
        </div>
      </div>
    </div>

    <div class="body-wrapper row">
      <div class="pro body-fixed">
        <div class="-scroll-v" ref="vscroll">
          <div v-for="pr in professionalsList" class="cell">
            <drag class="dragpro" 
              v-on:dragstart="currentlyDraggedPro = pr.id" 
              v-on:dragend="onDragend"
            >:: {{ pr.firstName }} - {{ pr.lastName }}</drag>
          </div>
        </div>
      </div>
      <div class="body-scrolled" ref="body">
        <div class="body">
          <div v-for="pr in professionalsList" class="row">
            <div v-for="ev in eventsList" class="cell">
              <div @click="toggleAttendee(pr, ev)" class="droppro" :class="{'-attend': isAttending(pr, ev), '-disabled': isDisabledSpot(pr), '-isover': isOveredSpot(pr, ev) }">
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
</template>

<script>
export default {
  name: "EngagementTable",
  data() {
    return {
      currentlyDraggedPro: null,
      currentlyOverSpot: null,
      engagementPlan: "a5T1D0000004I3qUAE",
      eventsList: [
        {
          id: "a0p1D00000046C1QAI",
          planId: "a5T1D0000004I3qUAE",
          name: "Event 0",
          startDate: null,
          endDate: null,
          color: "#EDB550",
          professionalsList: [
            {
              id: "0011D000002mkdsQAA",
              firstname: "MARK",
              lastname: "POCHAPIN",
              kol: "1",
              region: "",
              country: "US-United States of America",
              productList: []
            },
            {
              id: "0011D000002mkj6QAA",
              firstname: "LIN",
              lastname: "CHEN",
              kol: "1",
              region: "Africa/Middle East",
              country: "US-United States of America",
              productList: [
                {
                  thoughtLeadership: "National",
                  segmentation: "Prevnar Vaccines - Pediatric"
                },
                {
                  thoughtLeadership: "Local",
                  segmentation: "Prevnar Vaccines - Adult"
                },
                {
                  thoughtLeadership: "National",
                  segmentation: "Infectious Disease - Antibacterial"
                },
                {
                  thoughtLeadership: "Global",
                  segmentation: "Prevnar Vaccines - Adult"
                },
                { thoughtLeadership: "Global", segmentation: "null" },
                { thoughtLeadership: "Global", segmentation: "null" }
              ]
            }
          ]
        },
        {
          id: "a0p1D000000KM0GQAW",
          planId: "a5T1D0000004I3qUAE",
          name: "Event 1",
          startDate: null,
          endDate: null,
          color: "#EDB550",
          professionalsList: [
            {
              id: "0011D000002mkdnQAA",
              firstname: "RAY",
              lastname: "PARKER",
              kol: "1",
              region: "",
              country: "AD-Andorra",
              productList: []
            }
          ]
        },
        {
          id: "a0p1D000000KM0GQAZ",
          planId: "a5T1D0000004I3qUAE",
          name: "Event 2",
          startDate: null,
          endDate: null,
          color: "#EDB550",
          professionalsList: [
            {
              id: "0011D000002mkdnQAA",
              firstname: "RAY",
              lastname: "PARKER",
              kol: "1",
              region: "",
              country: "AD-Andorra",
              productList: []
            }
          ]
        },
        {
          id: "a0p1D000000KM0GQA1",
          planId: "a5T1D0000004I3qUAE",
          name: "Event 3",
          startDate: null,
          endDate: null,
          color: "#EDB550",
          professionalsList: []
        },
        {
          id: "a0p1D000000KM0GQA2",
          planId: "a5T1D0000004I3qUAE",
          name: "Event 4",
          startDate: null,
          endDate: null,
          color: "#EDB550",
          professionalsList: []
        }
      ],
      professionalsList: [
        {
          id: "0011D000002mkdnQAA",
          firstName: "RAY",
          lastName: "PARKER",
          isKOL: false,
          region: "",
          country: "AD-Andorra",
          productList: []
        },
        {
          id: "0011D000002mkdoQAA",
          firstName: "JULIE",
          lastName: "DOYLE",
          isKOL: false,
          region: "",
          country: "US-United States of America",
          productList: [{ thoughtLeadership: "Regional", segmentation: "null" }]
        },
        {
          id: "0011D000002mkdsQAA",
          firstName: "MARK",
          lastName: "POCHAPIN",
          isKOL: false,
          region: "",
          country: "US-United States of America",
          productList: []
        },
        {
          id: "0011D000002mkeZQAQ",
          firstName: "KARISSA",
          lastName: "HULTMARK",
          isKOL: false,
          region: "",
          country: "",
          productList: []
        },
        {
          id: "0011D000002mkfIQAQ",
          firstName: "MICHAEL",
          lastName: "MESSINA",
          isKOL: false,
          region: "",
          country: "",
          productList: []
        },
        {
          id: "0011D000002mkhXQAQ",
          firstName: "EVA",
          lastName: "TSALIKIAN",
          isKOL: false,
          region: "",
          country: "",
          productList: [
            { thoughtLeadership: "Regional", segmentation: "null" },
            { thoughtLeadership: "Local", segmentation: "null" }
          ]
        },
        {
          id: "0011D000002mkhxQAA",
          firstName: "PANKTI",
          lastName: "REID",
          isKOL: false,
          region: "",
          country: "",
          productList: []
        },
        {
          id: "0011D000002mkirQAA",
          firstName: "MARK",
          lastName: "SONTAG",
          isKOL: false,
          region: "",
          country: "",
          productList: []
        },
        {
          id: "0011D000002mkj6QAA",
          firstName: "LIN",
          lastName: "CHEN",
          isKOL: false,
          region: "Africa/Middle East",
          country: "US-United States of America",
          productList: [
            {
              thoughtLeadership: "National",
              segmentation: "Prevnar Vaccines - Pediatric"
            },
            {
              thoughtLeadership: "Local",
              segmentation: "Prevnar Vaccines - Adult"
            },
            {
              thoughtLeadership: "National",
              segmentation: "Infectious Disease - Antibacterial"
            },
            {
              thoughtLeadership: "Global",
              segmentation: "Prevnar Vaccines - Adult"
            },
            { thoughtLeadership: "Global", segmentation: "null" },
            { thoughtLeadership: "Global", segmentation: "null" }
          ]
        },
        {
          id: "0011D000002mkj7QAA",
          firstName: "SAURABH",
          lastName: "KAPUR",
          isKOL: false,
          region: "",
          country: "",
          productList: [{ thoughtLeadership: "Local", segmentation: "null" }]
        }
      ]
    };
  },
  methods: {
    isAttending(pro, event) {
      return event.professionalsList.findIndex(p => p.id === pro.id) > -1;
    },
    toggleAttendee(pro, event) {
      let proIdx = event.professionalsList.findIndex(
        item => item.id === pro.id
      );
      if (proIdx > -1) {
        console.log("Remove", pro.firstName, "from", event.name);
        event.professionalsList.splice(proIdx, 1);
      } else {
        console.log("Add", pro.firstName, "from", event.name);
        event.professionalsList.push(
          this.professionalsList.find(item => item.id === pro.id)
        );
      }
    },
    onDragend() {
      this.currentlyDraggedPro = null;
      this.currentlyOverSpot = null;
    },
    handleDrop(pro, event) {
      if (pro.id === this.currentlyDraggedPro) {
        this.toggleAttendee(pro, event);
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
    const $ = window.$,
      $body = $(this.$refs.body),
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
