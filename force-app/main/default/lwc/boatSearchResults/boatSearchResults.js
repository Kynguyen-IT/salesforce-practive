import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import updateBoat from "@salesforce/apex/BoatDataService.updateBoat";
import BOATMC from "@salesforce/messageChannel/Boat_Message_Channel__c";
import DESCRIPTION_FIELD from "@salesforce/schema/Boat__c.Description__c";
import LENGTH_FIELD from "@salesforce/schema/Boat__c.Length__c";
import NAME_FIELD from "@salesforce/schema/Boat__c.Name";
import PRICE_FIELD from "@salesforce/schema/Boat__c.Price__c";
import { MessageContext, publish } from "lightning/messageService";
import { LightningElement, api, track, wire } from "lwc";

const COLUMNS = [
  {
    label: "Name",
    fieldName: NAME_FIELD.fieldApiName,
    type: "text",
    editable: true
  },
  {
    label: "Length",
    fieldName: LENGTH_FIELD.fieldApiName,
    type: "number",
    editable: true
  },
  {
    label: "Price",
    fieldName: PRICE_FIELD.fieldApiName,
    type: "currency",
    editable: true
  },
  {
    label: "Description",
    fieldName: DESCRIPTION_FIELD.fieldApiName,
    type: "text",
    editable: true
  }
];

export default class BoatSearchResults extends LightningElement {
  columns = COLUMNS;
  subscription = null;
  error;
  @track listBoat;
  @api boatTypeId;
  @api handleloading;
  @api handledoneloading;
  @track isLoading;
  @track draftValues = [];
  selectedBoatId;

  @wire(MessageContext)
  messageContext;

  async handleSave(event) {
    const recordInputs = event.detail.draftValues.map((draft) => {
      const parts = draft.id.split("-");
      const boatIndex = Number(parts[1]);
      const boats = this.listBoat;
      delete draft.id;

      const length =
        typeof draft?.Length__c === "string"
          ? Number(draft?.Length__c)
          : draft?.Length__c;

      const price =
        typeof draft?.Price__c === "string"
          ? Number(draft?.Price__c)
          : draft?.Price__c;

      return {
        ...boats[boatIndex],
        ...draft,
        ...{ Length__c: length, Price__c: price }
      };
    });

    const promises = recordInputs.map((recordInput) =>
      updateBoat({
        jsonData: JSON.stringify(recordInput),
        typeId: this.boatTypeId
      })
    );

    await Promise.all(promises)
      .then((data) => {
        this.draftValues = [];
        this.listBoat = data[0];
      })
      .catch((error) => {
        console.error(error);
      });
  }

  @wire(getBoats, { boatTypeId: "$boatTypeId" })
  boats({ error, data }) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    window.setTimeout(() => {
      if (data) {
        this.listBoat = data;
      } else if (error) {
        this.listBoat = [];
        this.searchOptions = undefined;
        this.error = error;
      }
      this.handledoneloading();
    }, 500);
  }

  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }

  sendMessageService(boatId) {
    publish(this.messageContext, BOATMC, { recordId: boatId });
  }
}
