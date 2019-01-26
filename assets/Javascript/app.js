$(document).ready(function(){



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDJCqVSe9rGo5qcGIY3vS8ab89S-FqiJZE",
    authDomain: "project1-2d817.firebaseapp.com",
    databaseURL: "https://project1-2d817.firebaseio.com",
    projectId: "project1-2d817",
    storageBucket: "project1-2d817.appspot.com",
    messagingSenderId: "678814562093"
  };
  firebase.initializeApp(config);


var database = firebase.database().ref();


$("#collapseExample").submit(function(event){
    event.preventDefault();
    var gameConsole = $("#console").val();
    var category = $("#category").val();
    var gameName = $("#nameOfGame").val();

    var gameInfo = {
        gameConsole: gameConsole,
        category: category,
        gameName: gameName
    }
    database.push(gameInfo);

    $("#console").val('');
    $("#catagory").val('');
    $("#nameOfGame").val('');

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        
    })
})


})