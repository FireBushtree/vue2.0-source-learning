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

setTimeout(() => {
  vm.name = 'test'
}, 2000)

window.vm = vm
