import { reqGoodsInfo,reqAddOrUpdateShopCart } from "../../api";
const state = {
  goodInfo: {},
};
const mutations = {
  GETGOODINFO(state, goodInfo) {
    state.goodInfo = goodInfo;
  },
};
const actions = {
  //获取产品信息的action
  async getGoodInfo({ commit }, skuId) {
    let result = await reqGoodsInfo(skuId);
    if (result.code == 200) {
      commit("GETGOODINFO", result.data);
    }
  },
  //添加商品到购物车
  async AddOrUpdateShopCart ({commit},{skuId,skuNum}){
    let result = await reqAddOrUpdateShopCart (skuId,skuNum)
    
    if(result.code == 200)
    return "添加成功"
    else{
      return Promise.reject(new Error("faile"));
    }
  },
};
//简化数据而生
const getters = {
  //比如:state.goodInfo初始状态空对象，空对象的categoryView属性值undefined
    //当前计算出的 categoryView属性值至少是一个空对象，假的报错不会有了。

  //简化路径导航
  categoryView(state){
    return state.goodInfo.categoryView||[]
  },
  //简化售卖属性
  spuSaleAttrList(state){
    return state.goodInfo.spuSaleAttrList||[]
  },
  //简化产品信息的数据
  skuInfo(state){
    return state.goodInfo.skuInfo||[]
  },

};
export default {
  state,
  actions,
  mutations,
  getters,
};
