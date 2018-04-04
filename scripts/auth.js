Auth = {
	Initialise() {
    Auth.token = "1A2B3C4D";
    Auth.username = window.prompt("Choose a USERNAME", "I_Cant_Read");
    Auth.ip = window.prompt("Server IP", "127.0.0.1");
  },
   
  /**
   * GetMetadata gets client specific data for message to server
   * 
   * @public
   * @returns Object of client metadata for server packets
   */
  GetMetadata() {
    var metadata = {};
    metadata.username = Auth.username;
    metadata.token = Auth.token;
    metadata.timestamp = (new Date()).getTime();

    return metadata;
  },
};
