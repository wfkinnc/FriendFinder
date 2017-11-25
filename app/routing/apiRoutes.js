// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on friendd-data
// ===============================================================================

var friendData = require("../data/friends");
//var waitListData = require("../data/waitinglistData");
//var router = require("express").Router();
// ===============================================================================
// ROUTING
// ===============================================================================
function getFriends(req, res){
  res.json(friendData);
}
module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // ---------------------------------------------------------------------------
app.get("/api/friends", getFriends)

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the routerropriate JavaScript array
  // (ex. User fills out a survey request... this data is then sent to the server...
  // Then the server saves the data to the friendData array)
  // ---------------------------------------------------------------------------

  app.post("/api/friends", function(req, res) {
    
    //
    // Note the code here. Our "server" will respond to requests and let the person finding a friend see any matches.
    // it will server up the friend who is the closest match
    // showing the req... 
    //-----------------------------------------------------
    //--------------------------------------------------------
    // 1. compare the responses w/ the values from the database (json doc)
    //--------------------------------------------------------

    var bestFriend = {
      name: "",
      photoURL : "",
      friendDiff : 0
    }

    // gettubg req.body values for the passed json surve data
    var newFriendData   = req.body;
    var newFriendScores = newFriendData.scores;


    // loop thru existing list of friends from the friends.js file
    for (var i = 0; i < friendData.length; i++){
      var currFriend      = friendData[i];
      var currFriendScore = currFriend.scores;
      var totDiff         = 0;     
      // loop  thru the set of scores for each one compared to the scores for the user
      for (var j = 0; j < currFriendScore.length; j++){
        console.log(currFriend.name  + " " + currFriendScore[j] +  "  " +   newFriendScores[j]);
        var holdDiff = Math.abs(parseInt(currFriendScore[j],10) - parseInt(newFriendScores[j],10));
        totDiff = totDiff + holdDiff;

      }// end  loop for j
      console.log( " diff for " + currFriend.name + " is " + totDiff);

      // setting bestFriend  value to the new values
      // if on the 1st loop, then it is set
      // on subsequent loops.if the new value is lower, then update w/ that value..otherwise
      // keep the value
      if (i == 0){
          bestFriend.name=currFriend.name;
          bestFriend.photoURL = currFriend.photoURL;
          bestFriend.friendDiff = totDiff;
      } else { 
        if (totDiff < bestFriend.friendDiff){
          bestFriend.name=currFriend.name;
          bestFriend.photoURL=currFriend.photoURL;
          bestFriend.friendDiff = totDiff;
        };
    };
    } // end loop fo ri

    // adding hte new user info to the array
    friendData.push(newFriendData);

    console.log(bestFriend)

    //sending info back to the calling page to be displayed in the modal
    res.json(bestFriend);
  });

}; // end module exports for app