该项目用到的插件、样式
1.安装less   npm install less less-loader@5 --save-dev
2.reset.css  这个是取消HTML标签在浏览器里有默认的样式的
3.nprogress插件 cnpm install --save nprogress 进度条插件
4. lodash插件    npm i --save lodash 这个插件里面有封装好的防抖和节流的功能
5.mock插件 npm install mockjs
6.swiper插件 cnpm install --save swiper@5 这个插件是关于轮播，分页，滑动的插件(移动端，pc端都适用)
    在写静态页面的时候，也可以用到swiper插件的轮播，分页，滑动的组件

7.qrcode二维码插件
    1.npm i qrcode
    2.import QRCode from 'qrcode'

8.表单验证插件
    vee-validate
    1.npm i vee-validate@2 --save
    2.引入

.图片懒加载
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

7.
    如何使用element-ui组件库
    第一步：npm i element-ui -S(无论是按需引入还是全局引入，都需要)
    第二步：完整引入
            在main.js中引入element-ui和样式
            import ElementUI from 'element-ui';
            import 'element-ui/lib/theme-chalk/index.css';
            Vue.use(ElementUI);
            
    第三步：按需引入 比如：要引入的是button
             在.babelrc文件下，添加这一行
              "plugins": [
                    [
                    "component",
                    {
                        "libraryName": "element-ui",
                        "styleLibraryName": "theme-chalk"
                    }
                    ]
                ]
    第四步：按需引入 import { Button= } from 'element-ui';
                Vue.use(Button)或者Vue.component(Button.name, Button);
                或者Vue.prototype.$msgbox = MessageBox;
                    Vue.prototype.$alert = MessageBox.alert;
    第五步：按需引入 使用
            <el-row>
                 <el-button disabled>默认按钮</el-button>
            </el-row>
    第六步：要想修改element ui的样式 先打开控制台 找到对象的类名
            然后再类名前面就加/deep/，才能修改样式
                比如：找到的类名是.el-pager li
                /deep/.el-pager li{
                        width: 40px;
                    }

8.有一个问题必须想明白：
            ______________________
    比如说：|______________|_搜索_|
    有一个搜索框 然后旁边有个搜索按钮 给搜索按钮绑定一个回调函数
            只要点击这个搜索按钮，就会把搜索框里面的内容作为参数，向后台发起请求

            就好像：你在搜索框输入华为 然后点击旁边的搜索按钮
            然后就带着华为这个参数向后台发请求。

            思路是对的 没错
            但是我发请求的那个回调函数 不一定是绑定在搜索按钮上把?
        
            <button @click="event">搜索</button>
            methods:{
                event(){
                    axios({
                    url:"/xxx",
                    method:'get',
                    data:{'华为'}
                    })    
                }
            }------->我不一定要这样写把？虽然这样写也没错

            但是假如说
            我把搜索框封装成一个<button>组件 
            然后再这个search页面上引入 <button></button>
            这样我搜索的这个按钮在组件<button>里面，我要怎么在这个页面是点击这个搜索呢？
            点不到对吧，她在<button>里面呢 
            我总不能把发请求的回调  写在封装<button>的这个组件里面吧 请求回来的数据可是要在我这个search页面展示的
            其实我们可以这样  因为我们在封装好的<button>的这个组件上，点击搜索，势必会路由跳转到search页面 那我们就给这个收索按钮绑定一个编程式路由导航
            我们只要在<button>组件上，把搜索框里面的内容(华为)，作为路由跳转参数
            传到search这个页面
            那我们在search这个页面拿到参数了，
            在search的mounted发请求，
            这样又有一个问题，search的mounted只挂载一次
            我每次搜索不同的内容 就要发一次请求 
            所以这个请求不能写在mounted里面
            可以这样 把这个回调封装为一个方法
            mounted(){
            this.getData()
            },
            methods:{
                getData(){
                this.$store.dispatch('getSearchList',{})
            },
            这样一上来打开页面，当我们还没有搜索商品的时候，也能够保证，在mounted里面能发请求，获取到刚打开的面的数据
            当我们再次搜索商品的时候，再调用methods里面的getData()方法就行了。
            

9.消除day5 search组件的疑点
    我从home组件跳转到search组件 那search组件就会被渲染出来 mounted会执行一次
    那我从search组件再次跳会search组件 search组价中的mounted还会在执行一次嘛？答案是不会了。
    但是，我从search组件又跳回search组件 如果路由参数改变的话 search组件当前的路由路径中的参数也是会跟着改变的
    比如：原本search路由的路径是 /search/id=3
    this.$router.push({name:"search"}) 自己跳自己 什么参数都不带 那当前路由参数的路径变为 /search

10.Object.assign
      Object.assign是合并对象属性的 把后面的几个属性合并到第一个 如果后面对象和第一个对象属性名一样 就用后面的那个
    比如说:searchParams:{
        category1Id:"",//一级分类id
        category2Id:"",//二级分类id
        category3Id: "",//三级分类id
        categoryName: "",//分类名字
        keyword: "",//搜索关键字
        order: "1:desc",//排序
        pageNo: 1,//分页器用的，代表的是当前是第几页
        pageSize: 10,//分页器用的，代表每一页展示多少数据
        props: [],//平台售卖属性操作带的参数
        trademark: ""//品牌
      }
      this.$route.query //当前路由组件有query参数： categoryName: "111"
      this.$route.params //当前路由组件有params参数： keyword: "222"
      那么Object.assign(this.searchParams,this.$route.query,this.$route.params)
      searchParams就等于:{
          category1Id:"",//一级分类id
        category2Id:"",//二级分类id
        category3Id: "",//三级分类id
        categoryName: "111",//分类名字
        keyword: "222",//搜索关键字
        order: "1:desc",//排序
        pageNo: 1,//分页器用的，代表的是当前是第几页
        pageSize: 10,//分页器用的，代表每一页展示多少数据
        props: [],//平台售卖属性操作带的参数
        trademark: ""//品牌
      }
11.对象绑定的几种写法
<div class="item " v-for="(c1,index) in categoryList" :key="c1.categoryId" @mouseenter="changeIndex(index)" 
            :class="{cur:currentIndex == index}">

<span v-show="isTwo" class="iconfont"
            :class="{ 'icon-UP': isAsc, 'icon-DOWN': isDesc }">

<div class="item-list clearfix" 
            :style="{display:currentIndex == index?'block':'none'}">


12.可以把路由配置里面的routes里面的东西单独拎出来，封装为一个js文件
    然后在router.js里引入一下
13.路由的滚动行为
    scrollBehavior(to, from, savedPosition) {
    // 路由跳转到另一个页面后，代表滚动条在最上方
    return { y:0 }
    他跟routes平级
    export default new  VueRouter({
   routes,
   scrollBehavior(to, from, savedPosition) {
    // 路由跳转到另一个页面后，代表滚动条在最上方
    return { y:0 }
  },
})
14.切换高亮效果的几种方法

15.： trademark: ""  往一个空字符串 里添加字符 trademark= `${trademark.tmId}:${trademark.tmName}` 利用模板字符串解析{}里的值
    props: []     往一个空数组 里添加字符  let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
                                                props.push(props);  数组不可以像字符那样直接添加   
16.放大镜
      <div class="event" @mousemove="handler"></div> 
    <!-- 这个big是放大后的那个图片 -->
    <div class="big">
      <img :src="imgs.imgUrl" ref="big"/>
    </div>
    <!-- 这个是鼠标放上去就变为绿色div的遮罩层 -->
    <div class="mask" ref="mask"></div>

    // event代表当前事件
        // 给handler绑定一个鼠标移动事件 @mousemove="handler"
        // 那么event.offsetX代表鼠标移动时的x坐标 event.offsetY y坐标
        // 鼠标在内层div，mask的中心又mask的宽和高是最外层div的一半
        //约束范围 鼠标不能出最外层的div
      let mask = this.$refs.mask;
      let big = this.$refs.big;
      let left = event.offsetX - mask.offsetWidth/2;
      let top = event.offsetY - mask.offsetHeight/2;
      // left和right是mask这个div最左边和最右边的坐标
      if(left <=0) left = 0; //限制鼠标不能向左移出界限
      if(left >=mask.offsetWidth) left = mask.offsetWidth; //限制鼠标不能向右移出界限
                              //因为最外层范围的div是内层宽度2倍  只要内层div的左坐标不大于它本身的宽度
                              // 就能保证他右边不出界线
      if(top<=0)top = 0;//限制鼠标不能向上移出界限
      if(top>=mask.offsetHeight) top = mask.offsetHeight; // 同理右界限，外层div高度是内存2倍
      
       //修改元素的left|top属性值
      mask.style.left = left+'px';
      mask.style.top = top +'px';
      //因为鼠标上移的时候，放大的图片就会向下移动(放大的图片跟鼠标移动相反，又放大的图片是
      //mask内的2倍，所以*-2)
      big.style.left = - 2 * left+'px';
      big.style.top = -2 * top +'px';

16. 存储
    1.本地存储localstorage, 持久化--只能存储5m
    2.会话存储sessionstorage 并非持久化 浏览器关闭数据就没了
    存储数据的时候，无论是本地存储还是会话存储 都只能存字符串  所以，在存对象的时候，要把他转化为字符串的格式  对象-->字符串用 JSON.stringify
    拿去存储数据的时候，拿的是字符串，因为你存的时候也只能存字符串嘛  但是我们要拿字符串里的数据太麻烦了，所以要把他转化为对象  字符串-->对象 用JSON.parse
    3.注意，存是以key：value存储的 取只要key
    localStorage.setItem('TOKEN',token)
    localStorage.getItem('TOKEN')
    清空本地缓存
    localStorage.removeItem("TOKEN") 
17.<router-link>跳转路由的时候
    1.如果还静态路由，就是路由参数是已经确定的，不是动态的to:'/search'
    2.如果是动态路由:to:"`/search/${xxx.xxx}`"

18.为什么在组件内用dispatch派发action，还要用async 和await
    (说白了，如果请求后，有后续操作的话，成功的后续操作用try捕获
    失败的后续操作用catch捕获 用到try catch就必须用async 和await，
    所以组件内用dispatch派发action，还要用async 和await主要看
    需不需要成功和失败的结果。毕竟有后续操作才需要成功或失败的结果嘛
    )
    1.首先，我平时发的请求都是属于那种，发请求，从后端获取数据。
    组件中拿到数据，做数据渲染。
    在组件中，我是不是不需要说，请求成功了后，要做什么逻辑，请求失败了，我又要做什么逻辑
    我就单纯是 成功了渲染数据，失败了渲染不出来。
    2.那如果我在组件中需要说  请求成功了，我要做xxxx逻辑，失败做xxxx逻辑。就要在派发action中加async await
    3.    1.首先，async函数返回的是一个promise (只要是promise 都有一个成功或者失败的结果)
        2.其次，await后面接的是一个 return的promise 他在等待 这个return的promise给他返回 一个成功或者失败的结果
        3.dispatch('AddOrUpdateShopCart')AddOrUpdateShopCart是用async声明的函数  async函数返回的是一个promise
         只要是返回一个promsie 就可以用await 来等待他返回的是成功的结果还是失败的结果
         所以 await this.$store.dispatch('AddOrUpdateShopCart',{skuId:this.$route.params.skuId,skuNum:this.num})
    4.成功用try捕获，失败用catch
 举例：
这是组件内需要，请求成功或失败后做xxx逻辑的
    (你看他是不是成功后需要跳转路由  如果我不用async await我怎么知道请求成功还是失败)
    vuex中:
        async AddOrUpdateShopCart ({commit},{skuId,skuNum}){
            let result = await reqAddOrUpdateShopCart (skuId,skuNum)
            if(result.code == 200) //请求成功
            return "添加成功" //只要返回一个非空字符串就算成功
            else{//请求失败
            return Promise.reject(new Error("faile"));
            }
        },
        };
    组件中：
        async addShopCart(){
         try {
            await this.$store.dispatch('AddOrUpdateShopCart',{skuId:this.$route.params.skuId,skuNum:this.num})
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
这是组件内不需要，请求成功或失败后做xxx逻辑的(就单纯的渲染一下数据)
    vuex中:
        async getGoodInfo({ commit }, skuId) {
            let result = await reqGoodsInfo(skuId);
            if (result.code == 200) {
            commit("GETGOODINFO", result.data);
            }
        },

    组件中：
    mounted() {
     this.getdata()
    },
    methods:{
        this.$store.dispatch("getGoodInfo", this.$route.params.skuId);
    }
19.input框输入的值可以通过$event.target.value获得
    input框勾选状态可以用过 $event.target.checked获得  勾选$event.target.checked的值为true 不勾选为false

20.传递参数的时候
    1.如果是这样传 (skuId,skuNum)就不用加{}
    2.这样传才要加{skuId：xxx.skuId,skuNum:this.skuNum}
    传的时候加{}  你介绍参数的时候也要加{}

21.Promsie.all  Promise.all的P是大写的哈 注意一下
    Promsie.all[arr]或者promsie.all(p1,p2,p3)
    只有Promsie.all里面所有的值都为true 才会返回成功
    Promsie.all里面所有的元素都是一个promise 
    
22.在action中,可以接收一个参数叫context 
    他里面包含有commit【提交mutations修改state】 getters【计算属性】 dispatch【派发action】 state【当前仓库数据】
    只是我们平时只是用到 commit
    const action ={//全部写出来是这样的
        xxx({commit,getter,dispatch,state})
    }
23.assets文件架---放置全部组件共用静态资源
    在引入中@相当于src的别名 @/xxx 等于src文件下的xxx
    在样式中也可以用@ 不过要加个~

24.input框里面的值也可以绑定动态:value="cart.skuNum"

25.phone && this.$store.dispatch('getcode',phone)
        &&且的意思  只有前面的phone为true 才执行后面的this.$store.dispatch('getcode',phone) 否则不执行

26.
 如果说后端接口中，路径没有带参数，url中就不用加 而发请求需要用到参数 ，直接把参数写在data里面
    export const reqregisteruser = (params)=>requests({url:`/user/passport/register`,data:params,method:'post'})
如果说路劲中有参数，那就加上去
    export const reqgetcode = (phone)=>requests({url:`/user/passport/sendCode/${phone}`,method:'get'})

27.ps：vuex存储数据不持久化
28.blur:失去焦点--->点击空白的地方
change:文本需要有变化，而且还需要点击空白的地方
input:只要文本发生变化立马执行【不许点击空白的地方】

28.空对象，空数组进入if判断 永远为真
null、undefined、NaN、+0、-0、""，这六种转换成布尔类型是false，其余都是true

29.Array.filter和Array.find区别
find只返回第一个符合条件的结果以对象的形式，而filter把符合条件的返回成一个数组


//引入同一接口api文件里面全部的请求函数
import *as API from './api';


图片和mock没发对外暴露，直接引入即可



30.
<template>
  <el-button type="text" @click="open">点击打开 Message Box</el-button>
</template>

<script>
  export default {
    methods: {
      open() {
        this.$alert('<strong>这是 <i>HTML</i> 片段</strong>', 'HTML 片段', {
          dangerouslyUseHTMLString: true
        });
      }
    }
  }

我结构这里不一样要跟他一样
 <button @click="open">点我</ button >这样也能用

 31.图片懒加载
    用到插件vue-lazyload
    1.npm i vue-lazyload
    2.
    

32.表单验证插件
vee-validate
1.npm i vee-validate@2 --save
2.这回就不去main.js引入了
  练习把他封装成一个插件模块(Pligins)
   最后再去main.js引入一下




1.先提交，写提交内容
2.推送

 