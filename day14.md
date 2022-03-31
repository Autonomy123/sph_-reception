1.我的订单
   
    拆成了二级路由(熟悉熟悉)
    还是那几个步骤
    1.静态组件
    2.发请求
    3.这里没用到vuex 熟悉一下不用vuex怎恶魔发请求
    4.动态渲染页面
    

2.未登录的导航守卫判断(全局路由守卫)
    未登录不能去交易相关的 不能去交易相关的 不能去个人中心
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

3.用户登录的导航守卫判断( 路由独享守卫)
    想要跳到交易成功页面(这个我就用组件内守卫做一次，熟悉熟悉组件内守卫)
    必须是从支付的页面跳过来
    支付页面又
    必须要从交易页面跳过来
    交易页面又必须是从购物车页面来的   next(false) //意思是从哪个组件来，回哪个组件去
     {
            path:'/pay',
            component:Pay,
            meta: {
                show: true
            },
            beforeEnter(to,from,next){
                if(from.path=="/trade"){//如果是从交易页面来，放行
                    next()
                }else{
                    next(false)
                }
            }
        },
        {
            path:'/trade',
            component:Trade,
            meta: {
                show: true
            },
            beforeEnter: (to, from, next) => {
                if(from.path=='/shopcart'){ //先去交易页面，必须从购物车页面来
                    next()
                }else{
                    next(false) //如果不是购物车页面来，比如说从home组件来，那就汇home组件
                    //意思是从哪个组件来，回哪个组件去
                }
            }


    //组件内守卫
            beforeRouteEnter(to, from, next) {
                if (from.path == "/pay") {
                //如果是从支付页面来，放行
                next();
                } else {
                next(false);
                }
            },


4..如何实现，用户未登录，想去，而未去成的页面，用户一登录后，就直接跳转到那个页面。
    解决:把未登录想去，而未去成的信息，存储在地址栏中(通过导航守卫的to，把未去成的路径存进地址栏中)。(比如说想去订单页面)
        然后去到login组件中做判断，判断login的路径中是否有query

        1.感觉说起来好复杂，如果以后看过来不懂的话，先找到导航守卫这里看这一句next('login?redirect='+toPath);
        2.再去登录组件那里，看这几句 
             let toPatch = this.$route.query.redirect||'/home'
            this.$router.push(toPatch)
        3.看的时候亲自示范一下  重点看路由的路径的变化

    1. //未登录
       let toPath = to.path;
      if( toPath=='/trade'||toPath=='/pay'||toPath=='/paysuccess'||toPath=='/center/myorder'){
        //把未登录想去，而未去成的信息，存储在地址栏中
        next('login?redirect='+toPath);  //这里什么意思呢。比如说：你没登录的时候，点击我的订单，守卫强制你放行到login页面
                                        //但是这时候你已经点击过我的订单了 所以就把我的订单的路径添加到 login的路由上（?key=value）这种方式是query
      }else{                                                            |                                                        把路径添加到路由上
        //用户没登录,想去的不是上面那些路由，放行                         |
        next();                                                         |
      }                                                                 |
                                                                        |
    2.login组件内                                                       |
      //登录业务                                                        |
     async userLogin(){                                                 |
         const {phone,password} = this;                                 |
       if(phone&&password){                                             |
          try {                                                         |
             await this.$store.dispatch('userLogin',{phone,password});  |
             let toPatch = this.$route.query.redirect||'/home'        <—|这时候来到login组件在这里你就判断，当前的login组件路由上是否有query参数的路径
                    //有的话，登录成功后直接跳转到该路径(也就是我的订单页面)，没有的话就跳转到home，因为用到了重定向，所以重定向的路径优先级更高
            this.$router.push(toPatch)
        } catch (error) {
          alert(error.message)
        }
       }
      }


 5..图片懒加载
    用到插件vue-lazyload
    1.npm i vue-lazyload
    2.main.js引入import VueLazyload from 'vue-lazyload'
    3.注册 Vue.use(VueLazyload,{
            loading: loading,//懒加载默认的图片
            })
    4.//引入图片
        import loading from '@/assets/1.gif';
    5.去到需要懒加载的页面
           把这个 <img :src="goods.defaultImg" />
           改为这个<img v-lazy="goods.defaultImg" />
            就行了
6.注册的表单验证
vee-validate表单验证插件
1.npm i vee-validate@2 --save
2.这回就不去main.js引入了
  练习把他封装成一个插件模块(Pligins)
   最后再去main.js引入一下
    使用vee-validate，
    会用就行
    工作中直接把register组件
    跟Pligins下的validate.js文件复制过去
//引入表单校验插件
import "@/plugins/validate";

    3.在注册组件内把页面结构改一下。实际工作中照着抄就行
    4.最后还要去用户注册那里验证一下，当表单的所有内容都满足，才发起注册的请求

     await this.$validator.validateAll();这个是用来验证表单内容是都都满足，满足的话就返回true 他也是一个等待成功或失败的promise，所以要用await
    
//用户注册
   //注册用户
     async completeRigister(){
        const success = await this.$validator.validateAll();
        console.log(success)
      //全部表单验证成功，在向服务器发请求，进行注册
      //只要有一个表单没有成功，不会发请求
     if (success) {
        try {
          const { phone, code, password, password1 } = this;
          await this.$store.dispatch("userRegister", {
            phone,
            code,
            password,
          });
          //注册成功进行路由的跳转
          this.$router.push("/login");
        } catch (error) {
          alert(error.message);
        }
      }
      },

7.路由懒加载
    当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效。
            原本配置路由
            import Center from '../pages/Center';
            {
                path:'/center',
            component:()=>import('../pages/Center'),
            }
            路由懒加载配置路由
            {
            path:'/center',
            component:()=>import('../pages/Center'),
            },

8.打包上线
    npm run build
    项目打包后，代码都是经过压缩加密的，如果运行报错，输出错误的信息无法准确的得知是哪里的代码报错
    有了map结尾的文件就可以像未加密的代码一样 准确的输出哪一行报错
    但是项目上线了我还要知道哪里报错有啥用，有错误开发的时候解决完了
    并且map文件占很大的空间
    所以如果项目不需要这个文件 就在vue.config.js配置中加下面这条语句
    productionSourceMap:false

购买服务器
    阿里云
    腾讯云


