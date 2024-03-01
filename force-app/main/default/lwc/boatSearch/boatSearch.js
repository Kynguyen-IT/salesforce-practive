import { LightningElement, track, api } from 'lwc';

export default class BoatSearch extends LightningElement {
  isLoading = false;
  @track boatTypeId = ''

  // Handles loading event
  handleLoading() {
    this.isLoading = true
  }
  
  // Handles done loading event
  handleDoneLoading() {
    this.isLoading = false
  }
  
  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    const {detail} = event
    this.boatTypeId = detail
  }
  
  createNewBoat() { }
}
