//登录与注册的小仓库
import { reqgetcode,reqUserLogin,reqregisteruser, reqUserInfo,reqloginOut } from "../../api";
import {setToken,getToken,removeToken} from '@/utils/token'
const state = {
    code:"",
    //token:localStorage.getItem('TOKEN'), 
    token:getToken(),
    userinfo:{}
};
const mutations ={
        GETCODE(state,code){
            state.code = code
        },
        USERLOGIN(state,token){
            state.token = token
        },
        GETUSERINFO(state,userinfo){
          state.userinfo=userinfo
        },
        CLEAR(state){
          state.userinfo="";
          state.token = "";
          removeToken()//清空本地缓存的token
        }
};            
const actions ={
    //获取验证码
    async getcode({commit},phone){
        let result = await reqgetcode(phone)
        if(result.code==200){
            commit("GETCODE",result.data) //现实开发中 我请求成功，并不需要把验证码存进state仓库中，直接发给用户手机
                                            //下面的那些成功或者失败就不用写了  到这一步就还可以了 因为没有后续操作了
            return 'ok'
        }else {
            return Promise.reject(new Error("faile"));
        }
    },
     //用户注册
  async userRegister({ commit }, user) {
    let result = await reqregisteruser(user);
    if (result.code == 200) {//用户注册需要知道注册成功还是失败，因为请求成功还有后续操作 要跳转到登录页面呢
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
   //用户登录
    async userLogin({ commit }, data) {
      ////用户登录需要知道注册成功还是失败，因为还有后续操作，成功的话得跳到home组件
        let result = await reqUserLogin(data);
        console.log(result)
        // 服务器下发token，用户唯一标识符(uuid)
        //将来经常通过带token找服务器要用户信息进行展示
        if (result.code == 200) {
          //用户已经登录成功且获取到token
          commit("USERLOGIN", result.data.token);     
      //持久化储存，把token存进本地缓存     
          // localStorage.setItem("TOKEN",result.data.token);  
          //储存到本地缓存必须是字符串，但是token本来就是字符串，所以不用再转JSON.stringify
      //持久化储存，把token存进本地缓存
          setToken(result.data.token);//也可以把token封装成一个模块 utils下的token.js,然后再引该模块
          return "ok";
        } else {
          return Promise.reject(new Error("faile"));
        }
      },
   //获取用户信息
   async getUserInfo({commit}){//获取用户信息这里也有后续操作了 在全局守卫那
     let result = await reqUserInfo();
     if(result.code==200){
      commit('GETUSERINFO',result.data)
      return 'ok'
     }else{
       return Promise.reject(new Error('faile'))
     }

   },
   //退出登录
   async loginOut ({commit}){//需要知道请求成功或者失败的结果了 有后续操作 退出成功，得跳到home页面
     let result = await reqloginOut()
    if(result.code==200){//如果退出成功
      //清空token(本地存储也要清空)和userInfo 但是action里面不能操作state的数据 所以只能提交mutations
      commit('CLEAR')
      return "ok"
    }else{
      return Promise.reject(new Error("faile"))
    }
   }
};
const getters ={};
export default{
    state,
    mutations,
    actions,
    getters
}