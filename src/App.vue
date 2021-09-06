<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <button class="claim-btn btn btn-primary" v-on:click="claim" :disabled="btnDisabled">领取</button>
    <img class="nft" v-bind:src="this.imageUrl">
  </div>
</template>

<script>
import * as UrlPattern from 'url-pattern'
import { claimNFT } from './claim'
import { getMetadata } from './nft'

export default {
  name: 'App',
  data () {
    return {
      title: 'NFT title',
      description: 'NFT desc',
      accountId: null,
      network: 'testnet',
      contractName: null,
      tokenId: null,
      privateKey: null,
      imageUrl: null,
      btnDisabled: false
    }
  },
  async mounted () {
    this.parseURL()
    const metadata = await getMetadata(this.network, this.contractName, this.tokenId)
    console.log(metadata)

    this.title = metadata.title
    this.description = metadata.description
    this.imageUrl = metadata.media
  },
  methods: {
    parseURL: function () {
      const path = window.location.pathname.replace(/\./g, '%2E')
      const pattern = new UrlPattern('*/:network/nft/:contract/:tokenId/claim/:privateKey')
      const result = pattern.match(path)

      this.network = result.network
      this.contractName = decodeURIComponent(result.contract)
      this.tokenId = result.tokenId
      this.privateKey = result.privateKey

      const query = window.location.search
      const params = new URLSearchParams(query)
      console.log(params)

      this.accountId = params.get('accountId')
    },
    claim: async function () {
      this.btnDisabled = true

      try {
        await claimNFT(
          this.network,
          this.contractName,
          this.tokenId,
          this.privateKey,
          this.accountId
        )

        window.alert('领取成功')
      } catch (err) {
        window.alert('领取失败')
        console.log(err)
      } finally {
        this.btnDisabled = false
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

body, html {
  height: 100%;
}

.container {
  margin: auto;
  width: 100%;
  max-width: 500px;
}

.nft {
  width: 100%;
}

.claim-btn {
  margin-top: 0px;
  margin-bottom: 16px;
}
</style>
