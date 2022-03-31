1.删除勾选的全部商品
    promsie.all[arr]或者promsie.all(p1,p2,p3)
    只有promsie.all里面所有的值都为true 才会返回成功
    promsie.all里面所有的元素都是一个promise 

    删除全部商品的思路：
        首先，正常情况下，删除全部商品肯定是有一个接口的。但是为了锻炼我们用到promise.all
        就只能用到一个个删除的那个接口
            删除一个商品就派发一个action 让action发请求删除商品
            购物车里面有几个勾选(注意，是勾选的，购物车中没勾选的可不要删除)商品，我们就派发几个action
            所以可以筛选出购物车中勾选的商品，存到一个新的数组中
            然后遍历该数组， 每次遍历都派发一个action
            平时都是在组件内派发action的，其实在vuex内，也是可以派发action的
            删除全部商品，在vuex中派发action 因为购物车的商品，还有删除一个商品的请求，都在vuex中
        第一步：1.删除全部商品绑定一个事件
                <a  @click="deleteAllCheckedCart">删除选中的商品</a>
                2.//删除全部选中的商品
                    async deleteAllCheckedCart(){
                        console.log('删除')
                        try {
                            await this.$store.dispatch('deleteAllCheckedCart')
                            //删除成功后，再次发请求，获取新的数据
                            this.getData()
                        } catch (error) {
                            alert(error.message)
                        }
                    },
        第二步：去到仓库中派发action
                1. //这是删除购物车某一个产品，给下面作参考
      |-------->   async deleteShopCartList({commit},skuId){
      |看              let result = await reqdeleteShopCartList(skuId)
      |到             if(result.code ==200){
      |没                  return '删除成功'
      |这              }else{
      |个                  return Promise.reject(new Error("faile"));
      |函              }
      |数          },
      |是            2.  //删除全部选中的产品
      |用             deleteAllCheckedCart({dispatch,getters}){
      |async                  //context:小仓库，commit【提交mutations修改state】 getters【计算属性】 dispatch【派发action】 state【当前仓库数据】
      |声              //获取购物车中全部的产品（是一个数组）
      |明                  let promiseAll=[];
      |的                  //筛选出勾选的产品后，再进行删除
      |                  let filters= getters.cartList.cartInfoList.filter(item=>item.isChecked == 1)
      |                  filters.forEach(item => {
      |---------------------------let promise = dispatch('deleteShopCartList',item.skuId) 
                                //将每一次返回的Promise添加到数组当中  为什么说dispatch返回的是promise 看前面的箭头
                            promiseAll.push(promise)
                        });
                        //只要全部的p1|p2....都成功，返回结果即为成功
                    //如果有一个失败，返回即为失败结果
                    return Promise.all(promiseAll)        
                 }
        ps：这个东西return Promise.all(promiseAll)
            里面已经包含了成功或者失败的结果了，
            我们之前 成功或者失败都是这样写的
             if(result.code ==200){
                    return '删除成功'
                }else{
                    return Promise.reject(new Error("faile"));
                } 

            这家伙return Promise.all(promiseAll)已经包含在里面了
            所以在组件内也要用aysnc await来接
    重要：Promise.all(xxx)里面所有的元素都是一个返回的promise，
          可以是 Promsie.all[arr]或者promsie.all(p1,p2,p3)

2.修改全部商品的勾选状态
    给全选的input绑定一个回调
     1.<input class="chooseAll" type="checkbox" :checked="isAllChecked" @change="updataAllChecked($event.target.checked)">
        <span>全选</span>
        //勾选$event.target.checked的值为true 不勾选为false
       // 为true的时候，就把isChecked=1传过去 不勾选传isChecked=0
         isChecked=isChecked ? "1" :"0"
         当input框勾选， $event.target.checked的值为true 为true的时候，isChecked=1
        然后派发action的时候，就把这个isChecked=1传过去 告诉后端，把所有的商品都勾选上
        当input框没勾选 就把这个isChecked=0传过去 告诉后端，所有商品都取消勾选
        ps:(因为选没选中 要通过0代表取消选中 1代表选中 来告诉后端)
     
     2. isChecked=isChecked ? "1" :"0"
        await this.$store.dispatch('updataAllChecked',isChecked)
     ..//修改全部商品的状态
        updataAllChecked({dispatch,state},isChecked){
            let promiseAll = []
            state.cartList.cartInfoList.forEach(item=>{
                let promise =dispatch('updateCheckedById',item.skuId,isChecked)
                promiseAll.push(promise)
            })
            return Promise.all(promiseAll)
        }

     思路跟删除勾选的全部商品差不多

3.注册业务  
    登录业务的表单验证先不处理
    1.获取验证码 
        在实际开发中，发请求，获取验证码，验证码不必存储在vuex中，直接发送到用户手机即可
    2.注册：

4.登录业务
    1.先注册---通过数据库存储用户信息(名字，密码)
    2.登录----登录成功的时候，后台为了区分你这个用户的谁，服务器下发token(令牌：唯一标识符)
    登录接口，做的不完美。在实际开发中，登录成功服务器会下发token，什么用户名这些都是不会返回的，只会返回token，
    前台需要持久化存储token(带着token找服务器要用户信息进行展示)
ps：vuex存储数据不持久化，所以要用到本地缓存
    

5.token的理解
    注册完账号之后，用户登录账号。登录成功，后台会下发一个token  是后台给的
    然后就把这个token加到请求拦截器的请求头中
    前台需要持久化存储token(带着token找服务器要用户信息进行展示)

6.如何持久化存储token
    1.import {setToken,getToken} from '@/utils/token'
    2.const state = {
        //方法1：
        token:localStorage.getItem('TOKEN'),
        //方法2：
        token:getToken(),
        //当还没有登录时，这时token为空 也就相当于token:'' 登录成功后，token已经存进本地缓存
        //再从本地缓存中把token拿出来。
    };

    3.   //用户登录
    async userLogin({ commit }, data) {
        let result = await reqUserLogin(data);
        console.log(result)
        if (result.code == 200) {
          //用户已经登录成功且获取到token
          commit("USERLOGIN", result.data.token);     
      //方法1持久化储存，把token存进本地缓存     
          // localStorage.setItem("TOKEN",result.data.token);   //储存到本地缓存必须是字符串，但是token本来就是字符串，所以不用再转JSON.stringify
    
      //方法2持久化储存，把token存进本地缓存
          setToken(result.data.token);//也可以把token封装成一个模块 utils下的token.js,然后再引该模块
          return "ok";
        } else {
          return Promise.reject(new Error("faile"));
        }
      },

      4.//token封装成一个模块
        export const setToken=(token)=>{
            localStorage.setItem('TOKEN',token)
        };
        export const getToken=()=>{
            return localStorage.getItem('TOKEN')
        }
        
      5.这时，你登录过后再刷新，token也不会消失  day12的用户信息也在
