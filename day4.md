    ref获取真实dom
    比如说我要拿到某个div的真实dom
    1.先用ref打标识 <div class="div" ref="mydom"></div>
    2.获取真实dom  this.$refs.mydom 大标识是ref 获取是refs哦 切记
1.开发floor组件
    1. 第一次v-for在自定义组件身上用
    2.具体细节看floor楼层笔记
        在floor楼层，用到了ref获取真实dom
    3.楼层的最后五张图片遍历不了
        由html结构决定的
        那就用这种方法获取那五张图 recommendList[]数组里面存了五张图
        <img :src="list.recommendList[0]" />
        <img :src="list.recommendList[1]" />
        ...
        <img :src="list.recommendList[4]" />
    4.楼层中的轮播跟listContainer的轮播是一样的 都用到swiper并且结合watch和nectTick
  
2. 封装一个共用的轮播全局组件Carsousel
    前提：js html,css都要一样的
    看上面，既然楼层中的轮播跟listContainer的轮播是一样的 都用到swiper并且结合watch和nectTick
    那就可以把这个轮播封装成一个共用的全局组件

    在Floor ListContainer里面引用这个封装好的组件

3.Search模块的开发
    1.先写静态页面+静态组件拆分
    2.发请求(api)
    3.vuex三连环  发请求获取商品的数据是一个对象 所以vuex的state也要用一个对象来装商品数据,
                  具体怎么看他是数组还是对象呢?发完请求后，打开控制台 选网络后再选fetch/xhr 找到对应的url 再响应那里就能看到了
    4.组件获取仓库数据，动态展示数据
    
    (一.发请求).调用reqgetSearchList({})要传递一个空对象
        ps：
            //这里的params只是一个形参而已
            export const reqgetSearchList = (params)=>requests({url:'/list',method:'post',data:{params}});  
            //真正的实参在调用action这里，
            this.$store.dispatch('getSearchList',{})

         为什么刚开始调用的时候，可以传递空对象呢？
        你看接口文档里面，他那10个参数 是否必选那里，都是n。我们刚开始的时候，还没有办法获取到参数，发起请求。
        所以只能向传一个空对象过去,这样才能拿到商品的数据回来，再做数据渲染。
            const actions={
                async getSearchList({commit},params={}){
                    let result = await reqgetSearchList(params)
                }
            }
        //解析：params={}
        // 通过dispatch调用getSearchList与action的getSearchList对话的时候，如果传递的是一个空对象参数或者没传参数
        那么params就为空对象  如果传了参数，那么params就等于传过来的参数
        然后把params给到reqgetSearchList(params) 也就是说，reqgetSearchList是传空对象参数，还是有值的参数，
        取决于dispatch的与action对话的时候，调用的getSearchList传没传参数

        例子:函数参数里面带这种赋值的参数是什么意思呢?params={}，看下面。
        function fn(name,age=17){ 例如：当我调用fn函数的时候，如果没有传age参数  那就默认age=17  如果传了 那就等于传过来的参数。
                console.log(name+","+age);
            }
            fn("Amy",18);  // Amy,18
            fn("Amy");     // Amy,17

    (二.vuex三连环)
    ps：在项目,工作当中的getters是为了简化仓库中的数据的 
    就是把存储在state里面的，商品数据searchList{}里面有trademarkList[] attrsList[] goodsList[]三个数组
    利用getters简化state里的searchList{}，把searchList{}里的三个数组单独拿出来 拿出来有么好处呢？
    其实就是我们下次想要单独的拿goodsList[]他们这三个数组做数据渲染的时候，就不用每次再这样searchList.goodsList.xxx的拿了，直接goodsList.xxx这样拿
    只需要在getters里面配置一次 state.searchList.goodsList  这样将来在组件里面读取数据就方便了
    怎么拿出来呢？
    ps:其实state和getters的关系类似与 data与computed的关系
    coputed是计算data里面已有的值，来产生新的值  这个值用函数接收，最后return
    所以getters也是这样
 const getters ={
       goodsList(state){ 这个state参数，是自动指向单前仓库中的state小仓库，而不是大仓库里的state
!<---------return state.searchList.goodsList||[] //利用getter拿出searchList里面的goodsList数据  然后把数据作为goodsList函数的返回值
!        }
!    }
!    读取getters里的值和state的方法也不一样
!    读取state是分仓库的，比如home有一个state小仓库  search也有一个state小仓库
!    而getter是不分的，直接读就行
!    1.读取state
!     computed: {
!        ...mapState({ bannerList: (state) => state.home.bannerList }),
!    }
!    2.读取getters
!     computed: {
!        ...mapState(['goodsList']),
!    }
!   
!-------> 为什么要加
        //假如网络不好，或者没网络，searchList的数据还没有回来 没回来就是空对象
        //那我们执行到这一行tate.searchList.goodsList就会报undefined   因为 空对象 {}.xxxx最多就是undefined，还不会报错
         //既然searchList.goodsList已经是undefined了，那我们还拿他去遍历数据，
         比如说拿到goodsList goodsList.xxxx 就会报错,因为undefined.xxx就会报错
         //所以加多一个条件||[]，至少是个空数组  空数组和空对象一样 还不会报错



   
 

