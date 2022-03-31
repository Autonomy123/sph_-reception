//配置路由
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import routes from './routes'
import store from '../store'
//需要重写VueRouter.prototype原型对象身上的push|replace方法
//先把VueRouter.prototype身上的push|replace方法进行保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
//重写VueRouter.prototype身上的push方法了
VueRouter.prototype.push = function(location, resolve, reject) {
  //第一个形参：路由跳转的配置对象（query|params）
  //第二个参数：undefined|箭头函数（成功的回调）
  //第三个参数:undefined|箭头函数（失败的回调）
  if (resolve && reject) {
    //push方法传递第二个参数|第三个参数（箭头函数）
    //originPush：利用call修改上下文，变为(路由组件.$router)这个对象，第二参数：配置对象、第三、第四个参数：成功和失败回调函数
    originPush.call(this, location, resolve, reject);
  } else {
    //push方法没有产地第二个参数|第三个参数
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};
//重写VueRouter.prototype身上的replace方法了
VueRouter.prototype.replace = function(location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};

let router = new  VueRouter({
   routes,
   scrollBehavior(to, from, savedPosition) {
    // 路由跳转到另一个页面后，代表滚动条在最上方
    return { y:0 }
  },
});
//全局守卫
router.beforeEach(async(to,from,next)=>{
  //to 可以获取到你要跳转的那个路由信息
  //from 可以获取到你从哪个路由而来的信息
  //next  放行函数 next()放行 next(path)放行到指定路由

  //判断用户是否登录，可以用token 因为只有登录过后才有token嘛
  next()
  let token = store.state.user.token;
  let name = store.state.user.userinfo.name//这个name是用来判断是都有用户信息的
  // 判断有没有用户信息userinfo，因为userinfo是对象，即使是空对象放到if里做判断，也都是true。
  // 所以我们要提取出用户信息userinfo里面的一个字符，这里就用name 空字符串进入到if里为false

  if(token){//当用户登录之后，就不能再跳转到登录，注册页面了，指定跳到home
    if(to.path=='/login'||to.path=='/register'){
      next('/home')
    }else{
      //当用户登录后想去的不是login和resgiter 
      if(name){//当登录成功之后，有用户信息，直接放行
        next()
      }else{
        try {
          //当登录成功之后，没有用户信息，就再派发一次action，获取用户信息。
          //说白了就是，当我登录成功之后，再除了home页面外，其他页面刷只要一刷新，这时用户信息是不是没了(vuex存储的用户信息不持久)
          //用户信息没了就派发action呗 是不是可以解决上面的问题1了
          await store.dispatch("getUserInfo");
          //获取用户信息成功后，再放行
          next()
        } catch (error) {
          //当你登录了，但是获取用户信息失败。
          //什么意思呢。。就是说token失效了。
          //token失效了，就把原来的数据清空，跟退出登录一样，然后再指定跳转到home页面
          store.dispatch('loginOut')
          next('/login')
        }
      }
    }
  }else{
      // 用户没登录，不能去交易相关(trade)的 不能去交易相关的(pay paysuccess) 不能去个人中心(center)
      //未登录去上面这些路由 就强制他去登录页面
      //未登录去
      let toPath = to.path;
      if( toPath=='/trade'||toPath=='/pay'||toPath=='/paysuccess'||toPath=='/center/myorder'){
        //把未登录想去，而未去成的信息，存储在地址栏中
        next('/login?redirect='+toPath);  //这里什么意思呢。比如说：你没登录的时候，点击我的订单，守卫强制你放行到login页面
                                            //但是这时候你已经点几个我的订单了 所以就把我的订单的路径添加到 login的路由上
                                            
      }else{    
        //用户没登录,想去的不是上面那些路由，放行
        next();
      }
    }
})
export default router