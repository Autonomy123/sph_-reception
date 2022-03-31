1.三级联动组件  <TypeNav></TypeNav>
    //在main.js里面注册全局组件：第一个参数 组件名字  第二个参数：那个组件
    Vue.component(TypeNav.name,TypeNav)
    全局组件和局部组件的区别：
    1.全局组件在共有的main.js里面注册 步骤1. import xxx from xxx 2.Vue.component(xxx.name,xxx) 
    然后在需要用到该组件的地方 <TypeNav></TypeNav>直接引入，不需要再component:{ TypeNav} 映射
    2.局部组件在需要用到该组件的地方注册  步骤1.import xxx from xxx 2.在component:{xxxx}映射一下

2.测试接口 postman 

3.axios二次封装
    为什么需要二次封装axios(主要是加上请求拦截和响应拦截)
    请求拦截器：在点击发送请求的那一刻(所有的请求)，这个请求拦截器会先检测到，然后再发请求，那样的话就可以在请求拦截器里面做一些请求发出去之前的动作
    响应拦截器：当服务器数据返回后，响应拦截器会检测到，可以数据回来后做一些事情
    在项目当中经常是api文件夹下的axios  在这里我们是api下的ajax

4.接口统一 管理
    项目很小 可以在组价的生命周期函数里面发请求
    项目很大 封装一个统一的api请求管理

5.跨域问题
    什么是跨域? 出现协议，域名，端口号不同的请求，称之为跨域
        前端项目的本地服务器 端口号是:http://localhost:8080/ 
        后端项目的本地服务器(看接口文档)是http://39.98.123.211  
        他们两者虽然协议相同(都为http)但是域名跟端口号都不同
         解决：
             jsonp ,cros ,配置代理(利用webpack的proxy的配置代理)
            怎么做配置代理呢?
            在webpack.config.js文件或者vue.config.js文件下做配置代理(如果找不到webpack.config.js就找vue.config.js 两者其实是一样的)
        在配置代理中有一个配置项叫做:pathRewrite: { '^/api': '' }  他是重写url路径的 就是去掉路径中的api
        什么意思呢,在接口中，
        如果接口是这样的 http://39.98.123.211/api/user/passport/login 那我们肯定就要保留这个api拉，
        就得把这个pathRewrite: { '^/api': '' } 去掉  
        如果接口是这样的 http://39.98.123.211/user/passport/login 那就要去掉这个api
        pathRewrite: { '^/api': '' }就得保留

6.nprogress进度条插件的使用
    这个进度条是干嘛用的呢? 当我们发起请求 数据还没有回来之前 就显示这个nprogress进度条 当数据返回之后，进度条消失
    这个插件里面有两个方法 第一个是nprogress.start()进度条开始  第二个是nprogress.done()进度条结束
    所以可以在请求拦截器里面添加nprogress.start()方法  在响应拦截器里面添加nprogress.done()方法
    怎么使用?
    1.先安装这个插件 cnpm install --save nprogress
    2.在封装拦截器的文件下 //引入进度条插件 import nprogress from "nprogress";
                        //引入进度条插件的样式 import "nprogress/nprogress.css (进度条的颜色也可以改 在下载的插件包node_modules/nprogress/nprogress.css下改颜色)
    3.在请求拦截器里面添加nprogress.start()方法  在响应拦截器里面添加nprogress.done()方法

7.vuex
    vuex是什么?它是vue官网提供的一个插件  
    安装vuex cnpm install --save vuex
    它是一个状态管理库 ，集中式管理项目中组件共用的数据
    当我们注册完store的时候，组件实例身上就会多了一个$store属性

8.vuex的基本使用
    1.state 仓库存储数据耷地方
    const state = {};
    2.mutation 修改，更新state的唯一手段
    const mutations = {};
    3.可以书写自己的业务逻辑(不能修改state ,但是可以在actions里面提交mutation，通过mutation修改state)，也可以处理异步
    const actions = {};
    4.类似与computer属性 用来计算state里面的数据 
    const getters = {};

    5.当我们注册完store的时候，组件实例身上就会多了一个$store属性

    ps:state里面的起始值是数组还是对象  取决于请求返回的数据  请求返回的数据是数组，就用数组来接收。返回来的是对象，就用对象来接收

9.四个map
  ...mapState()和...mapGetter()写在computed里面  因为他是借助computed映射数据的
  ...mapAction()和...mapMutation()写在methods里面 因为他是借助methods与Action与Mutation对话的
  1...mapState数组写法 ...mapState(['categoryList'])
              对象写法1. ...mapState({categoryList:'categoryList'})
              对象写法2. ...mapState({//对象写法右侧是函数的时候 state是大仓库，我们要的是大仓库中的home小仓库模块中的categoryList
                                        categoryList:state=>state.home.categoryList
                                })

            两种对象写法的区别：对象写法1不能准确到大仓库中的某个小仓库  对象写法2可以

10.vuex模块化开发
    把一个大的vuex拆分为几个组件模块的小仓库，
    在store文件下的主vuex里面引入小仓库
    然后再modules里面注册相应的小仓库
    modules:{
        home,
        search
    }
    这样每个模块都有属于自己的小仓库 不用全部都丢到一个仓库中


11.动态展示三级联动
    在home的小仓库中，用categoryList[]数组来接收请求返回的三级联动数据 为什么是用数组而不是用对象呢? 因为接口返回的就是数组
    思路：1.首先三级联动的数据是一打开页面 就展示出来的 所以请求应该是在三级联动的组件TypeNav中的mouted钩子中,发的请求 
        2.又因为我们用到vuex来管理这些数据,所以在mouted中通过dispatch去联系action 在action中发起异步请求,
       3.请求完成之后,获取到三级联动的数据,通过commit去联系mutation,通过mutation把三级联动数据存进state中
      4.(因为在action中，不能直接把三级联动数据存进state,只有mutation才可以修改或者更新state中的数据)
    优化:在这里我们把组件TypeNav中在mouted钩子中,发的请求放在APP.vue中  至于为什么看day3

12.动态的完成三级联动中(一级分类)的动态背景颜色
    1.可以通过css样式动态的添加背景颜色 (通过css样式的 当鼠标移上的时候,css触发:hover 然后在:hover{bgc:xxx} 来完成)
    2.通过js解决
 (一)鼠标移入动态添加背景颜色 思路： 
    第一步：//在data里存储用户鼠标正在移上的那个一级分类    
        data() {
            return {
            currentIndex:-1
            }
        },
      // 为什么是currentIndex:-1呢？ 因为我们的三级联动的一级分类(一二三级分类都是)用数组来接收，然后遍历出来的，
      //那数组的第一个值的索引为0 如果我们的currentIndex:0的话 那就代表用户的鼠标还没动呢，鼠标就自己停留在一级分类的第一个元素上。
      //我们要的是一上来 用户的鼠标是谁都没有移上。  初始值为-1那就代表谁都没有移上
    第二步：给一级分类元素绑定鼠标移动事件(不要鼠标移入事件，想要点击事件就绑定@click)
        <div class="item " v-for="(c1,index) in categoryList" :key="c1.categoryId" @mouseenter="changeIndex(index)">
        //鼠标移上哪一个元素 就把那个元素的索引值传过去  (索引值怎么来的呢？v-for遍历三级联动数组的时候，产生的索引)
    第三步：methods:{
        changeIndex(index){
             // 鼠标移入后 拿到传过来的某个一级分类的索引，赋值给currentIndex  
             //比如说 鼠标移动到一级分类的第五个元素上  那就把索引4传过来，赋值给currentIndex=4 那就代表,现在鼠标正停留在一级分类的第五个元素上
              this.currentIndex = index;
        }
    }
    第四步：在需要动态添加背景颜色的那个一级分类上 动态的添加一个class 这个class是控制背景颜色的
            当鼠标正停留的时候的索引值  ==  数组遍历产生的索引值 就添加这个class 
            currentIndex == index其实意思就是 当鼠标移上谁，谁就动态的添加cur这个控制背景颜色的类
            <div class="item " v-for="(c1,index) in categoryList" :key="c1.categoryId" @mouseenter="changeIndex(index)" 
            :class="{cur:currentIndex == index}">
 (二)鼠标移除取消三级联动一级分类背景颜色 思路：(这里还用到了事件委派，虽然用处不大，但是可以让我们了解什么是事件委派)
        当存储用户鼠标正移上的那个一级分类:currentIndex =-1时，-1那就代表鼠标谁都没有移上,谁都没移上那自然就没有背景颜色了

13.三级联动中 二三级分类的显示与隐藏
    1.可以通过css样式来控制显示与隐藏 原本二三级分类是display:none的 当鼠标移动上去的时候，触发css的:hover 然后在:hover{display:block}来完成  鼠标移走，那他有恢复原来的display:none
    2.通过js来完成
         <div class="item-list clearfix" :style="{display:currentIndex == index?'block':'none'}">


