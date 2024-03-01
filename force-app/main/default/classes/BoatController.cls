public with sharing class BoatController {
    @AuraEnabled(cacheable=true)
    public static List<	Boat__c> getBoats(String boatTypeId) {
        return boatTypeId != '' ? [
            SELECT Id, Name, Description__c, Geolocation__c, Length__c, Picture__c, Price__c, Year__c, Boat_Type__r.Name, Boat_Type__r.Id
            FROM Boat__c
            WHERE Boat__c.Boat_Type__c = :boatTypeId
        ] : [
            SELECT Id, Name, Description__c, Geolocation__c, Length__c, Picture__c, Price__c, Year__c, Boat_Type__r.Name, Boat_Type__r.Id
            FROM Boat__c
        ];
    }
}