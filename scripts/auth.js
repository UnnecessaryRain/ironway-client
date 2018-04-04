Auth = {
	Initialise() {
    var names = ["JohnSmith", "BadMan", "PullRudder", "JimmyKikket", "BigBoss", "BabyDoll55"]
    Auth.username = names[Math.floor(Math.random() * names.length)];
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
