# POKER LEGENDS
A 52-cards poker statless game engine buit with NodeJS, NestJS, TypeScript, RxJS and algebraic data types.

## Purpose
This game engine (GE) is stateless and responsible for game evaluation, rules and actions.
To have a complete game, one must have a dealer between the GE and the customer-facing interface.

The GE do not own this responsibility: authn, authz and persistence, instead it calculates each game step.

## Stack
- NodeJS
- NestJS
- TypeScript
- RxJS: used on game action strategy evaluation to improve readability of the code and possibly adding virtual parallelism if blocking operations were added 
- Algebraic data types (ADTs): considering that a deck is a Cartesian product, then with the use of ADTs it is possible to add more type safety

## Roadmap
The game engine is working perfectly, but still has a lot of work [TODO](./TODO.md).

## Make

There is a [Makefile](./Makefile) for convenience containing a few commands to assist you. You may check them running:
```sh
make help
```

## Testing it

There are unit testing covering the game rules and integration tests partially covering the features:
- run unit testing: `npm run test`
- run integration testing: `npm run test:e2e`

## Running it

Before running, it is advisable to verify the [config file](./src/config/configuration.ts).

### dev mode
```sh
npm i
npm run start:dev
```

### docker mode
```sh
npm i # optional, but the docker build will use this as cache
docker build . --tag poker-legends
docker run --name poker-lengeds -d poker-legends
```

## Using it

1. generate table filled with a deck and two to five hands with five cards
```sh
curl --location 'http://127.0.0.1:3000/v1/table' \
--header 'Content-Type: application/json' \
--data '{
    "tableOf": 2
}'
```

2. result
```json lines
{
    "hands": [
        [
          ...
        ],
        [
         ...
        ]
    ],
    "remainingCards": [
      ...
    ]
}
```

3. let each player discard and draw from one to three cards (one request equals to one rebuy)
```sh
curl --location --request PUT 'http://127.0.0.1:3000/v1/table' \
--header 'Content-Type: application/json' \
--data '{
    "action": {
        "kind": "DISCARD_CARTS",
        "data": {
            "discardedCards": [
                {
                    "suit": "Spades",
                    "rank": "Six"
                },
                {
                    "suit": "Diamonds",
                    "rank": "Two"
                }
            ]
        }
    },
    "hands": [
        [
            { "suit":"Hearts","rank":"Queen"},
            { "suit":"Spades","rank":"Six"},
            { "suit":"Diamonds","rank":"Two"},
            { "suit":"Hearts","rank":"Jack"},
            { "suit":"Hearts","rank":"Ten"}
        ],
        [
            {"suit":"Diamonds","rank":"Nine"},
            {"suit":"Diamonds","rank":"Ace"},
            {"suit":"Diamonds","rank":"Four"},
            {"suit":"Spades","rank":"Four"},
            {"suit":"Hearts","rank":"Two"}
        ]
    ],
    "deck":[
        {"suit":"Clubs","rank":"Seven"},{"suit":"Diamonds","rank":"Eight"},
        {"suit":"Clubs","rank":"Four"},{"suit":"Diamonds","rank":"Five"},{"suit":"Spades","rank":"King"},{"suit":"Clubs","rank":"Three"},
        {"suit":"Hearts","rank":"Nine"},{"suit":"Diamonds","rank":"Six"},{"suit":"Hearts","rank":"Six"},{"suit":"Hearts","rank":"King"},
        {"suit":"Hearts","rank":"Three"},{"suit":"Diamonds","rank":"Queen"},{"suit":"Hearts","rank":"Four"},{"suit":"Hearts","rank":"Five"},
        {"suit":"Spades","rank":"Ace"},{"suit":"Clubs","rank":"Ace"},{"suit":"Clubs","rank":"Eight"},{"suit":"Clubs","rank":"Nine"},
        {"suit":"Clubs","rank":"Five"},{"suit":"Clubs","rank":"Ten"},{"suit":"Hearts","rank":"Seven"},{"suit":"Clubs","rank":"Six"},
        {"suit":"Clubs","rank":"King"},{"suit":"Clubs","rank":"Two"},{"suit":"Spades","rank":"Jack"},{"suit":"Spades","rank":"Two"},
        {"suit":"Diamonds","rank":"Seven"},{"suit":"Spades","rank":"Ten"},{"suit":"Spades","rank":"Seven"},{"suit":"Hearts","rank":"Eight"},
        {"suit":"Diamonds","rank":"Three"},{"suit":"Spades","rank":"Queen"},{"suit":"Hearts","rank":"Ace"},{"suit":"Diamonds","rank":"Ten"},
        {"suit":"Diamonds","rank":"Jack"},{"suit":"Spades","rank":"Five"},{"suit":"Spades","rank":"Nine"},{"suit":"Clubs","rank":"Queen"},
        {"suit":"Diamonds","rank":"King"},{"suit":"Clubs","rank":"Jack"},{"suit":"Spades","rank":"Eight"},{"suit":"Spades","rank":"Three"}
    ]
}'
```

5. result
```json lines 
{
  "hands": [
    [
      ...
    ],
    [
      ...
    ]
  ],
  "remainingCards": [
    ...
  ],
  "action": {
    "kind": "DISCARD_CARTS",
    "result": {
      "drawnCards": [
        {
          "suit": "Spades",
          "rank": "Eight"
        },
        {
          "suit": "Spades",
          "rank": "Three"
        }
      ]
    }
  }
}
```

5. showdown
```sh
curl --location --request PUT 'http://127.0.0.1:3000/v1/table' \
--header 'Content-Type: application/json' \
--data '{
    "action": {
        "kind": "SHOWDOWN",
        "data": {
            "hands": [
                [
                    {
                        "suit": "Hearts",
                        "rank": "Queen"
                    },
                    {
                        "suit": "Hearts",
                        "rank": "Jack"
                    },
                    {
                        "suit": "Hearts",
                        "rank": "Ten"
                    },
                    {
                        "suit": "Spades",
                        "rank": "Eight"
                    },
                    {
                        "suit": "Spades",
                        "rank": "Three"
                    }
                ],
                [
                    {
                        "suit": "Diamonds",
                        "rank": "Nine"
                    },
                    {
                        "suit": "Diamonds",
                        "rank": "Ace"
                    },
                    {
                        "suit": "Diamonds",
                        "rank": "Four"
                    },
                    {
                        "suit": "Spades",
                        "rank": "Four"
                    },
                    {
                        "suit": "Hearts",
                        "rank": "Two"
                    }
                ]
            ]
        }
    },
    "hands": [
        [
            {
                "suit": "Hearts",
                "rank": "Queen"
            },
            {
                "suit": "Hearts",
                "rank": "Jack"
            },
            {
                "suit": "Hearts",
                "rank": "Ten"
            },
            {
                "suit": "Spades",
                "rank": "Eight"
            },
            {
                "suit": "Spades",
                "rank": "Three"
            }
        ],
        [
            {
                "suit": "Diamonds",
                "rank": "Nine"
            },
            {
                "suit": "Diamonds",
                "rank": "Ace"
            },
            {
                "suit": "Diamonds",
                "rank": "Four"
            },
            {
                "suit": "Spades",
                "rank": "Four"
            },
            {
                "suit": "Hearts",
                "rank": "Two"
            }
        ]
    ]
}'
```

6. result
```json lines
{
    "hands": [
        [
            ...
        ],
        [
           ...
        ]
    ],
    "action": {
        "kind": "SHOWDOWN",
        "result": {
            "winnerHand": [
                {
                    "suit": "Diamonds",
                    "rank": "Nine"
                },
                {
                    "suit": "Diamonds",
                    "rank": "Ace"
                },
                {
                    "suit": "Diamonds",
                    "rank": "Four"
                },
                {
                    "suit": "Spades",
                    "rank": "Four"
                },
                {
                    "suit": "Hearts",
                    "rank": "Two"
                }
            ],
            "handRanking": {
                "kind": "OnePair",
                "pairRank": "Four",
                "kickers": [
                    {
                        "suit": "Hearts",
                        "rank": "Two"
                    },
                    {
                        "suit": "Diamonds",
                        "rank": "Nine"
                    },
                    {
                        "suit": "Diamonds",
                        "rank": "Ace"
                    }
                ],
                "value": 1
            }
        }
    }
}
```
