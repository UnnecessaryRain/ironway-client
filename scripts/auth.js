Auth = {
	Initialise() {
    Auth.username = "JohnSmith";
    Auth.token = "1A2B3C4D";
  },
  
  // GetMetadata gets client specific data for message to server
  GetMetadata() {
    var metadata = {};
    metadata.username = Auth.username;
    metadata.token = Auth.token;
    metadata.timestamp = (new Date()).getTime();

    return metadata;
  },
};