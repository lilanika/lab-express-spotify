require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Our routes go here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


  app.get('/', (req, res, next) => {
    res.render('layout')
})

app.get('/artist-search', (req, res) => { /* req.query, la query que le hago a traves del browser */
  /*console.log(req.query)*/ /* { artist: 'U2' } */
  spotifyApi
      .searchArtists(req.query.artist) /* I get to know it is artist because of line 33 */
      .then(data => {
          /* console.log(data) = { body: { artists { href, items: [Array], limit, next, offset, previous, total } }, headers, statusCode }*/
          /* console.log(data.body) = { artists { href, items: [[Object]], limit, next, offset, previous, total } } */
          /* console.log('The received data from the API: ', data.body.artists.items); */

          /*if (data.body.artists.items[0].images.length !== 0)
              console.log('The received data from the API: ', data.body.artists.items[0].images[0].url); items are the different results for one artist */

          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
          /*const albums =*/
          res.render('artist-search-results', {
              artistResults: data.body.artists.items
          }) /* el data que entra por el then, es el resultado de la promesa, no es un objeto, no es el objeto que creaba yo, por eso lo creo en esta linea  */
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
