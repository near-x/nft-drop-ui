import * as nearAPI from 'near-api-js'

export async function getMetadata (network, contractName, tokenId) {
  let config
  if (network === 'mainnet') {
    config = {
      networkId: 'mainnet',
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: 'https://rpc.mainnet.near.org',
      walletUrl: 'https://wallet.mainnet.near.org',
      helperUrl: 'https://helper.mainnet.near.org',
      explorerUrl: 'https://explorer.mainnet.near.org'
    }
  } else {
    config = {
      networkId: 'testnet',
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org'
    }
  }

  const near = await nearAPI.connect(config)
  const account = await near.account(contractName)
  const contract = new nearAPI.Contract(
    account,
    contractName,
    {
      viewMethods: ['nft_token']
    }
  )
  console.log(contract)

  const nft = await contract.nft_token({
    token_id: tokenId
  })

  return nft.metadata
}
