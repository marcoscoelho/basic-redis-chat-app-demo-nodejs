# MilhasTech - Chat App

## Keys convention

key alias    | key pattern                                   | key sample   | type        | specs/description
-------------|-----------------------------------------------|--------------|-------------|--------------------------------------
user_count   | `total_users`                                 | total_users  | integer     | incrementable
room         | `room:(?<roomId>[\d]+)`                       | room:0       | sorted list | message list, sort by date
room_p2p     | `room:(?<userId>[\d]+):(?<otherUserId>[\d]+)` | room:1:2     | sorted list | message list, sort by date
room_named   | `room:(?<roomId>[\d]+):name`                  | room:0:name  | string      | chat friendly name
username     | `username:(?<username>[\w]+)`                 | username:Joe | string      | ref. user key
user         | `user:(?<userId>[\d]+)`                       | user:1       | hash        | user properties: username, ~password~
user_rooms   | `user:(?<userId>[\d]+):rooms`                 | user:1:rooms | set         | roomId list, unique members
online_count | `online_users`                                | online_users | set         | userId list, unique members

## Message Scheme

property | type    | description            |
---------|---------|------------------------|
from     | integer | userId                 |
roomId   | string  | roomId                 |
message  | string  | some text              |
date     | integer | timestamp: `date +%s`  |

<details>
<summary>Json example</summary>

```json
{
    "from": 1,
    "roomId": "0",
    "message": "Hello General!",
    "date": 1624234391
}
```
</details>

## Rooms

- Creating room `SET room:0:name "General"`

<details>
<summary>More</summary>

```
GET room:0:name
MSET room:1:name "Dev" room:2:name "Backend" room:3:name "Frontend"
MGET room:0:name room:1:name room:2:name room:3:name
```
</details>

## Users

1. Marcos
    - Get id `INCR total_users`
    - Create user entity `HSET user:1 username "Marcos" password "$2b$10$inzLtoTwJ0kfgul8l8/Y5OMTqFs3hLSvLG3oczEbqFzUnOAiAkYym"`
    - Create username pointer `SET username:Marcos user:1`
    - Add user to room `SADD user:1:rooms 0`

2. Coelho
    - Get other id `INCR total_users`
    - Create other user entity `HSET user:2 username "Coelho" password "$2b$10$inzLtoTwJ0kfgul8l8/Y5OMTqFs3hLSvLG3oczEbqFzUnOAiAkYym"`
    - Create other username pointer `SET username:Coelho user:2`
    - Add other user room `SADD user:2:rooms 0`

<details>
<summary>More</summary>

```
EXISTS total_users
GET total_users
HGETALL user:1
HGET user:1 username
```
</details>

## Pairing P2P Room

- Pairing user 1 with 2 `SADD user:1:rooms 1:2`
- Pairing user 2 with 1 `SADD user:2:rooms 1:2`

<details>
<summary>More</summary>

```
SISMEMBER user:1:rooms 0
SMEMBERS user:1:rooms
```
</details>

## Set Online Users

- Improve the `SADD online_users 1 2`

## Messages

- Send to room `ZADD room:0 1624234391 "{\"from\":1,\"roomId\":\"0\",\"message\":\"Olá canal!\",\"date\":1624234391}"`
- Reply to room `ZADD room:0 1624234492 "{\"from\":2,\"roomId\":\"0\",\"message\":\"OI oi Oi OOOi!\",\"date\":1624234492}"`
- Send to user `ZADD room:1:2 1624235384 "{\"from\":1,\"roomId\":\"1:2\",\"message\":\"E aí cara, blz?!\",\"date\":1624235384}"`
- Reply to another user `ZADD room:1:2 1624235485 "{\"from\":2,\"roomId\":\"1:2\",\"message\":\"Ótimo e vc??\",\"date\":1624235485}"`

<details>
<summary>More</summary>

```
ZRANGE room:0 0 0
ZREVRANGE room:0 0 -1
ZREVRANGE room:0 0 -1 WITHSCORES
ZREM room:0 "{\"from\":1,\"roomId\":\"0\",\"message\":\"Hello General!\",\"date\":1624234391}"
```
</details>

## Events

- `SUBSCRIBE MESSAGES`
- `PUBLISH MESSAGES "{}"`
