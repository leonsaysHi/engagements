// Parse whatever source into this structure
// and store last data state
// where engagementPlansList.eventsList is an array of events
// and each event as professionalsList as an array of attendees
//
// {
//
//   professionalsList: [
//     {
//     	id:string (SFDC ID),
//     	firstName:string,
//     	lastName:string,
//     	isKOL:boolean,
//     	region:string,
//     	country:string,
//     	productList:[
//         {
//           thoughtLeadership:string,
//           segmentation:string
//       	},
//         ...
//       ],
//     },
//     ...
//   ],
//
//   engagementPlansList: [
//     {
//     	id:string (SFDC ID),
//      name:string,
//     	startDate:moment,
//     	endDate:moment,
//      isActive:boolean,
//      eventsList: [ event(ref to eventsList item), ...]
//     },
//     ...
//   ],
//
//   eventsList: [
//     {
//     	id:string (SFDC ID),
//     	planId:string (engagementPlansList SFDC ID),
//      name:string,
//     	startDate:moment,
//     	endDate:moment,
//      professionalsList: [ professional(ref to professionalsList item), ...]
//     },
//     ...
//   ],
//
//   professionalsFilters: [
//      {
//        name: string'product_metrics',
//        value: null,
//        options: [
//          {value:string, label:string},
//          ...
//        ],
//      },
//      ...
//   ]
//
// }
//
import moment from "moment";

class DataManager {
  constructor() {
    this.professionalsList = [];
    this.engagementPlansList = [];
    this.eventsList = [];
    this.attendeesList = [];
    // for filtering
    this.regionsList = [];
    this.professionalsFilters = [];
    // utils
    this._dateformat = "MMDDYYYY";
  }

  // import datas from saleforce
  importDatas({
    professionalsList,
    engagementPlansList,
    eventsList,
    attendeesList,
    filtersOptions
  }) {
    try {
      try {
        if (attendeesList) {
          this.attendeesList = attendeesList;
        }
      } catch (err) {
        console.log("DataManager attendeesList error:", err);
      }

      try {
        if (professionalsList) {
          // update professionals list
          this.professionalsList = this.parseProfessionalsList(
            professionalsList
          );
        }
      } catch (err) {
        console.log("DataManager professionalsList error:", err);
      }

      try {
        if (eventsList) {
          // update plans/events
          this.eventsList = this.parseEventsList(eventsList);
          if (engagementPlansList) {
            this.engagementPlansList = this.parseEngagementPlansList(
              engagementPlansList,
              this.eventsList
            );
          }
        }
      } catch (err) {
        console.log("DataManager eventsList error:", err);
      }

      try {
        if (professionalsList) {
          // update region list based on new professionals list
          this.regionsList = this.getRegionsList(professionalsList);
          if (this.eventsList && this.attendeesList) {
            // update events' attending professionals list
            this.updateProfessionalsListForEvents(
              professionalsList,
              this.eventsList,
              this.attendeesList
            );
          }
        }
      } catch (err) {
        console.log("DataManager professionalsList error:", err);
      }

      try {
        if (filtersOptions) {
          this.professionalsFilters = this.parseprofessionalsFilters(
            filtersOptions
          );
        }
      } catch (err) {
        console.log("DataManager filtersOptions error:", err);
      }
    } catch (err) {
      console.log("DataManager error:", err);
    }
  }

  // make available the last state of datas:{
  //   professionalsList,
  //   engagementPlansList,
  //   regionsList
  // }
  get state() {
    return {
      // for datas display
      professionalsList: this.professionalsList,
      engagementPlansList: this.engagementPlansList,
      // for filtering
      regionsList: this.regionsList,
      professionalsFilters: this.professionalsFilters
    };
  }

  // Public methods
  updateAttendee(pro, event) {
    // add/remove professional from an event
    let proIdx = event.professionalsList.findIndex(item => item.id === pro.id);
    // update attendees object
    console.log(pro, event, proIdx);
    if (proIdx > -1) {
      event.professionalsList.splice(proIdx, 1);
    } else {
      event.professionalsList.push(pro);
    }
    return {
      action: proIdx > -1 ? "Removed" : "Added",
      proId: pro.id,
      eventId: event.id
    };
  }

  // Private methods
  parseProfessionalsList(professionalsList) {
    return professionalsList.map(item => {
      const o = {
        id: item.id,
        firstName: item.firstname,
        lastName: item.lastname,
        isKOL: this.valueToBoolean(item.kol),
        region: item.region,
        country: item.country,
        productList: item.productList
      };
      return o;
    });
  }

  parseEventsList(eventsList, attendeesList) {
    return eventsList.map(item => {
      const o = {
        id: item.id,
        planId: item.parentId,
        name: item.name,
        startDate: moment(item.startDate, this._dateformat),
        endDate: moment(item.endDate, this._dateformat),
        color: item.color
      };
      return o;
    });
  }

  parseEngagementPlansList(engagementPlansList, eventsList) {
    return engagementPlansList.map(item => {
      const o = {
        id: item.id,
        name: item.name,
        startDate: moment(item.startDate, this._dateformat),
        endDate: moment(item.endDate, this._dateformat),
        isActive: this.valueToBoolean(item.active)
      };
      // add events refs to plans
      o.eventsList = eventsList.filter(_item => _item.planId === o.id);
      return o;
    });
  }

  getRegionsList(professionalsList) {
    return professionalsList.reduce((accu, item) => {
      const r = item.region,
        c = item.country;
      let regionObj = accu.find(_item => _item.label === r);
      if (!regionObj) {
        regionObj = { label: r, countriesList: [] };
        accu.push(regionObj);
      }
      if (regionObj.countriesList.indexOf(c) === -1) {
        regionObj.countriesList.push(c);
      }
      return accu;
    }, []);
  }

  parseprofessionalsFilters(filtersOptions) {
    return filtersOptions.map(item => {
      item.value = null;
      return item;
    });
  }

  updateProfessionalsListForEvents(
    professionalsList,
    eventsList,
    attendeesList
  ) {
    eventsList.every(item => {
      item.professionalsList = attendeesList.reduce(
        (_professionalsList, _item) => {
          if (item.id === _item.eventId) {
            const pro = professionalsList.find(
              __item => __item.id === _item.participantId
            );
            if (pro) {
              _professionalsList.push(pro);
            }
          }
          return _professionalsList;
        },
        []
      );
      return true;
    });
  }

  valueToBoolean(v) {
    return (
      v && v !== "" && (v === 1 || v === true || v.toLowerCase() === "true")
    );
  }
}
export default DataManager;
