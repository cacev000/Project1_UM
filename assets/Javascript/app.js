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

$('.genre').on('click',function(){
    $('#genre').val($(this).text());
})


$("#collapseExample").submit(function(event){
    event.preventDefault();
    var author = $("#author").val();
    var title = $("#title").val();
    var genre = $("#genre").val();
    var date = $("#date").val();

    var gameInfo = {
        author: author,
        title: title
    }
    database.push(gameInfo);

    $("#author").val('');
    $("#title").val('');


    var APIkey = 'mGD88UG4eNFO78Lsmyk7rr0RcQuAi9Km'
    
    // var queryURL = 'https://api.nytimes.com/svc/books/v3/reviews.json?author='+ author+ '&api-key=' + APIkey;
    var queryURL = 'https://api.nytimes.com/svc/books/v3/lists/'+date+'/'+genre+'.json?api-key=' + APIkey;

    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
    console.log(response);
    })
})


})