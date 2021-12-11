<template>
  <div class="flex justify-center items-center h-screen bg-white dark:bg-gray-800">
    <form
      class="w-1/2" 
      @submit.prevent
    >
      <div class="w-full flex">
        <input 
          type="text"
          class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-l-lg py-2 px-4 w-full ring-0 mb-4 max-h-10"
          v-model="fullUrl"
        />
        <button
          class="bg-green-500 text-white py-2 px-4 rounded-r-lg max-h-10" 
          @click="getShortUrl(fullUrl)"
        >Submit</button>
      </div>

      <div class="w-full text-center text-green-500 text-xl">
        <span>{{ shortUrl }}</span>
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
      }
    }
  }
</script>
