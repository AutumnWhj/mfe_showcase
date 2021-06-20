import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { registerMicroApps, start } from "qiankun";

registerMicroApps(
  [
    {
      name: "subAppLogin",
      entry: "//localhost:8081",
      container: "#subapp-viewport",
      activeRule: "/login",
    },
  ],
  {
    beforeLoad: async (app) => console.log("before load", app.name),
    beforeMount: [async (app) => console.log("before mount", app.name)],
  }
);
// 启动 qiankun
start();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#main-container");
