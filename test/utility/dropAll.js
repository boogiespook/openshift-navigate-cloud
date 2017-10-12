var collectionNames = db.getCollectionNames();
for(var i = 0, len = collectionNames.length; i < len ; i++){
    var collectionName = collectionNames[i];
    if(collectionName.indexOf('system') > -1 || collectionName.indexOf('user') > -1){
      print( 'skipping collection: ' + collectionName );
    }
    else {
      print( 'dropping collection: ' + collectionName );
      db[collectionName].drop();
    }
}