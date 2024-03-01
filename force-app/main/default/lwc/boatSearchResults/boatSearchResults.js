import getBoats from '@salesforce/apex/BoatController.getBoats';
import DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';
import LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import { LightningElement, api, track, wire } from 'lwc';


const COLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Length', fieldName: LENGTH_FIELD.fieldApiName, type: 'number' },
    { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency' },
    { label: 'Description', fieldName: DESCRIPTION_FIELD.fieldApiName, type: 'text' }

];

export default class BoatSearchResults extends LightningElement {
    columns = COLUMNS;
    error;
    listBoat;
    @api boatTypeId;
    @api handleloading;
    @api handledoneloading;
    @track isLoading

    connectedCallback() {
        this.handleloading()
    }


    @wire(getBoats, {boatTypeId: '$boatTypeId'})
    boats({ error, data }) {
        window.setTimeout(
            () => { 
                    if (data) {
                        this.listBoat = data
                    } else if (error) {
                        this.listBoat = [{Price__c: "dsadsa", Name: "Dsadsa"}]
                        this.searchOptions = undefined;
                        this.error = error;
                    }
                        this.handledoneloading()

            }, 
            500
        ); 
        
    }
}