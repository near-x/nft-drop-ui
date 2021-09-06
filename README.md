# nft-drop-ui

## API
- `GET` `/:network/nft/:contract_name/:token_id/claim/:private_key?accountId={receiverId}`
  - Claim a NFT which has already be transferred to `nft-drop` contract
  - params
    - network: `mainnet` or `testnet`
    - contract_name: NEP-171 contract account id
    - token_id: NFT token id
    - private_key: the private key whose corresponding public key was registered in `nft-drop` contract
    - accountId: receiver account id who will receive the NFT
 
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
