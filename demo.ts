import Vue from "./src/instance";

const vm = new Vue({
  el: '#app',
  data() {
    return {
      name: 'owen',
      age: 26
    }
  },
})

window.vm = vm
