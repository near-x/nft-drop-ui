import * as nearAPI from 'near-api-js'
import * as BN from 'bn.js'
import * as sha256 from 'js-sha256'

export async function claimNFT (network, contract, tokenId, privateKey, receiver) {
  console.log('claim for', network, contract, tokenId, receiver, privateKey)
  const keyPair = nearAPI.utils.key_pair.KeyPairEd25519.fromString(privateKey)
  const publicKey = keyPair.getPublicKey()

  const rpcEndpoint = network === 'mainnet' ? 'https://rpc.mainnet.near.org' : 'https://rpc.testnet.near.org'
  const rpcProvider = new nearAPI.providers.JsonRpcProvider(rpcEndpoint)

  const dropContract = network === 'mainnet' ? 'nft-drop.near' : 'nftdrop.testnet'
  console.log(publicKey.toString())
  const accessKey = await rpcProvider.query(
    `access_key/${dropContract}/${publicKey.toString()}`,
    ''
  )
  const nonce = accessKey.nonce + 1

  const actions = [
    nearAPI.transactions.functionCall(
      'claim_nft',
      {
        account_id: receiver
      },
      new BN('300000000000000'),
      0
    )
  ]

  const recentBlockHash = nearAPI.utils.serialize.base_decode(
    accessKey.block_hash
  )

  const transaction = nearAPI.transactions.createTransaction(
    dropContract,
    publicKey,
    dropContract,
    nonce,
    actions,
    recentBlockHash
  )

  const serializedTx = nearAPI.utils.serialize.serialize(
    nearAPI.transactions.SCHEMA,
    transaction
  )
  const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx))
  const signature = keyPair.sign(serializedTxHash)
  const signedTransaction = new nearAPI.transactions.SignedTransaction({
    transaction,
    signature: new nearAPI.transactions.Signature({
      keyType: transaction.publicKey.keyType,
      data: signature.signature
    })
  })

  const signedSeiralizedTx = signedTransaction.encode()

  const result = await rpcProvider.sendJsonRpc(
    'broadcast_tx_commit',
    [Buffer.from(signedSeiralizedTx).toString('base64')]
  )

  console.log(result)
  console.log(result.Failure)

  return result
}
