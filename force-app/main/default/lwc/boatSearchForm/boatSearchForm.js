import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";
import { LightningElement, api, wire } from "lwc";

export default class BoatSearchForm extends LightningElement {
  selectedBoatTypeId = "";
  @api handleloading;

  // Private
  error = undefined;

  searchOptions;

  //Wire a custom Apex method
  @wire(getBoatTypes)
  boatTypes({ error, data }) {
    if (data) {
      let options = data.map((type) => {
        return { label: type.Name, value: type.Id };
      });
      options.unshift({ label: "All Types", value: "" });
      this.searchOptions = options;
    } else if (error) {
      this.searchOptions = undefined;
      this.error = error;
    }
  }

  // Fires event that the search option has changed.
  // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
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
}
