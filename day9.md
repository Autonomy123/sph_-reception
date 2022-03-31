1.购物车
    添加购物车不用vuex三连环
    因为没有数据返回，只是把数据传给后台服务器 后台再把数据存到数据库
    所以不用vuex三连环 用不到state仓库储存

解释：点击购物车中用dispatch派发action，为什么用到了async await
    因为我们点击添加购物车的后，有2种操作
    当购物车添加成功，也就是向后台发请求成功，跳转到购物成功的页面
    当购物车添加不成功，也就是向后台发请求失败，弹出失败提醒
    也就是说，我们需要知道添加购物车这个请求是否成功，成功了做xxxx，失败了做xxxx
  重要***  (说白了，如果请求后，有后续操作的话，成功的后续操作用try捕获
            失败的后续操作用catch捕获 用到try catch就必须用async 和await，
            所以组件内用dispatch派发action，还要用async 和await主要看
            需不需要成功和失败的结果。毕竟有后续操作才需要成功或失败的结果嘛)
        在添加商品到购物车的action中
        1.首先，async函数返回的是一个promise (只要是promise 都有一个成功或者失败的结果)
        2.其次，await后面接的是一个 return的promise 他在等待 这个return的promise给他返回 一个成功或者失败的结果
            //添加商品到购物车
        async AddOrUpdateShopCart ({commit},{skuId,skuNum}){
            let result = await reqAddOrUpdateShopCart (skuId,skuNum)
            if(result.code == 200) //请求成功
            return "添加成功" //只要返回一个非空字符串就算成功
            else{//请求失败
            return Promise.reject(new Error("faile"));
            }
        },
        };
        3.我们在detail页面总点击添加购物车，是通过this.$store.dispatch('AddOrUpdateShopCart',{skuId:this.$route.params.skuId,skuNum:this.num})
        去发请求，因为AddOrUpdateShopCart是用async声明的函数 所以他会返回一个成功或者失败的promise(成功代表发请求成功，把购物车数据成功传给后端)
        当返回一个成功的promise我们就跳转路由，失败就弹出提醒
 ------->所以我们在这里也要用一个await来接收这个return的promise是成功还是失败的既然有await，那就一定要用async来声明
 |       既然await后面接的是一个return的promise，他有成功和失败的结构，我们用try捕获成功的结果，用catch捕获失败的结果
 |      async addShopCart(){
 |         try {
 ---------< await this.$store.dispatch('AddOrUpdateShopCart',{skuId:this.$route.params.skuId,skuNum:this.num})
            this.$router.push({
              path:'/addCartSuccess',
              query:{
                skuNum:this.num,
              }
            })
        } catch (error) {
          alert(error)
        }
      }

2.本地存储localstorage, 持久化--只能存储5m
会话存储sessionstorage 并非持久化 浏览器关闭数据就没了
    存储数据的时候，无论是本地存储还是会话存储 都只能存字符串  所以，在存对象的时候，要把他转化为字符串的格式  对象-->字符串用 JSON.stringify
    拿去存储数据的时候，拿的是字符串，因为你存的时候也只能存字符串嘛  但是我们要拿字符串里的数据太麻烦了，所以要把他转化为对象  字符串-->对象 用JSON.parse
4.添加购物车成功，展示商品数据
    添加购物车成功，得把商品的数据带到购物车页面中去
    我们可以在路由跳转的时候，把这个商品对象通过路由传参的形式传过去
    但是这样不好，因为商品对象里面的数据太多，路由跳转传递不适合传递想对象这种这么复杂的数据
    我们可以把这个商品对象存到会话存储中，这样在购物车页面中，直接去找浏览器的会话存储要数据就行了，
    没必要存到本地存储，一是本地存储空间自有5m，2是本地存储的数据是永久的

    存数据到会话存储： sessionStorage.setItem("SKUINFO",JSON.stringify(this.skuInfo));
    从会话存储取数据：  computed: {
                            skuInfo() {
                            return JSON.parse(sessionStorage.getItem("SKUINFO"));
                            },
                        },

5.点击查看详情，跳回购买的页面
    点击查看详情，跳回购买的详情页面，必须把商品id也一起传回去
    这样你回到详情页面，才能显示相对应的产品
    你可能会想，我详情页本来是A商品，我点击加入购物车后，跳转到购物车成功的页面，然后再点击查看详情
    通过路由跳转跳回原来的详情页面，这样跳回来的时候，也能展示我原来的A商品
    这样就大错特错，因为每一次路由跳转，就是路由页面的销毁，例如：A跳到B A路由就被页面销毁了
    只能通过路由跳转的时候，把参数传回来。
    mounted() {
     this.$store.dispatch("getGoodInfo", this.$route.params.skuId);
    },
    参数回来后，再通过详情页的mounted，再一次带着id发请求，重新展示数据

6.发请求获取不到购物车数据 
    因为服务器不知道你是谁
    用uuid生成你的身份 uuid是随机生成且不重复的
    游客的身份是一直固定的 当你下次再访问网页 你的身份还是没变
    所以你的uuid也不能变 且要一直永久存储下去 不能说关闭掉网页 这个uuid就没了
    所以得存储到localstorage中

7.utils文件夹放常用功能模块
    把这个临时身份封装成一个函数  生产身份之后  这个身份不能再改变了
    封装函数切记一点要有一个返回值  没有返回值就是undefined
    引入uuid  import { v4 as uuidv4 } from 'uuid';
     
    我们现在是游客身份 所以用uuid
    到时候写登录注册的时候，后端会传一个token给我们 
    到时候我们登录账号后，用的就是这个token而不是uuid
    说白了，uuid是给游客模式使用的，用户正常登录后用的是后端传过来的token
    无论是这个uuid还是token，都要放在请求拦截的请求头里面
    把uuid存储到vuex仓库的detail小仓库内
    去到封装好的请求拦截那里，把uuid添加到请求头内
    首先先引入import store from '../store'
    这样才能拿去到vuex中的uuid
    requests.interceptors.request.use((config)=>{//config:配置对象，对象里面有一个属性很重要，headers请求头
        //请求头添加一个字段(userTempId):和后台老师商量好了
        if(store.state.shopcart.userTempId){
            config.headers.userTempId = store.state.shopcart.userTempId;
        }
        //进度条开始
        nprogress.start();
        return config;
    },(error)=>{
     })

   

        
   
