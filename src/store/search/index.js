//search模块的小仓库

import { reqgetSearchList } from "../../api";
const state = {
    
    searchList:{}//接口返回的数据是一个对象，所以用对象来接收
};

const mutations = {
    SEARCHLIST(state,searchList){
        state.searchList =searchList 
    }
};

const actions = {
    //获取search模块数据
    async getSearchList({commit},params={}){
        let result = await reqgetSearchList(params)
        if(result.code ==200){
            commit("SEARCHLIST",result.data)
        }
        
    }
};
//这个getters的用法类似与computed计算属性
//可以把我们在组件需要用到的数据简化一下，这样将来在组件里面读取数据就方便了
const getters = {//用法和computed一样
    goodsList(state){//这个state参数，是自动指向单前仓库中的state小仓库，而不是大仓库里的state
        //假如网络不好，或者没网络，searchList的数据还没有回来 没回来就是空对象
        //那我们执行到这一行tate.searchList.goodsList就会报undefined 空对象.xxx会报undefined  
         //既然searchList.goodsList已经是undefined了  那我们还拿他去遍历数据，就会报错
         //所以加多一个条件||[]
        return state.searchList.goodsList||[]
    },
    trademarkList(state){
        return state.searchList.trademarkList||[]
    },
    attrsList(state){
        return state.searchList.attrsList||[]
    }
};
export default {
    state,
    mutations,
    actions,
    getters
}