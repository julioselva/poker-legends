# POKER LEGENDS
A 52-cards poker game engine statless and buit with NodeJS, NestJS, TypeScript, RxJS and algebraic data types.

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
There is a lot of work to do and I am afraid of the time that I still have considering the holidays that usually took a lot from us.
So please let me know if, considering there are only enhancements and the GE is working perfectly, if they are necessary to be implemented.
To know about, please check the [TODO](./TODO.md).

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
                    "suit": "Clubs",
                    "rank": {
                        "kind": "Three",
                        "value": 1
                    }
                },
                {
                    "suit": "Clubs",
                    "rank": {
                        "kind": "Four",
                        "value": 2
                    }
                }
            ]
        }
    },
    "hands": [
        [
            {
                "suit": "Diamonds",
                "rank": {
                    "kind": "King",
                    "value": 11
                }
            },
            {
                "suit": "Hearts",
                "rank": {
                    "kind": "King",
                    "value": 11
                }
            },
            {
                "suit": "Clubs",
                "rank": {
                    "kind": "Three",
                    "value": 1
                }
            },
            {
                "suit": "Spades",
                "rank": {
                    "kind": "Ace",
                    "value": 12
                }
            },
            {
                "suit": "Clubs",
                "rank": {
                    "kind": "Four",
                    "value": 2
                }
            }
        ],
        [{"suit":"Diamonds","rank":{"kind":"Seven","value":5}},{"suit":"Clubs","rank":{"kind":"Ten","value":8}},
        {"suit":"Diamonds","rank":{"kind":"Five","value":3}},{"suit":"Hearts","rank":{"kind":"Nine","value":7}},
        {"suit":"Diamonds","rank":{"kind":"Two","value":0}}]
    ],
    "deck": [
        {"suit":"Spades","rank":{"kind":"Five","value":3}},{"suit":"Hearts","rank":{"kind":"Five","value":3}},
        {"suit":"Spades","rank":{"kind":"King","value":11}},{"suit":"Spades","rank":{"kind":"Ten","value":8}},
        {"suit":"Spades","rank":{"kind":"Nine","value":7}},{"suit":"Spades","rank":{"kind":"Three","value":1}},
        {"suit":"Clubs","rank":{"kind":"Ace","value":12}},{"suit":"Clubs","rank":{"kind":"Nine","value":7}},
        {"suit":"Hearts","rank":{"kind":"Queen","value":10}},{"suit":"Clubs","rank":{"kind":"Two","value":0}},
        {"suit":"Diamonds","rank":{"kind":"Ace","value":12}},{"suit":"Hearts","rank":{"kind":"Seven","value":5}},
        {"suit":"Diamonds","rank":{"kind":"Nine","value":7}},{"suit":"Spades","rank":{"kind":"Jack","value":9}},
        {"suit":"Clubs","rank":{"kind":"Six","value":4}},{"suit":"Spades","rank":{"kind":"Six","value":4}},
        {"suit":"Diamonds","rank":{"kind":"Ten","value":8}},{"suit":"Clubs","rank":{"kind":"Queen","value":10}},
        {"suit":"Spades","rank":{"kind":"Eight","value":6}},{"suit":"Spades","rank":{"kind":"Four","value":2}},
        {"suit":"Spades","rank":{"kind":"Seven","value":5}},{"suit":"Clubs","rank":{"kind":"Seven","value":5}},
        {"suit":"Diamonds","rank":{"kind":"Queen","value":10}},{"suit":"Spades","rank":{"kind":"Two","value":0}},
        {"suit":"Diamonds","rank":{"kind":"Four","value":2}},{"suit":"Clubs","rank":{"kind":"King","value":11}},
        {"suit":"Hearts","rank":{"kind":"Two","value":0}}
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
                    "suit": "Clubs",
                    "rank": {
                        "kind": "King",
                        "value": 11
                    }
                },
                {
                    "suit": "Hearts",
                    "rank": {
                        "kind": "Two",
                        "value": 0
                    }
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
        "kind": "SHOWDOWN"
    },
    "hands": [
        [
            {
                "suit": "Diamonds",
                "rank": {
                    "kind": "King",
                    "value": 11
                }
            },
            {
                "suit": "Hearts",
                "rank": {
                    "kind": "King",
                    "value": 11
                }
            },
            {
                "suit": "Spades",
                "rank": {
                    "kind": "Ace",
                    "value": 12
                }
            },
            {
                "suit": "Clubs",
                "rank": {
                    "kind": "King",
                    "value": 11
                }
            },
            {
                "suit": "Hearts",
                "rank": {
                    "kind": "Two",
                    "value": 0
                }
            }
        ],
        [
            {
                "suit": "Diamonds",
                "rank": {
                    "kind": "Seven",
                    "value": 5
                }
            },
            {
                "suit": "Clubs",
                "rank": {
                    "kind": "Ten",
                    "value": 8
                }
            },
            {
                "suit": "Diamonds",
                "rank": {
                    "kind": "Five",
                    "value": 3
                }
            },
            {
                "suit": "Hearts",
                "rank": {
                    "kind": "Nine",
                    "value": 7
                }
            },
            {
                "suit": "Diamonds",
                "rank": {
                    "kind": "Two",
                    "value": 0
                }
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
               ...
            ],
            "handRanking": {
                "kind": "ThreeOfAKind",
                "threeRank": {
                    "kind": "King",
                    "value": 11
                },
                "kickers": [
                    {
                        "suit": "Hearts",
                        "rank": {
                            "kind": "Two",
                            "value": 0
                        }
                    },
                    {
                        "suit": "Spades",
                        "rank": {
                            "kind": "Ace",
                            "value": 12
                        }
                    }
                ],
                "value": 3
            }
        }
    }
}
```
