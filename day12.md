1.获取用户信息
    1.发请求
    2.vuex三连环
      1. 获取用户信息的时候，必须带token发请求(token是每一个用户的唯一标识)
       不然，后台怎么知道你要的是哪一个用户的信息
      2. 拿到用户信息后，存储到vuex仓库中
      3.vuex存储的数据不是持久的 只要一刷新数据就会没了，
        所以一打开网页就能显示的那些数据，虽然都是在仓库中拿取的数据，但是我们是在页面的mounted中派发action的
        即使刷新，页面再一次执行mounted 照样可以拿到数据
      4.获取用户信息要带着token去，才可以获取到。假如你把token像往常那种方法存进vuex中，那么刷新一下页面，token没了
        因为我们在home组件中的mounted是没有派发登录的action的,派发登录的action在login的组件内。
        而token是登录后，后台给的。既然home中的mounted没有派发登录action。那自然，即使你登录后，再次刷新页面，token也就没了
        用户信息也就获取不到了(获取用户信息的时候，必须带token发请求)
        如果把token存储到vuex仓库中，那么只要刷新页面，token就没了，用户信息自然就获取不到
        所以，我们要把token持久化储存。即使刷新页面，token也在  
        怎么持久化储存，看day11
2.登录过后，首页获取用户信息的展示
    问题1
        多个组件展示用户信息需要在每一个组件的mounted中派发一个 this.$store.dispatch('getUserInfo')
        不然的话,一刷新页面，除了home组件中的用户信息，其他组件的都会消失
        因为，第一次点击登录后，跳到home组件 我们在home的mounted派发action this.$store.dispatch('getUserInfo')获取用户信息
        这时候vuex仓库内的用户信息还在。header组件拿到用户信息直接动态渲染出来
        无论在home组件还是其他组件，都是可以展示用户信息的(这时token已经永久储存了，这些问题跟token没关系了)
        但是：只要一刷新页面，vuex内的用户信息就没了
        除了home组件还能正常的展示用户信息，其他组件都不行了
        因为其他组件中的mounted没有派发获取用户信息的action
        所以，只要一刷新页面，其他组件的用户信息就没了
        比说：在search组件中，刷新页面后就没用户信息了，除非就像开头说的那样，在search组件内也派发获取用户信息的action
   问题2
        用户登录过后，是不应该有任何机会再跳到登录或者注册页面
        除非用户退出登录
   问题3     
        用户没登录，也是不可以跳转到支付，订单页面，指定跳转到home
        解决:导航守卫
        这几个问题都可以用导航守卫解决      
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
          ------ if(to.path=='/login'||to.path=='/register'){
          |         next('/home')
          |问      }else{
          |题       //当用户登录后想去的不是login和resgiter 
          |一       if(name){//当登录成功之后，有用户信息，直接放行
          |和          next()
          |二      }else{
          |解         try {
          |决        //当登录成功之后，没有用户信息，就再派发一次action，获取用户信息。
          |          //说白了就是，当我登录成功之后，再除了home页面外，其他页面刷只要一刷新，这时用户信息是不是没了(vuex存储的用户信息不持久)
          |          //用户信息没了就派发action呗 是不是可以解决上面的问题1了
          |-------  await store.dispatch("getUserInfo");
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
                // //用户没登录，不可以跳转到支付，订单页面，指定跳转到home
                // if(to.path=='/'){
                //   next('home')
                // }else{
                //   next()//用户没登录,想去的不是购物车页面 放行
                // }
                }
            })



5.现在先做退出登录
    退出登录需要做的事情
    1.需要发请求，通知服务器退出登录
    2.清除项目中的数据 比如说userInfo token
    1.  async loginOut ({commit}){//需要知道请求成功或者失败的结果了 有后续操作 退出成功，得跳到home页面
            let result = await reqloginOut()
            if(result==200){//如果退出成功
            //清空token(本地存储也要清空)和userInfo 但是action里面不能操作state的数据 所以只能提交mutations
            commit('CLEAR')
            return "ok"
            }else{
            return Promise.reject(new Error("faile"))
            }
        }
   2. CLEAR(state){
          state.userinfo="";
          state.token = "";
          removeToken()//清空本地缓存的token
        }

    3. //退出登录
    async loginOut(){
      try {//退出成功，跳到home首页
        await this.$store.dispatch('loginOut');
        this.$router.push('/home')
      } catch (error) {
        alert(error.message)
      }
    }
6.token和uuid重合，以token为大 
    什么意思呢，就是当我们是游客身份的时候添加的购物车
    在登录之后，还能在购物车中有游客身份的时候添加的商品？
    因为token和uuid的身份重合，并且以token为大 
    这时后台搞的，不关我们前端的事情

7.为什么在组件内使用仓库store的时候要就加this.$store 例如：this.$store.dispatch('')
  而在js模块中不用呢  例如:store.dispatch('')呢？
    因为我们在main.js注册store 当我们注册完store的时候，组件实例身上就会多了一个$store属性
    所以在组件内，我们相当于是在实例上拿store 实例上拿东西都是this.xxx
    而在js模块中，没有组件实例
    我们是用过import store from '../store'引入store的
    所以直接store.dispatch('')就行了

8.开发交易页面组件
    1.静态组件
    2.发请求
    3.vuex三连环
    4.动态展示数据

    在交易组件中，有一个收货地址
        现实开发中是  1.添加地址需要发一个请求 携带的参数为(地址，用户姓名，用户电话)
                    2.删除地址也需要发一个请求 携带的参数(后端肯定会给你返回一个地址的id或者其他唯一标识符 )
                   3. 修改地址也需要发一个请求 携带参数(1.有可能没有修改地址的url，直接用添加地址的2.有的话,也是需要携带地址，用户姓名，用户电话 )
                  4.查询地址也需要发一个请求 这个就不用携带参数了
    收货地址必须先登录，才能获取收货地址(的用老师的那个账号和密码才能得到地址)

9.交易页面的动态展示
    发请求，展示交易页面的数据
    



