# trakt_tv_localization

www.trakt.tv is a realy great site to search and track movies and tv shows.
But it's english only!
It's hard to identify movies / tv shows, if original and localized title differs.

This small script crawls the active trakt.tv site and tries to change titles to your prefered language.
The additional data is loaded from TMDB (https://www.themoviedb.org/).

Requirements:
- requires Greasemonkey (Firefox) (https://github.com/greasemonkey/greasemonkey)
  or Tampermonkey (Chrome) (https://github.com/Tampermonkey/tampermonkey)
  Both can easily be install through the plugin search engine of your browser.
- You need your own TMDB-Api key.
  Further information: https://www.themoviedb.org/faq/api

Features:
- On movies/tv shows overview:
  - Translates movie titles to choosen language
  - original title is displayed in brackets below
  - added TMDB Rating after Trakt Rating
- On movie's/tv show's detail page:
  - Translates movie titles to choosen language
  - original title is displayed below localized title
  - localized plot is displayed below original plot
  - poster is localized
  - Trailers: Link to search on youtube for trailers in your language added in video section (below plot)
  - TMDB Rating added

Configuration:
- At the top of the scriptfile there are two variables to configure your prefered language and enter your TMDB-Api-Key.
  - tmdb_api_key: Your TMDB-Api-Key (get it for free here: https://www.themoviedb.org/faq/api)
  - language: language code to be used on TMDB
  - langtext: used in search query for localized Youtube Trailer

Known Issues:
- TMDB allows 40 request every 10 seconds.
  Trakt's movies overview contains 38 movies.
  So be a bit patient and stay on each page at least 10 seconds ;).
  Multiple fetches in one request seems not to be possible.
  Ideas are welcome
- Remember: Only the displayed titles are translated. It's not possible to search Trakt DB in other languages then English
