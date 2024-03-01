public with sharing class BoatTypeController {
    @AuraEnabled(cacheable=true)
    public static List<Boat_Type__c> getBoatType() {
        return [
            SELECT Name, Id
            FROM Boat_Type__c
            WITH SECURITY_ENFORCED
            ORDER BY Name
        ];
    }
}