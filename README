# Screwball Roulette API Server

Sky Betting and Gaming Technical Test

Author: curtis.s.bainbridge@gmail.com
Linkedin: https://www.linkedin.com/in/curtis-bainbridge-38b381105/

## Outline

* A game of roulette takes place in a session.
* Sessions can be created by players.
* Multiple players can join a single session, a single player cannot join multiple sessions.
* (Temporary) A player is created with a display name.
* A player can place a single or multiple bets in a session.
* When a player has placed bets and is ready to play they can set their status to ready to begin spin the wheel.
* If there are multiple players in a session all players must be ready before a spin.
* After a spin the bets are settled for each player, signifying a win or loss.
* Players must accept their settled bets to bet in the next 'round' (Rounds are not currently counted).

## Installation

1. Ensure that MongoDB is installed and configured correctly.
2. `git clone https://github.com/csbainbridge/roulette-api.git`
3. Navigate into project directory via terminal and type `npm install` to install mongoose dependency.

Note: Mongoose has been used along with MongoDB as these technologies allow sesson states and player states to be stored should a client disconnect. Upon reconnection a client can obtain any data related to them via a GET request. Mongoose has allowed the modelling of entity structures and provides an interface for connecting to the MongoDB server.

## Starting the server

Note: Before starting the api server remember to start the MongoDB server via `mongod.exe`

1. To start the server via command prompt type `npm start`.
2. When the server is running successfully 

`roulette-api server listening on port 8000`
`Connection to database was successful`

## API Usage

The server uses JSON data for all requests and responses.

### Request: POST /session

Creates a new session.

Body:
```javascript
{
	"action": "create"
}
```

Response:
```javascript
{
    "message": "success",
    "data": {
        "__v": 0,
        "_id": "597e60f4504be22c043f5bd8",
        "players": [],
        "created_at": "2017-07-30T22:43:00.196Z"
    }
}
```

### Request: POST /player

Creates a player. By passing a `displayerName` you can set the name of the player.

Body:
```javascript
{
	"action": "create",
	"displayName": "roulette-master"
}
```

Response:
```javascript
{
    "message": "success",
    "data": {
        "__v": 0,
        "_id": "597e5f9d3b6370137452e78d",
        "ready_status": false,
        "bets_placed": [],
        "bets_settled": [],
        "display_name": "roulette-master",
        "in_session": false,
        "created_at": "2017-07-30T22:37:17.251Z"
    }
}
```

### Request: POST /session

Adds a player to a session.

Body:
```javascript
{
	"action":"join",
	"playerId": "597e5f9d3b6370137452e78d",
	"sessionId": "597e60f4504be22c043f5bd8",
	"inSession": false
}
```

Response:
```javascript
{
    "message": "success",
    "data": {
        "message": "You have successfully joined the roulette room.",
        "data": {
            "_id": "597e5f9d3b6370137452e78d",
            "__v": 0,
            "ready_status": false,
            "bets_placed": [],
            "bets_settled": [],
            "display_name": "roulette-master",
            "in_session": true,
            "created_at": "2017-07-30T22:37:17.251Z"
        }
    }
}

```

### Request: POST /player

Places a bet. Players can only have a maximum of 6 bets and must be in a session before they place a bet.

Body:
```javascript
{
	"action":"bet",
	"playerId": "597e5f9d3b6370137452e78d",
	"inSession": true,
	"readyStatus": false,
	"betsPlaced": [],
	"displayName":"huy45",
	"bet": {
		"type": "colour",
		"selection": "black",
		"amount": 1.76
	}
}
```

Currently at present there are two bet types that can be placed. A colour selection as shown in the body of the request above, and a number selection shown below.

```javascript
"bet": {
    "type": "number",
    "selection": 32,
    "amount": 2.73
}
```

Response:

The bets that were placed are returned to update the state of the application as bets placed are required when setting the ready status of the player.

```javascript
{
    "message": "success",
    "data": {
        "message": "Your bet on black has been placed successfully.",
        "data": [
            {
                "amount": 1.76,
                "selection": "black",
                "type": "colour"
            }
        ]
    }
}
```

### Request: POST /player

Sets player `ready_status` to true.

Body:
```javascript
{
    "action": "ready",
    "playerId": "597e5f9d3b6370137452e78d",
	"sessionId": "597e60f4504be22c043f5bd8",
    "betsPlaced": [
        {
            "amount": 1.76,
            "selection": "black",
            "type": "colour"
        }
    ]
}
```

Response:

If all players within the session are ready the following response will be received.

```javascript
{
    "message": "success",
    "data": "All players are ready. Time to spin the wheel!"
}

```

To obtain the result of a spin the client must perform the following GET request:

### Request: GET /player/{player id}

This would require the client browser to poll the server continously. Another way of publishing the outcome to players would be via a push functionality (Publish/Subscribe Model) or websockets, however these were not visited due to lack of experience.

Following a spin all the `bets_settled` is populated with the result. The result contains the players original bet, plus the `outcome`, `result` (Signifies a Win or Loss) and `amount` which is the amount won should the `result` be a Win.

```javascript
{
  "message": "success",
  "data": {
    "_id": "597e5f9d3b6370137452e78d",
    "__v": 0,
    "ready_status": true,
    "bets_placed": [
      
    ],
    "bets_settled": [
      {
        "amount": 0,
        "result": "loss",
        "bet": {
          "type": "colour",
          "selection": "black",
          "amount": 1.76
        },
        "outcome": {
          "colour": "red",
          "number": 5
        }
      }
    ],
    "display_name": "roulette-master",
    "in_session": true,
    "created_at": "2017-07-30T22:37:17.251Z"
  }
}
```



### Request: POST /player

Accepts the settled bets and sets player `ready_status` to false.

Body:
```javascript
{
	"action": "accept",
	"playerId": "597e492a2b68a30598c14f63"
}
```

Response:
```javascript
{
    "message": "success",
    "data": {
        "message": "You are now ready to play again. Please place your bets then ready up.",
        "data": {
            "ready_status": false
        }
    }
}
```

### Request: GET /player

Returns all players

Response:

```javascript
{
    "message": "success",
    "data": [
        {
            "_id": "597e5f9d3b6370137452e78d",
            "__v": 0,
            "ready_status": false,
            "bets_placed": [],
            "bets_settled": [],
            "display_name": "roulette-master",
            "in_session": false,
            "created_at": "2017-07-30T22:37:17.251Z"
        },
        {
            "_id": "597e7126b8402c05fcc28fdc",
            "__v": 0,
            "ready_status": false,
            "bets_placed": [],
            "bets_settled": [],
            "display_name": "poker-vanish",
            "in_session": false,
            "created_at": "2017-07-30T23:52:06.461Z"
        }
    ]
}
```

### Request: GET /session

Returns all sessions.

Response:

```javascript
{
  "message": "success",
  "data": [
    {
      "_id": "597e6aa5e40b6134c4d9d885",
      "__v": 0,
      "players": [
        {
          "_id": "597e6ad1e40b6134c4d9d886",
          "__v": 0,
          "ready_status": false,
          "bets_placed": [
            
          ],
          "bets_settled": [
            {
              "amount": 3.52,
              "result": "win",
              "bet": {
                "type": "colour",
                "selection": "black",
                "amount": 1.76
              },
              "outcome": {
                "colour": "black",
                "number": 6
              }
            }
          ],
          "display_name": "roulette-master",
          "in_session": true,
          "created_at": "2017-07-30T23:25:05.457Z"
        }
      ],
      "created_at": "2017-07-30T23:24:21.657Z"
    },
    {
      "_id": "597e708db8402c05fcc28fdb",
      "__v": 0,
      "players": [
        
      ],
      "created_at": "2017-07-30T23:49:33.399Z"
    }
  ]
}
```

### Request: GET /session/{session id}

Returns a single session based on the `{session id}` passed in the url.

Response:

```javascript
{
  "message": "success",
  "data": [
    {
      "_id": "597e6aa5e40b6134c4d9d885",
      "__v": 0,
      "players": [
        {
          "_id": "597e6ad1e40b6134c4d9d886",
          "__v": 0,
          "ready_status": false,
          "bets_placed": [
            
          ],
          "bets_settled": [
           
          ],
          "display_name": "roulette-master",
          "in_session": true,
          "created_at": "2017-07-30T23:25:05.457Z"
        }
      ],
      "created_at": "2017-07-30T23:24:21.657Z"
    }
  ]
}
```