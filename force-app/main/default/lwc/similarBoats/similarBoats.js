import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";
import getSimilarBoats from "@salesforce/apex/BoatDataService.getSimilarBoats";

import { LightningElement, wire } from "lwc";

export default class SimilarBoats extends LightningElement {
  // Private
  relatedBoats;
  boatsTypes;
  boatId;
  error;
  selectedBoatTypeId = "";

  get getTitle() {
    return "Similar boats by type";
  }

  get noBoats() {
    return !(this.relatedBoats && this.relatedBoats.length > 0);
  }

  handleSearchOptionChange(event) {
    this.handleloading();
    const value = event.detail.value;
    this.selectedBoatTypeId = value;
    // Create the const searchEvent
    // searchEvent must be the new custom event search
    const searchEvent = new CustomEvent("selectsearch", {
      detail: value,
      bubbles: true
    });
    this.dispatchEvent(searchEvent);
  }

  @wire(getSimilarBoats)
  boats({ error, data }) {
    if (data) {
      this.relatedBoats = data;
    } else if (error) {
      this.relatedBoats = [];
      this.error = error;
    }
  }

  @wire(getBoatTypes)
  boatTypes({ error, data }) {
    if (data) {
      let options = data.map((type) => {
        return { label: type.Name, value: type.Id };
      });
      options.unshift({ label: "All Types", value: "" });
      this.boatsTypes = options;
    } else if (error) {
      this.boatsTypes = undefined;
      this.error = error;
    }
  }
}
