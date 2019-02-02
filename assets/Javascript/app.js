$(document).ready(function(){
//Create global Variables.
    var books;
    var books2;
    var arrayOfBooks = [];

  // Initialize Firebase 
  //-----------------------------------------------------------
                       //FUMNAYA
//   var config = {
//     apiKey: "AIzaSyDJCqVSe9rGo5qcGIY3vS8ab89S-FqiJZE",
//     authDomain: "project1-2d817.firebaseapp.com",
//     databaseURL: "https://project1-2d817.firebaseio.com",
//     projectId: "project1-2d817",
//     storageBucket: "project1-2d817.appspot.com",
//     messagingSenderId: "678814562093"
//   };
//   firebase.initializeApp(config);

    //---------------------------------------------------------
                        // ENRIC
  var config = {
    apiKey: "AIzaSyA7Tn8cpc_x2hWv9FzcMVXMSsJ9tRwhHX4",
    authDomain: "um-project-1.firebaseapp.com",
    databaseURL: "https://um-project-1.firebaseio.com",
    projectId: "um-project-1",
    storageBucket: "um-project-1.appspot.com",
    messagingSenderId: "807027273391"
  };
  
  firebase.initializeApp(config);
    //---------------------------------------------------------

    var database = firebase.database().ref();


    var fullDataCard = $('.fullInfoResult');
    fullDataCard.hide();

//Capturing the click of the stars rating at the user-review interface  
$('.rating').on('click',function(){
    $('#ratingInput').val($(this).attr('value'));
})

//Function used to concatenate the author name/lastname into one single string with '-' in between.
function concatenate(string){
    var array =  string.split(" ");
    return array.join('-');
}

//Function to capture the click of the author dropdown menu created 
$(document).on('click','.authorDropdown',function(){
$('.reviewerCard').show();
var thisValue = $(this).attr('data-author');
$(".authorSelected").empty();
$(".authorSelected").text('Author Selected: ' + $(this).text());

//Loop to iterate through the array of author names and check if they are the same as the clicked string
for (i=0;i<arrayOfBooks.length;i++){
    if (thisValue != arrayOfBooks[i]){
        hideClass = "."+ arrayOfBooks[i];
        
        $(hideClass).hide();
    }
}
})

//Function created to be able to go back to the full list of user reviews.
$("#return").on("click",function(){
    $('.reviewerCard').show();
})

//Hide card2 (Which is the API results card) until the submit button is pressed.
$(".card2").hide();

//Hide these inputs until their corresponding API functionality is working.

$("#inputTitle").hide();

//Capturing the click of the submit button inside the user-review card.
$("#submitReview").on("click",function(event){

    event.preventDefault();


    var userReview = $("#userReview").val().trim();
    var genreReview = $("#genreReview").val().trim();
    var authorReview = $("#authorReview").val().trim();
    var titleReview = $("#titleReview").val().trim();
    var comments=  $("#comments").val().trim();
    var ratingInput = $("#ratingInput").val().trim();

    var newReview = {
        userReview: userReview,
        genreReview: genreReview,
        authorReview: authorReview,
        titleReview: titleReview,
        comments: comments,
        ratingInput: ratingInput
    }

//Push the obtained input data into Firebase.
    database.push(newReview);

//Clear the input spaces.
    userReview = $("#userReview").val("");
    genreReview = $("#genreReview").val("");
    authorReview = $("#authorReview").val("");
    titleReview = $("#titleReview").val("");
    comments=  $("#comments").val("");
    ratingInput = $("#ratingInput").val("");
})

//Utilize the data obtained from the Firebase database to display it on the page.
database.on("child_added",function(childSnapshot) {

    var fireData = childSnapshot.val();

    var user = $('<p>');
    user.html("<strong>User: </Strong>" + fireData.userReview);

    var genre = $('<p>');
    genre.html("<strong>Genre:</strong> " + fireData.genreReview);

    var author = $('<p>');
    author.html("<strong>Author:</strong> " + fireData.authorReview);

    var title = $('<p>');
    title.html(fireData.titleReview);
    title.addClass('printTitle');

    var comment = $('<p>');
    comment.html("<strong>Review: </strong>" + fireData.comments);

    var rating = $('<p>');
    rating.html("<strong>Rating:</strong> " + fireData.ratingInput + "/5");

    var card = $('<div>');
    card.addClass("reviewerCard");

    //Concenation 
    var author2 = fireData.authorReview
    
    var authorConc = concatenate(author2);
    card.addClass(authorConc);

    
    
    
//Append the corresponding paragraphs in the card that is going to be displayed.
    card.append(title);
    card.append(author);
    card.append(genre);
    card.append('<br>')
    card.append(user);
    card.append(comment);
    card.append(rating);

    //Condition to allow author names to be pushed into the array and appended into the dropdown menu only once.
    if(arrayOfBooks.length == 0 ||arrayOfBooks.indexOf(authorConc)<0){
    arrayOfBooks.push(authorConc);
    $('#previous').append("<div class='dropdown-item authorDropdown' data-author="+ authorConc+ ">" + fireData.authorReview + "</div>");
    }
    
//Prepend each review card to the results container. Prepend used to display first the latest review.
    $('.reviewResults').prepend(card)

})

//Capture the click of each genre inside the genre dropdown menu.
$('.genre').on('click',function(){
    $('#genre').val($(this).text());
    $('.results').empty();
})

//collapseExample is the name of the form where the submit button is located. This is because we used .submit instead of .on('click').
$("#collapseExample").submit(function(event){
    event.preventDefault();
    $(".card2").show();
    var author = $("#author").val();
    var title = $("#title").val();
    var genre = $("#genre").val();
    var date = $("#date").val();

    $("#author").val('');
    $("#title").val('');

    //API Key for the New York Times.
    var APIkey = 'mGD88UG4eNFO78Lsmyk7rr0RcQuAi9Km'
    
    var queryUrl;
    //Dynamic url to be used only with dates and genres.
    if (author == '' && title == ''){
    queryUrl = 'https://api.nytimes.com/svc/books/v3/lists/' + date + '/' + genre + '.json?api-key=' + APIkey;
    }
    
    if (date =='' && genre == '' && title == ''){
        queryUrl = 'https://api.nytimes.com/svc/books/v3/reviews.json?author='+author+'&api-key=' + APIkey;
    }
    console.log(queryUrl);
    //NEW YORK TIMES
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
    .then(function(response){
    console.log(response);

    if (author == '' && title == ''){
        books = response.results.books;
    

        localStorage.setItem('books', JSON.stringify(books));

        var rowElement = $('<div class="row justify-content-between"></div>');
    
    for (i=0;i<books.length;i++){
        var bookTitle = books[i].title;
        var bookAuthor = books[i].author;
        var rank = books[i].rank;
        var isbn = books[i].primary_isbn13;
        //NYT ISBN

        var spaceElement = $('<div class="col-md-1"></div>');

        var cardElement = $('<div class="card cardResults col-xs-12 col-md-4 col-lg-4 ml-2 mb-5 show-all"></div>');
        cardElement.attr('id', 'result' + isbn);
        cardElement.attr('data-isbn', isbn);
        var cardBody = $('<div class="card-body"></div>');

        var titleDiv = $("<div>");
        var authorDiv = $("<div>");
        var rankDiv = $("<div style=color:'green'>");

        titleDiv.attr('class', 'card-title');
        titleDiv.text(bookTitle);
        authorDiv.html("<strong>"+bookAuthor);
        // descriptionDiv.attr('class', 'card-text');
        // descriptionDiv.text("Plot: " + description);
        rankDiv.attr('class', 'nyRank' + isbn);
        rankDiv.text("New York Times Rank: " + rank);
    }

    if (date =='' && genre == '' && title == ''){
        books = response.results;
    

        localStorage.setItem('books', JSON.stringify(books));

        var rowElement = $('<div class="row justify-content-between"></div>');
    
    for (i=0;i<books.length;i++){
        var bookTitle = books[i].book_title;
        var bookAuthor = books[i].book_author;
        var date = books[i].publication_dt;
        var isbn = books[i].isbn13[0];
        //NYT ISBN

        var spaceElement = $('<div class="col-md-1"></div>');

        var cardElement = $('<div class="card cardResults col-xs-12 col-md-4 col-lg-4 ml-2 mb-5 show-all"></div>');
        cardElement.attr('id', 'result' + isbn);
        cardElement.attr('data-isbn', isbn);
        var cardBody = $('<div class="card-body"></div>');

        var titleDiv = $("<div>");
        var authorDiv = $("<div>");
        var ratingDiv = $("<div style=color:'green'>");

        titleDiv.attr('class', 'card-title');
        titleDiv.text(bookTitle);
        authorDiv.html("<strong>"+bookAuthor);
        // descriptionDiv.attr('class', 'card-text');
        // descriptionDiv.text("Plot: " + description);
        ratingDiv.attr('class', 'nyRank' + isbn);
        ratingDiv.text("New York Times Rank: " + date);


    }
}


        //GOODREADS API
        var goodReadsKey = 'wI29TEpdm6l8eoAgXMBtw';
        var goodReadsURL = 'https://cors-anywhere.herokuapp.com/https://www.goodreads.com/book/review_counts.json?key=' + goodReadsKey + '&isbns=' + isbn;


    //     $.ajax({
    //         url: goodReadsURL,
    //         method: "GET"
    //     })
    //         .then(function (response2) {
    //             // console.log(response2);
    //             var bookRating = response2.books[0].average_rating;
    //             var isbn2 = response2.books[0].isbn13;
    //             var getCardElement = $('#result' + isbn2);
    //             getCardElement.attr('data-goodreads', bookRating);
    //             var ratingDiv = $("<div>");
    //             ratingDiv.text("GoodReads Score: " + bookRating);
    //             $('.nyRank' + isbn2).append(ratingDiv);
    //         });


        cardBody.append(titleDiv);
        cardBody.append(authorDiv);
        cardBody.append(rankDiv);
        cardElement.append(cardBody);

        rowElement.append(spaceElement);
        rowElement.append(cardElement);
        rowElement.append(spaceElement);
        
    }
    $(".results").append(rowElement);
    
    })

    
})

    $('div').on('click', '.cardResults', function () {
        var elementSelected = $(this);
        var selectedIsbn = elementSelected.attr('data-isbn');
        var goodReadRank = elementSelected.attr('data-goodreads');

        var retrievedBooks = JSON.parse(localStorage.getItem('books'));

        retrievedBooks.forEach(function (currentBook) {
            if (currentBook.primary_isbn13 === selectedIsbn) {


                $('#oneCardTitle').text(currentBook.title);
                $('#oneCardGoodReadsRank').text('GoodReads Score: ' + goodReadRank);
                $('#oneCardNyTimesRank').text('New York Times Rank: ' + currentBook.rank);
                $('#oneCardDescription').text('Plot: ' + currentBook.description);


                fullDataCard.show();


                $('.results').hide();
            }
        });
    });

    $('#showAllResults').on('click', function () {
        fullDataCard.hide();
        $('.results').show();
    });

})