import Vue from "vue";
import Vuex from "vuex";
import * as actions from "./actions";
import * as getters from "./getters";
import state from "./state";
import mutations from "./mutations";
import createLogger from "vuex/dist/logger"; //打印日志

// 如果 state 的属性，不是由 mutation 或 actions 修改会报错
let debug = process.env.NODE_ENV !== "production";

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
