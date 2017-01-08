### Image Search Abstraction Layer

For this challenge I paired with Parminder Sanghera (ajitsy)
We decided to use the flickr API as I have previously used this for the Weather App

The format is slightly different from other APIs.

The API is called by using
`https://img-abstraction-layer-jb-ps-bizzel.c9users.io/api/`

then adding a **search term**

eg) `https://img-abstraction-layer-jb-ps-bizzel.c9users.io/api/cats`

To show another **page** of results use query strings

eg) `https://img-abstraction-layer-jb-ps-bizzel.c9users.io/api/cats?page=2`

To limit the results use **pagelimit** in the query string

eg) `https://img-abstraction-layer-jb-ps-bizzel.c9users.io/api/cats?page=2&pagelimit=5`

For the last 10 searches made:

`https://img-abstraction-layer-jb-ps-bizzel.c9users.io/api/recent`