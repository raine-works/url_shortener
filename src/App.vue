<template>
  <div class="flex justify-center items-center h-screen bg-white dark:bg-slate-900 px-6">
    <form
      class="lg:w-1/2 sm:w-full" 
      @submit.prevent
    >
      <h2 class="text-center text-green-500 text-5xl mb-12">URL Shortener</h2>

      <div class="w-full flex">
        <input 
          placeholder="Enter URL you would like to shorten"
          type="text"
          class="bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-l-lg py-2 px-4 w-full ring-0 mb-4 max-h-10"
          v-model="fullUrl"
        />
        <button
          class="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-r-lg max-h-10" 
          @click="getShortUrl(fullUrl)"
        >Submit</button>
      </div>

      <div class="flex justify-center">
        <div @click="copy(shortUrl)" v-if="shortUrl" class="ring-1 ring-green-500 text-green-500 hover:bg-green-100/10 rounded-lg px-4 py-2 text-center text-xl grow-0 cursor-pointer flex items-center">
          <span class="mr-2">{{ shortUrl }}</span>
          <i class="far fa-copy"></i>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'App', 
    data() {
      return {
        fullUrl: null, 
        shortUrl: null
      }
    }, 
    methods: {
      async getShortUrl(payload) {
        let response = await this.$axios({
          method: 'POST', 
          url: 'create', 
          data: {
            fullUrl: payload
          }
        })
        if (response.status == 200) {
          this.shortUrl = response.data.newUrl
        }
      }, 

      copy(url) {
        navigator.clipboard.writeText(url)
      }
    }
  }
</script>
