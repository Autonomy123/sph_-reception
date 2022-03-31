import {reqgetShopCartList,reqdeleteShopCartList,reqUpdateCheckedByid} from "../../api/index";
import { userTemp } from '@/utils/uuid_token';
const state={ 
    //程序运行起来的时候，仓库已经有了，用户临时身份存储到vuex
    userTempId: userTemp(),
    cartList:[]
};
const mutations ={
    SHOPCARTLIST(state,cartList){
        state.cartList = cartList
    }
};
const actions ={
    //获取购物车列表数据
    async getShopCartList({commit}){
        let result = await reqgetShopCartList()
        if(result.code ==200){
            commit('SHOPCARTLIST',result.data)
        }    
    },
    //修改购物车某一个产品的选中状态
    async updateCheckedById({commit},{skuId,isChecked}){
        let result = await reqUpdateCheckedByid(skuId,isChecked)
        if(result.code ==200){
            return '修改成功'
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
      //删除购物车某一个产品
      async deleteShopCartList({commit},skuId){
        let result = await reqdeleteShopCartList(skuId)
        if(result.code ==200){
            return '删除成功'
        }else{
            return Promise.reject(new Error("faile"));
        }
    },
    //删除全部选中的产品
    deleteAllCheckedCart({dispatch,getters}){
        //context:小仓库，commit【提交mutations修改state】 getters【计算属性】 dispatch【派发action】 state【当前仓库数据】
    //获取购物车中全部的产品（是一个数组）
        let promiseAll=[];
        //筛选出勾购的产品，再进行删除
        let filters= getters.cartList.cartInfoList.filter(item=>item.isChecked == 1)
        console.log(filters)
        filters.forEach(item => {
            let promise = dispatch('deleteShopCartList',item.skuId) 
             //将每一次返回的Promise添加到数组当中
            promiseAll.push(promise)
        });
        //只要全部的p1|p2....都成功，返回结果即为成功
    //如果有一个失败，返回即为失败结果
       return Promise.all(promiseAll)
       
    },
    //修改全部商品的勾选状态
    updataAllChecked({dispatch,getters},isChecked){
        let promiseAll = []
        getters.cartList.cartInfoList.forEach(item=>{
            let promise =dispatch('updateCheckedById',{
                skuId:item.skuId,isChecked
            })
            promiseAll.push(promise)
        })
        return Promise.all(promiseAll)
    }
};


//由于购物车数据的数组，后台写的结构太复杂了。我们用getter简化一下
const getters = {
    cartList(state){
        return state.cartList[0]||{};
    }
};
export default {
    state,
    actions,
    mutations,
    getters
}

