public with sharing class BoatDataService {
  @AuraEnabled
  public static List<BoatReview__c> getAllReviews(Id boatId) {
    return [
      SELECT
        Id,
        Name,
        Comment__c,
        Rating__c,
        LastModifiedDate,
        CreatedDate,
        CreatedBy.Name,
        CreatedBy.SmallPhotoUrl,
        CreatedBy.CompanyName
      FROM BoatReview__c
      WHERE Boat__c = :boatId
      WITH SECURITY_ENFORCED
      ORDER BY CreatedDate DESC
    ];
  }

  // Assume this may be an API that return this data, not a SOQL query
  @AuraEnabled(cacheable=true)
  public static String getBoatsByLocation(
    Decimal latitude,
    Decimal longitude,
    String boatTypeId
  ) {
    // Without an explicit boatTypeId, the full list is desired
    String query = 'SELECT Name, Geolocation__Latitude__s, Geolocation__Longitude__s FROM Boat__c ';
    if (String.isNotBlank(boatTypeId)) {
      query += 'WHERE BoatType__c = :boatTypeId ';
    }
    query += ' WITH SECURITY_ENFORCED ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), \'mi\') LIMIT 10';
    return JSON.serialize(Database.query(query));
  }

  @AuraEnabled
  public static String updateBoatList(Object data) {
    List<Boat__c> boatsForUpdate = (List<Boat__c>) JSON.deserialize(
      JSON.serialize(data),
      List<Boat__c>.class
    );

    update boatsForUpdate;
    return 'Success: Boats updated successfully';
  }

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
            Contact__r.Name,
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
            Contact__r.Name,
            Boat_Type__r.Name,
            Boat_Type__r.Id
          FROM Boat__c
        ];
  }

  @AuraEnabled(cacheable=true)
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
        Contact__r.Name,
        Boat_Type__r.Name,
        Boat_Type__r.Id
      FROM Boat__c
    ];
  }

  @AuraEnabled(cacheable=true)
  public static List<Boat_Type__c> getBoatTypes() {
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
