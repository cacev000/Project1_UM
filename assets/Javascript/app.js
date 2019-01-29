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
    $('.results').empty();
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
    //NEW YORK TIMES
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
    .then(function(response){
    console.log(response);

    var books = response.results.books;
    
    for (i=0;i<books.length;i++){
        var bookTitle   = books[i].title;
        var description = books[i].description;
        var rank = books[i].rank;
        var isbn = books[i].primary_isbn13;
        //NYT ISBN
        
        
        var resultsDiv = $("<div>")
        var titleDiv = $("<div>");
        var descriptionDiv = $("<div>");
        var rankDiv = $("<div style=color:'green'>");

        titleDiv.text("Title: " +bookTitle);
        descriptionDiv.text("Plot: " + description);
        rankDiv.text("New York Times Rank: " + rank);

        //GOODREADS API
        var goodReadsKey = 'wI29TEpdm6l8eoAgXMBtw';
        var goodReadsURL = 'https://cors-anywhere.herokuapp.com/https://www.goodreads.com/book/review_counts.json?key='+goodReadsKey+'&isbns='+isbn; 
        
        
        $.ajax({
            url: goodReadsURL,
            method: "GET"
        })
        .then(function(response2){
        console.log(response2);
        var bookRating = response2.books[0].average_rating;
        var isbn2 = response2.books[0].isbn13;
        var ratingDiv = $("<div>");
        ratingDiv.text("GoodReads Score: "+bookRating);
        var breakPoint = $("<br>");
        $('.result'+isbn2).prepend(ratingDiv)
        $('.result'+isbn2).append(breakPoint);
        })

        $(resultsDiv).append(rankDiv);
        $(resultsDiv).append(titleDiv);
        $(resultsDiv).append(descriptionDiv);
       
        $(resultsDiv).addClass("result"+isbn);
        $(".results").append(resultsDiv);
   
    }
    
    })

    
})


})