<template>
  <div class="container">
    <img style="width: 80%; margin-bottom: 20px" src="./assets/near-tiger.png">
    <h2 class="txt">{{ title }}</h2>
    <p class="desc txt">{{ description }}</p>
    <button
      class="claim-btn btn btn-warning"
      v-if="!claimed"
      v-on:click="claim"
      :disabled="btnDisabled">
      领取
    </button>
    <button
      class="claim-btn btn btn-success"
      v-if="claimed"
      v-on:click="openWallet"
      :disabled="btnDisabled">
      查看我的NFT
    </button>
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
      title: 'loading ...',
      description: '',
      accountId: null,
      network: 'testnet',
      contractName: null,
      tokenId: null,
      privateKey: null,
      imageUrl: null,
      btnDisabled: false,
      claimed: false
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
        this.claimed = true
      } catch (err) {
        window.alert('领取失败')
        console.log(err)
      } finally {
        this.btnDisabled = false
      }
    },
    openWallet: function () {
      window.open('https://wallet.near.org/')
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
  margin-top: 0px;
}

body, html {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  height: 100%;
  background-image: url("./assets/background.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}

.container {
  margin: auto;
  padding: 20px;
  width: 100%;
  min-height: 800px;
  max-width: 500px;
  background-color: #ba1c2c;
  border: 15px double #e0c181;
}
.container:before {
  content: " ";
  position: absolute;
  z-index: -1;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
}

.txt {
  color: #e0c181;
}

.nft {
  width: 100%;
  border-radius: 5px;
}

.claim-btn {
  margin-top: 0px;
  margin-bottom: 16px;
}

.desc {
  text-align: justify;
}
</style>
