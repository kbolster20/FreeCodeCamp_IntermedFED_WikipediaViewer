// This function will get the text the user entered, build the call to the api
// and then make call the call and send results to be parsed and displayed
function searchWiki() {

    // get the text the user entered as search criteria
    var searchCriteria = document.getElementById("searchText").value;

    //build the text into the apiURL
    var urlApi = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + searchCriteria + "&limit=15&profile=fuzzy&callback=?";

    // Make the call to the wiki API to get the search results
    $.getJSON(urlApi)
        .done(parseResults)
        .fail(handleErr);

} // end function searchWiki


// Alert the user in case there is an error getting a response from the API
function handleErr() {
    alert("Issues have been encountered. We apologize for the delay in obtaining your search results. Try again later");
} // end function handleErr

//This function recieves the JSON object, parses it out and determines what to do with it.
function parseResults(results) {

    var strResponse = JSON.stringify(results);
    var objResults = JSON.parse(strResponse);

    // I was going to use Moustache for this but there is too much I need
    // to do to the data before I sent it to the screen to go that route...
    // so instead I'll read the properly edited data I need into a js object
    // and display it from there.
    //console.log(strResponse);
    console.log(objResults);

    // the response returned is an array. The 1st element in the array is
    // the search critera so if "dogs" was searched objResults[0] = dogs.
    // The second element is an array of the titles objResults[1] = arTitles
    // The third element is an array of the teasers objResults[2] = arTeasers
    // The fourth element is an array of the links objResults[3] = arLinks
    // There should always be an equal number in each array bc each result
    // needs to have these 3 elements as a part of it.
    var arTitles = objResults[1];
    var arTeasers = objResults[2];
    var arLinks = objResults[3];

    for (var i = 0; i <= arTitles.length - 1; i++) {
        //console.log("title: " + arTitles[i] + "teaser: " + arTeasers[i] + "links: " + arLinks[i] + "\n");

        // This is the form that each search result will take
        var html = "<a href=\"" + arLinks[i] + "\"target=\"_blank\"><div class=\"card text-left mx-5 my-3\">" +
            "<div class=\"card-block\">" +
            "<h4 class=\"card-title\" id=\"rsltTitle\">" + arTitles[i] + "</h4>" +
            "<p class=\"card-text\" id=\"rsltTeaser\">" + arTeasers[i] + "</p>" +
            "<a href=\"" + arLinks[i] + "\"target=\"_blank\" class=\"btn btn-primary\">Go To Article</a>" +
            "</div><!-- end card block div -->" +
            "</div><!-- end div for results card --></a>";
        // for each record returned add it the the html to be displayed
        $("#searchResults").append(html);

    } // end for loop
} // end function parseResults

$(document).ready(function() {
    $('#searchText').keypress(function(event) {
        if (event.keyCode == 13 || event.which == 13) {
            searchWiki();
            event.preventDefault();
        }
    });
}); // end $(document).ready