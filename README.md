# trakt_tv_localization

www.trakt.tv is a realy great site to search and track movies and tv shows.
But it's english only!
It's hard to identify movies, if original and localized title differs.

This small script crawls the active trakt.tv site and tries to change titles to your prefered language.
The additional data is loaded from TMDB (https://www.themoviedb.org/).

Requirements:
- requires Greasemonkey (Firefox) (https://github.com/greasemonkey/greasemonkey)
  or Tampermonkey (Chrome) (https://github.com/Tampermonkey/tampermonkey)
  Both can easily be install through the plugin search engine of your browser.
- You need your own TMDB-Api key.
  Further information: https://www.themoviedb.org/faq/api

Features:
- Translates movie titles on https://trakt.tv/movies/
- When no translation is found, "(en)" is added to the original title to let you know
- In details page (one movies details), both, the localized and the original title are displayed
- No! Tv Shows are not working yet! Will be added some time - perhaps ;)

Configuration:
- At the top of the scriptfile there are two variables to configure your prefered language and enter your TMDB-Api-Key.
  Should be self-explained.

Known Issues:
- Irrespective of how you call trakt.tv you get redirected to https://trakt.tv/.
  Cause of trakt is totally AJAX driven you have to reload the site manually when not entered it using "https://trakt.tv/".
  Otherwise the script won't be loaded.
- TMDB allows 40 request every 10 seconds.
  Trakt's movies overview contains 38 movies.
  So be a bit patient and stay on each page at least 10 seconds ;).
  Multiple fetches in one request seems not to be possible.
  Ideas are welcome
- Remember: Only the displayed titles are translated. It's not possible to search Trakt DB in other languages then English
