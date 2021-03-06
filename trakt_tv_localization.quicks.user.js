// ==UserScript==
// @name Trakt.tv localization
// @namespace https://github.com/Quicksi/trakt_tv_localization
// @version 0.4
// @description Translates stuff on trakt.tv to other languages
// @match *://*trakt.tv/*
// @copyright 2017+, Quicks
// @require http://code.jquery.com/jquery-latest.js
// @run-at document-end
// ==/UserScript==

// CONFIG
var tmdb_api_key = '';
var language = 'de';
var langtext = 'Deutsch';

// VARIABLES
var isActive = true;
var qsself = Array([]);
var lastTitle = '';
var lastTitle2 = '';
var sem = true;

// AJAX FUNXTIONS
function getTMDBDataById(type, tmdb_id){
    url = '';
    if ( type == 'movies' ) url = 'https://api.themoviedb.org/3/movie/' + tmdb_id + '?api_key=' + tmdb_api_key + '&language=' + language;
    if ( type == 'tv' ) url = 'https://api.themoviedb.org/3/tv/' + tmdb_id + '?api_key=' + tmdb_api_key + '&language=' + language;

    var promise = $.ajax ({
        type:       'GET',
        url:        url,
        dataType:   'JSON'
    });
    return promise;
}
function getTMDBDataByNameYear(type, title, year){
    url = '';
    if ( type == 'movies' ) url = 'https://api.themoviedb.org/3/search/movie?api_key=' + tmdb_api_key + '&include_adult=true&language=' + language + '&query=' + title + '&year= ' + year;
    if ( type == 'tv' ) url = 'https://api.themoviedb.org/3/search/tv?api_key=' + tmdb_api_key + '&include_adult=true&language=' + language + '&query=' + title + '&first_air_date_year= ' + year;

    var promise = $.ajax ({
        type:       'GET',
        url:        url,
        dataType:   'JSON'
    });
    return promise;
}

// TRANSLATOR

function transOverview(type) {
    // Get all movies
    tl_movies = $('.grid-item');

    // check last title
    if ( ( $(tl_movies[0]).find('.titles').children('h3')[0].childNodes[0].data != lastTitle ) &&
        ( $(tl_movies[0]).find('.titles').find('h5').length === 0) )
    { // last Title changed
        // set new lastTitle
        lastTitle = $(tl_movies[0]).find('.titles').children('h3')[0].childNodes[0].data;

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
            getTMDBDataByNameYear(type, title_org, year_org).done( function(promise) {
                console.log(promise);
                // check if title was found
                if( promise.results.length > 0 ) {
                    // get data with different keys
                    if ( type == 'movies' ) {
                        title_local = promise.results[0].title;
                    }
                    if ( type == 'tv' ) {
                         title_local = promise.results[0].name;
                    }

                    // Add h5 for org title
                    divOrgTitle = document.createElement("h5");
                    title_org = $(qsself[index]).find('.titles').children('h3')[0].firstChild.data;
                    divOrgTitle.innerHTML = '(' + title_org.substr(0, title_org.length-1) + ')';
                    $(qsself[index]).find('.titles')[0].append(divOrgTitle);

                    // Translate title
                    $(qsself[index]).find('.titles').children('h3')[0].firstChild.data = title_local + ' ';
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

function transSingle(type) {
    elemID = $('.mobile-title');
    // check last title
    if ( elemID[0].firstChild.firstChild.data != lastTitle )
    { // last Title changed
        // set new lastTitle
        lastTitle = elemID[0].firstChild.firstChild.data;

        // get Data from DOM for later use
        tl_title_org = $(elemID)[0].firstChild.firstChild.data;
        tl_year = $(elemID).find('.year').html();

        sem = false;
        // find TMDB ID
        var tmdbLink = '';
        var tmdb_id =  '';
        if ( type == 'movies' ) {
            tmdbLink = $('a[href^="https://www.themoviedb.org/movie/"]');
            tmdb_id = tmdbLink[0].href.substring(33);
        }
        if ( type == 'tv' ) {
            tmdbLink = $('a[href^="https://www.themoviedb.org/tv/"]');
            tmdb_id = tmdbLink[0].href.substring(30);
        }

        // create new element for original title
        var newElement=document.createElement("span");

        // Get German title from TMDB
        getTMDBDataById(type, tmdb_id).done( function(promise) {
            console.log(promise);
            // get data with different keys
            if ( type == 'movies' ) {
                title_local = promise.title;
            }
            if ( type == 'tv' ) {
                title_local = promise.name;
            }

            // set newElement to Original title
            newElement.innerHTML = 'Original title: ' + tl_title_org;

            // Set localized title
            elemID[0].firstChild.firstChild.data = title_local + ' ';
            lastTitle = elemID[0].firstChild.firstChild.data;

            // Get localized Tagline
            tl_tagline = '';
            if ( type == 'movies' ) {
                if ( promise.tagline.length > 0 ) tl_tagline = '"' + promise.tagline + '"<br /><br />';
            }
            // Add localized Tagline + Plot
            plotDiv = $('div[itemprop="description"]');
            plot = $(plotDiv).html();
            plot += '<br /><br />' + langtext + ':<br />' + tl_tagline + promise.overview;
            $(plotDiv).html(plot);

            // Add TMDB Rating
            var newLi=document.createElement("li");
            newLi.innerHTML = '<div class="number"><div class="rating">' + promise.vote_average + '/' + promise.vote_count + '</div><div class="votes">TMDB</div></div>';
            $(".ratings")[0].append(newLi);

            // Add Youtube German Trailer Link
            if ( type == 'movies' ) {
                var newA=document.createElement("a");
                $(newA).addClass('popup-video one-liner trailer');
                $(newA).attr('target', '_blank');
                $(newA).html('<div class="icon"><div class="fa fa-youtube-play"></div></div><div class="text"><div class="site">' + langtext + '</div></div>');
                // buils query
                yt_url = 'https://www.youtube.com/results?search_query=+';
                yt_query = promise.title + ' ' + tl_year + ' Trailer ' + langtext;
                yt_query = yt_query.replace(/ /g, '+');
                // fill Query
                $(newA).attr('href', yt_url + yt_query);
                // append element to external-div
                //$('.external')[0].firstChild.append(newA);
                $('.affiliate-links')[0].firstChild.append(newA);
            }

            // replace poster
            if ( promise.poster_path.startsWith('/') ) {
                $('.sidebar').find('.poster').find('.real').attr('src', 'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + promise.poster_path);
            }
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
        // get module
        tl_path = $(location)[0].pathname;
        if ( tl_path.startsWith('/movies') ) { // Movies
            // Try to find a "mobile-title"-class ... if found,we are on single movie page
            elemID=document.getElementsByClassName("mobile-title");
            if ( elemID.length === 0 ) {
                // here we are on movies overview
                transOverview('movies');
            } else {
                // here we are on single movie page
                transSingle('movies');
            }
        }
        if ( tl_path.startsWith('/shows') ) { // Movies
            // Try to find a "mobile-title"-class ... if found,we are on single movie page
            elemID=document.getElementsByClassName("mobile-title");
            if ( elemID.length === 0 ) {
                // here we are on movies overview
                transOverview('tv');
            } else {
                // here we are on single movie page
                transSingle('tv');
            }
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
