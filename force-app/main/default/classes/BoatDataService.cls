public with sharing class BoatDataService {
  @AuraEnabled(cacheable=true)
  public static List<Boat__c> getBoats(String boatTypeId) {
    return boatTypeId != ''
      ? [
          SELECT
            Id,
            Name,
            Description__c,
            Geolocation__c,
            Length__c,
            Picture__c,
            Price__c,
            Year__c,
            Boat_Type__r.Name,
            Boat_Type__r.Id
          FROM Boat__c
          WHERE Boat__c.Boat_Type__c = :boatTypeId
        ]
      : [
          SELECT
            Id,
            Name,
            Description__c,
            Geolocation__c,
            Length__c,
            Picture__c,
            Price__c,
            Year__c,
            Boat_Type__r.Name,
            Boat_Type__r.Id
          FROM Boat__c
        ];
  }

  public static List<Boat__c> getSimilarBoats() {
    return [
      SELECT
        Id,
        Name,
        Description__c,
        Geolocation__c,
        Length__c,
        Picture__c,
        Price__c,
        Year__c,
        Boat_Type__r.Name,
        Boat_Type__r.Id
      FROM Boat__c
    ];
  }

  public static List<Boat_Type__c> getBoatType() {
    return [
      SELECT Name, Id
      FROM Boat_Type__c
      WITH SECURITY_ENFORCED
      ORDER BY Name
    ];
  }

  @AuraEnabled(cacheable=false)
  public static List<Boat__c> updateBoat(String jsonData, String typeId) {
    // Parse the JSON data
    Map<String, Object> boatData = (Map<String, Object>) JSON.deserializeUntyped(
      jsonData
    );

    // Extract field values
    String boatId = (String) boatData.get('Id');
    String name = (String) boatData.get('Name');
    String description = (String) boatData.get('Description__c');
    Decimal length = (Decimal) boatData.get('Length__c');
    String pictureUrl = (String) boatData.get('Picture__c');
    Decimal price = (Decimal) boatData.get('Price__c');
    Integer year = (Integer) boatData.get('Year__c');
    String boatTypeId = (String) boatData.get('Boat_Type__c');

    // Construct Boat record
    Boat__c boatToUpdate = new Boat__c(
      Id = boatId,
      Name = name,
      Description__c = description,
      Length__c = length,
      Picture__c = pictureUrl,
      Price__c = price,
      Year__c = year,
      Boat_Type__c = boatTypeId
    );

    // Update the record
    try {
      update boatToUpdate;
    } catch (DmlException e) {
      // Handle DML exception
      System.debug('An error occurred: ' + e.getMessage());
    }

    return getBoats(typeId);
  }
}
