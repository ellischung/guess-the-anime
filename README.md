<h1 align='center'>
	Guess The Anime
</h1>

<p align='center'>
  Play with a friend to see who's more well-versed in anime openings/endings/OSTs! 
</p>

### About the project

This app was created using React.js for the front-end and Express.js for the back-end. Other dependencies that are crucial to this project are Socket.IO and ReactPlayer.
Socket.IO is necessary for the game to be run on separate machines simultaneously and ReactPlayer is what's used to render the songs for the game.

### Running the game

The game will be hosted on `guesstheanime.netlify.app`. If you want to run it locally, clone the repository and install all the dependencies.

```bash
npm install
```

Run `npm start` on the client side and then run `nodemon index.js` on the server side.

If you are running the game locally, feel free to change the `songs.json` file which contains all the songs used for the game.
The file is separated by different modes and song types. You can add to each respective mode by adding a new object to it with the following properties below: 

```jsx
{
	"easy-openings": [
		{
			"url": "youtube link to song of your choice",
			"eng_name": "name of anime in english",
			"jap_name": "name of anime in japanese"
		}
	]
}
```

### Additional notes

- As of now, the game will only support 2 players. Implementation of 3+ players coming soon.
- There is a fixed number of songs for each mode. When there are no more remaining songs left, the last song will continue playing.