# Notes

_Schema UID:_ 0x3a65facf06635b21432225452ac5a5c00bc300c91ff6f940dc7244836f892616

**Notes**

- `NEXT_PUBLIC_NETWORK` should be sepolia for the schema_uid above since it is deployed on sepolia
- `PRIVATE_KEY` the wallet that is used to create the attestation.

3. Next run `pnpm dev` and it should start the server.
4. Run `pnpm build` to build for production

_API Route is located at `/app/api/create-attestation`_

# API DOCS:

_URL Path_: `/api/create-attestation`
_Method_: `POST`
_Description_: Create attestation handles the creation of both single and multiple attestation. The attestation is created by the `PRIVATE_KEY` provided in the env.
**_Request Parameters_**:
_Content Type_: `application/json`
_Payload_:
The payload must be an array of attestations.
Each attestation can consists of these values:
| Field | Type | Required | Description |
| -------------- | ---------- | -------- | ---------------------------------------------------------- |
| `hypercertId` | `string` | ✅ | Valid 32 bytes id with 0x prefix |
| `title` | `string` | ✅ | Minimum 5 characters |
| `description` | `string` | ✅ | Minimum 10 characters |
| `contributors` | `string[]` | ✅ | Array of valid Ethereum addresses (at least one required) |
| `workStart` | `integer` | ✅ | Positive UNIX timestamp (in seconds) |
| `workEnd` | `integer` | ✅ | Positive UNIX timestamp (must be greater than `workStart`) |
| `recipient` | `string` | ✅ | A valid Ethereum address |

**Sample Payload**:
Note both singe and multiple attestations have the same payload. You just add to the array if you want multiple attestations at once

Single attestation

```
[
    {
        "hypercertId": "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce0377cbeedb1a58e4c5f3c",
        "title": "Picking up trash",
        "description": "Go to every neighbourhood and pick up atleast one piece of trash",
        "contributors": ["0x1239021390", "0x1231231999"],
        "workStart": 14447882,
        "workEnd": 15559023,
        "recipient": "0x21382031"
    }
]
```

Multi attestations

```
[
    {
        "hypercertId": "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce0377cbeedb1a58e4c5f3c",
        "title": "Picking up trash",
        "description": "Go to every neighbourhood and pick up atleast one piece of trash",
        "contributors": ["0x1239021390", "0x1231231999"],
        "workStart": 14447882,
        "workEnd": 15559023,
        "recipient": "0x21382031"
    },
    {
        "hypercertId": "0xff3e21221ac636a65a842ce7c78d9aa706d3b113bce0377cbeedb1a58e4c5f3c",
        "title": "Going on a hike",
        "description": "Go on a hike and drink some pristine lakewater",
        "contributors": ["0x1239021390", "0x1231231999"],
        "workStart": 14247882,
        "workEnd": 15259023,
        "recipient": "0x21382031"
    }
]
```

**Response**
Single Attestation

```
{
    "message": "Attestation created successfully",
    "attestationIds": [
        "0x1edccd2b3037c9aac6fa8a28e0cb9d709cf5ae3cc9600f54b5eea58ff25758cf"
    ],
    "transactionHash": "0xbed57abd0e078cb627bb33b1b49aa08400d5b57eb20b1121052b42e22aa34419"
}
```

Multi Attestation: same response just message says multi attestation created successfully

```
{
    "message": "Multiple attestations created successfully",
    "attestationIds": [
        "0x9c275086a5f6de539b584bdbf073f5c65ad9b3820f5a155ebf5d81b2d9b2bd27",
        "0x9c8e85621c729c090a93ce31f38341c379225c66adbe7807e72f08028a37c414"
    ],
    "transactionHash": "0x17056d888758dfe02521a50b29039e028b91f3237c31fc108b852aeb009de0dd"
}
```

# Test requests/responses

**Note: You can also test through the UI by running pnpm dev and then going to the root page: `/`**

_Request:_

```
curl --location 'http://localhost:3000/api/create-attestation' \
--header 'Content-Type: application/json' \
--data '[
    {
        "hypercertId": "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce0377cbeedb1a58e4c5f3c",
        "title": "Cut weed",
        "description": "Gardening for good. all organic food",
        "contributors": [
            "0xbFbBFacCD1126A11b8F84C60b09859F80f3BD10F"
        ],
        "workStart": 1747792145,
        "workEnd": 1750470545,
        "recipient": "0xbFbBFacCD1126A11b8F84C60b09859F80f3BD10F"
    },
    {
        "hypercertId": "0x4f3edf983ac63dda21912ce7c78d9aa706d3b113bce0377cbeedb1a58e4c5f3c",
        "title": "Community food",
        "description": "Tomza for everyone at the event hall",
        "contributors": [
            "0x868daB0b8E21EC0a48b726A1ccf25826c78C6d7F"
        ],
        "workStart": 1745048719,
        "workEnd": 1746667919,
        "recipient": "0x868daB0b8E21EC0a48b726A1ccf25826c78C6d7F"
    }
]'
```

_Response_

```
{
  "message": "Multiple attestations created successfully",
  "attestationIds": [
    "0x08eb5c7e08cbd696aa1e68613acaa9957c40b348ca8f2e5bc6b90bb031e26fcd",
    "0xebe77e6464461d63ec4287df0f8d2ed980736bf0e8accd997d30b4a9f676e866"
  ],
  "transactionHash": "0xba434010dd936b1c9f10f43ea6f51fcde79a39fe2d76a5923edcb1926426aa96"
}
```

# Setup

1. We use `pnpm` in this project so run the following command to install all dependencies:

```
pnpm install
```

2. After installing the dependencies create a `.env` file with the following values

```
NEXT_PUBLIC_NETWORK="NETWORK_NAME"
PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"
ALCHEMY_API_KEY="ALCHEMY_KEY"
```

## Notes:

used private key from `process.env.PK` dont know how these are handled in production.

## TODOS

- [x] add schema validation
- [x] multi attestations
- [x] error handling
- [ ] change workstart and workend to proper dates
- [x] add hypercert id to payload
- [x] add some sample requests using curl and sample responses
