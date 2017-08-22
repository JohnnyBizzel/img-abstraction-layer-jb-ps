### Image Search Abstraction Layer

For this [*FreeCodeCamp*](http://freecodecamp.org) challenge I paired with Parminder Sanghera ([ajitsy](https://www.freecodecamp.org/ajitsy))
We decided to use the flickr API as I have previously used this for the Weather App

The format is slightly different from other APIs.

The API is called by using
[{hosted-url}/api](https://img-abstraction-layer-jb-ps.herokuapp.com/api/)

then adding a **search term**

eg) `/api/cats`

To show another **page** of results use query strings

eg) `/api/cats?page=2`

To limit the results use **pagelimit** in the query string

eg) `/api/cats?page=2&pagelimit=5`

For the last 10 searches made:

`/recent`
