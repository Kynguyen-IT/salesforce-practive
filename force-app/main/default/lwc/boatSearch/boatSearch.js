import BOATMC from "@salesforce/messageChannel/Boat_Message_Channel__c";
import { MessageContext, publish } from "lightning/messageService";
import { NavigationMixin } from "lightning/navigation";
import { LightningElement, track, wire } from "lwc";

export default class BoatSearch extends LightningElement {
  isLoading = false;
  @track boatTypeId = "";

  // Handles loading event
  handleLoading() {
    this.isLoading = true;
  }

  // Handles done loading event
  handleDoneLoading() {
    this.isLoading = false;
  }

  // Handles search boat event
  // This custom event comes from the form
  @wire(MessageContext)
  messageContext;
  searchBoats(event) {
    const { detail } = event;
    this.boatTypeId = detail;

    publish(this.messageContext, BOATMC, { recordId: null });
  }

  createNewBoat() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Boat__c",
        actionName: "new"
      }
    });
  }
}
