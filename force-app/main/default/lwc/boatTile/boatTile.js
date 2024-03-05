import BOATMC from "@salesforce/messageChannel/Boat_Message_Channel__c";
import { MessageContext, publish } from "lightning/messageService";
import { LightningElement, api, wire } from "lwc";

export default class BoatTile extends LightningElement {
  @api boatData;
  @api selectedBoatId;

  get computeClass() {
    return this.selectedBoatId === this.boatData.Id ? "item selected" : "item";
  }

  @wire(MessageContext)
  messageContext;
  handleOnClickItem() {
    const Id = this.boatData.Id;
    const payload = {
      recordId: !this.selectedBoatId || this.selectedBoatId !== Id ? Id : null
    };
    publish(this.messageContext, BOATMC, payload);
  }
}
