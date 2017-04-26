// ==UserScript==
// @name Trakt.tv localization
// @namespace https://github.com/Quicksi/trakt_tv_localization
// @version 0.3
// @description Translates stuff on trakt.tv to other languages
// @match https://trakt.tv/movies/*
// @copyright 2017+, Quicks
// @require http://code.jquery.com/jquery-latest.js
// @run-at document-end
// ==/UserScript==

// CONFIG
var tmdb_api_key = '';
var language = 'de';

// VARIABLES
var isActive = true;
var qsself = Array([]);
var lastTitle = '';
var lastTitle2 = '';
var sem = true;

// AJAX FUNXTIONS
function getTMDBDataById(tmdb_id){
    var promise = $.ajax ({
        type:       'GET',
        url:        'https://api.themoviedb.org/3/movie/' + tmdb_id + '?api_key=' + tmdb_api_key + '&language=' + language,
        dataType:   'JSON'
    });
    return promise;
}
function getTMDBDataByNameYear(title, year){
    var promise = $.ajax ({
        type:       'GET',
        url:        'https://api.themoviedb.org/3/search/movie?api_key=' + tmdb_api_key + '&include_adult=true&language=' + language + '&query=' + title + '&year= ' + year,
        dataType:   'JSON'
    });
    return promise;
}

// OBSERVERS


// TRANSLATOR
function transMovieOverview() {
    // Get all movies
    tl_movies = $('.grid-item');

    // check last title
    if ( ( $(tl_movies[0]).find('.titles').children('h3')[0].childNodes[0].data != lastTitle ) &&
        ( $(tl_movies[0]).find('.titles').find('h5').length === 0) )
    { // last Title changed
        // set new lastTitle
        lastTitle = $(tl_movies[0]).find('.titles').children('h3')[0].childNodes[0].data;

        // Translate now!
        //console.log('translate of all');

        sem = false;
        tl_movies.each(function(index) {
            qsself[index] = this;
            // get Titles DIV
            titlesDiv = $(this).find('.titles')[0];
            // Get tile and year for the movie
            title_org = $(titlesDiv).children('h3')[0].childNodes[0].data;
            title_org = title_org.substr(0, title_org.length-1);
            year_org = $(titlesDiv).children('h3')[0].childNodes[1].innerHTML;

            // Get German Data
            getTMDBDataByNameYear(title_org, year_org).done( function(promise) {
                // check if title was found
                if( promise.results.length > 0 ) {
                    // Add h5 for org title
                    divOrgTitle = document.createElement("h5");
                    title_org = $(qsself[index]).find('.titles').children('h3')[0].firstChild.data;
                    divOrgTitle.innerHTML = '(' + title_org.substr(0, title_org.length-1) + ')';
                    $(qsself[index]).find('.titles')[0].append(divOrgTitle);

                    // Translate title
                    $(qsself[index]).find('.titles').children('h3')[0].firstChild.data = promise.results[0].title + ' ';
                    if (index === 0) lastTitle =  $(qsself[index]).find('.titles').children('h3')[0].firstChild.data;

                    // Add TMDB Rating
                    rating_org = $(qsself[index]).find('.percentage')[0].innerHTML;
                    $(qsself[index]).find('.percentage')[0].innerHTML = rating_org + ' / ' + promise.results[0].vote_average;
                }
                else {
                    console.log('Localization not found for "' + $(qsself[index]).children('h3')[0].firstChild.data + '"');
                    $(qsself[index]).find('.titles').children('h3')[0].firstChild.data += '(en)';
                }
            });
        });
        sem = true;
    }
}

function transSingleMovie() {
    elemID=document.getElementsByClassName("mobile-title");
    // check last title
    if ( elemID[0].firstChild.firstChild.data != lastTitle )
    { // last Title changed
        // set new lastTitle
        lastTitle = elemID[0].firstChild.firstChild.data;

        // Translate now!
        //console.log('translate of one');

        sem = false;
        // find TMDB ID
        var tmdbLink = $('a[href^="https://www.themoviedb.org/movie/"]');
        var tmdb_id = tmdbLink[0].href.substring(33);

        // create new element for original title
        var newElement=document.createElement("span");

        // Get German title from TMDB
        getTMDBDataById(tmdb_id).done( function(promise) {
            //console.log(promise);
            // set newElement to Original title
            newElement.innerHTML = 'Original title: ' + elemID[0].firstChild.firstChild.data;

            // Set localized title
            elemID[0].firstChild.firstChild.data = promise.title + ' ';
            lastTitle = elemID[0].firstChild.firstChild.data;

            // Add localized Plot
            plotDiv = $('div[itemprop="description"]');
            plot = $(plotDiv).html();
            plot += '<br /><br />Localized:<br />' + promise.overview;
            $(plotDiv).html(plot);

            // Add TMDB Rating
            var newLi=document.createElement("li");
            newLi.innerHTML = '<div class="number"><div class="rating">' + promise.vote_average + '/' + promise.vote_count + '</div><div class="votes">TMDB</div></div>';
            $(".ratings")[0].append(newLi);
        });

        // Add element to DOM
        $(elemID).append(newElement);
        sem = true;
    }
}

function translateMe() {
    if ( tmdb_api_key === '' && isActive === true) {
        isActive = false;
        alert("Please define your TMDB Api Key and reload page");
    } else {
        // Try to find a "mobile-title"-class ... if found,we are on single movie page
        elemID=document.getElementsByClassName("mobile-title");
        if ( elemID.length === 0 ) {
            // here we are on movies overview
            transMovieOverview();
        } else {
            // here we are on single movie page
            transSingleMovie();
        }
    }
}

// READY FUNKTION
$(document).ready(function() {
    translateMe();
});

// OBSERVER
var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();

// Observe a specific DOM element:
observeDOM( document.querySelector("html") ,function(){
    if ( sem === true ) translateMe();
});
