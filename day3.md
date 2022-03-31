1.函数的防抖节流
    防抖：前面的所有触发都被取消，最后一次执行在规定时间之后才会触发，也就是说如果连续快速的触发,只会执行一次
    节流：在规定的间隔时间范围内不会重复触发回调，只有大于这个时间间隔才会触发回调，把频繁触发变为少量触发
    ps：万一哪天 防抖节流搞混淆或者不知道区别的话  就去hbuilder里面打开防抖和节流  打开控制台，疯狂点击 就知道区别了

    插件lodash.js    npm i --save lodash 这个插件里面有封装好的防抖和节流的功能
2.三级联动的一级分类节流
    为什么给三级联动的一级分类节流呢?
    正常情况(用户慢慢的操作)鼠标移入，每一个一级分类，都会触发鼠标进入事件
    非正常情况(用户操作很快)本身的一级分类都应该触发鼠标进入事件，但是实际上是，只有部分一级分类触发了，
    这就是用户操作太快，导致浏览器反应不过来，如果每个鼠标进入事件里面有大量的业务操作，就会造成卡顿，
    所以加个节流的功能

    1.安装lodash插件 npm i --save lodash 不过有时候安装依赖时，已经把lodash安装进去了
    2.在三级联动的组件里引入lodash  
        import _ from 'lodash'，这种是全引入，不推荐  
        最好是按需引入，我们只用到节流功能，就只引入节流
    3.给鼠标移动事件添加节流
          changeIndex:throttle(function(index){
                this.currentIndex = index;
            },50),
    // 使用lodash中封装好的防抖节流方法 不能使用es6的函数书写方式 也不能使用箭头函数   
            // changeIndex(index) {
            //   this.currentIndex = index;  ===>这种es6的书写函数的方式，不可用
            // }
3.三级联动路由跳转分析
    无论是一级、二级还是三级联动，当你点击里面的东西的时候
    都会从当前的Home模块跳转到search模块，并且会把对应的产品(产品的id，产品的名字)传递过去
    我是通过给一、二、三级分类都添加一个点击事件 通过编程式路由导航，把对应的(产品的id，产品的名字)传递过去
    例如:<a  @click="goSearch(c1.categoryName,c1.categoryId)">{{ c1.categoryName }}</a>
    之所以这里是一个a标签 为什么不用<router-link>而是用编程式导航  因为每一个<router-link>其实都是一个组件，
    重复的遍历渲染这个组件会占用内存，造成卡顿
    教程里面是用到了事件委派结合编程式路由导航做的。

4.三级联动组件中的分类功能在home组件显示，在search一开始隐藏，通过鼠标的移入显示，移除又隐藏 
    描述：在home路由组件中，三级联动的分类功能，是直接展示出的
          而在search路由组件中，三级联动的分类功能，一开始是隐藏的，当鼠标移入，分类功能才出现。
    思路：1.给三级联动组件的分类页面加一个标识符 <div class="sort" v-show="show" >
                show的初始值为true  show:true
         2.在mounted钩子里面判断 if( this.$route.path =='/search'){ this.show = false }
            一开始show为true 那么home组件自然就可以显示分类页面 从home组件切换到search组件 
            三级联动组件TypeNav又会再一次渲染到search路由组件页面上，所以又会执行 mounted钩子 
            在钩子里判断出当前路径不是home，而是search。那就会执行if语句 show又变回false 那search组件就不会展示三级联动的分类页面了。
        3.然后再通过鼠标的移入与移除事件来控制search组件三级联动分类的显示与隐藏

5.search组件中三级联动的分类加过渡动画
    过渡动画：前提是组件或者元素务必要有v-if或v-show指令才可以进行过渡动画

6.优化三级联动动态的展示数据
    我们之前是在TypeNav组件中的mouted钩子中,发的请求，获取三级联动的数据
    但是你看上面 我们在home中用到了TypeNav组件，在search中用到了TypeNav组件
    只要切换home或者search 都会渲染TypeNav组件到页面  那TypeNav组件中的mounted就会执行一次，每执行一次就发一起请求
    为了优化：可以把在TypeNav组件中的mouted钩子中,发请求，获取三级联动的数据，写在APP.vue中 因为他只执行一次。又是网站的首页

7.参数合并 query和params 或者query和query合并等等
         在这里做个记号：他这个做参数合并的作用是：二次查找
            比如说我们找到小米手机  那发请求的时候，就把小米传过去
            但是我们想筛选价格在2k-3k的小米手机
            那就把小米 2k-3k合并在一起 发请求的时候一并传过去 这就是参数合并
        我在这里暂时不做这么复杂的功能
       ps： 这里标一个记号，回头有用到再来 (看原项目TypeNav和Header的两个goSearch() 里面就行参数合并)

8.开发Home首页中的ListContainer组件与Floor组件
    在此项目中，我们是使用mock假数据来模拟ListContainer组件与Floor组件返回的数据
    1.安装mock插件 npm install mockjs
    2.把准备好的mock假json数据存进mock
    3.把mock需要的突变放置到public中 ps：public中的文件在打包的时候，会原封不动的，把对应的资源打包到dist文件夹
    4.创建mockserve.js通过mock.js插件实现模拟数据
    5.mockserver.js文件在入口文件中引入import "./mock/mockServer"

9.动态的获取轮播图数据
  在home的小仓库中，用bannerList[]数组来接收请求返回的轮播图数据 为什么是用数组而不是用对象呢? 因为接口返回的就是数组
    思路：1.首先轮播图是一打开页面 就展示出来的 所以请求应该是拥有轮播图的组件ListContainer中的mouted钩子中,发的请求 
        2.又因为我们用到vuex来管理这些数据,所以在mouted中通过dispatch去联系action 在action中发起异步请求,
       3.请求完成之后,获取到轮播图的数据,通过commit去联系mutation,通过mutation把轮播图数据存进state中
      4.(因为在action中，不能直接把轮播图数据存进state,只有mutation才可以修改或者更新state中的数据)
    5.标签里面使用动态的值要用:
      <img :src="banner.imgUrl"/>
      <a>{{banner.imgUrl}}</a>插值语法就直接用

ps：ListContainer组件开发的重点(因为有轮播图)
10.获取轮播图数据后通过swiper插件做轮播图效果
    1.安装swiper插件 cnpm install --save swiper@5 下载5版本的swiper，版本太新可能会有问题
    2.引包,引样式 import Swiper from 'swiper'; import "swiper/css/swiper.css"
    3.先有页面的结构dom，然后才能new Swiper实例
    4.使用swiper 首先里面的html结构不能改动 也就是他里面的类名swiper-container、swiper-wrapper不能改
        其次，先有了这些html结构之后，才能new swiper实例 才能产生轮播效果

11.为什么使用nextTick在完成轮播图效果呢?
    1.首先说一说mounted生命周期   他是在组件挂载完毕之后触发的一个钩子 
    正常来说这时候组件结构(dom)已经有了  但是他只是局限于组件的静态结构，像是需要发请求，动态渲染的结构，这时还没有回来，还没有渲染到页面上(因为他涉及到ajax异步)
    所以在这个mounted里面new swiper实例是不正确的
    2.那你可能会想到updata钩子，他是数据更新后调用的一个生命周期 ，也就是无论静态还是动态的结构，肯定是更新完毕之后，才会执行这个钩子吧
    总该可以在这个钩子里new swiper实例了吧? 不行，因为我们这个页面不单单只有动态的轮播图数据吧，有可能有其他需要发请求获取，然后动态的渲染到页面的结构
    只要我们修改了其他的动态数据，那么就是更新了数据，只要更新了数据，就会触发updata这个钩子，那不就等于又new了一个swiper实例了嘛？
    那就是重复的new swipwe实例 这样也是不正确的。
    3.那new swiper实例要放在哪里呢？
        1.bannerList刚开始是空的数组 当数据回来之后 bannerList就变为有数据的数组 那么watch就能监听到 因为数据改变了嘛
        只要监听bannerList就行了  由空数组变为数组里面有元素
        2.watch是监听bannerList的变化的  在watch中，你顶多只能保证 bannerList数据已经回来了，
        但是你不能保证，回来的数据也就渲染到页面上了，也就是说页面不一定渲染了结构  
         //一个关于watch的简写，当配置项当中，只有handler配置，没有deep或者immdeiate的时候才能简写
        3.最完美的解决方案
            watch结合nextTick
            nextTick: 当dom更新完毕，循环结束之后，再回来执行nextTick里的回调。
            比如：当修改某个数据，你想要马上获取更新后的dom，你就可以通过nextTick获取更新后的dom，在nextTick里面执行这个相应的回调
                watch: {
                    bannerList: {
                    handler(newValue, oldValue) {
                        this.$nextTick(() => {
                        new Swiper(".swiper-container", {  //这个swiper-container就是对应我们上面说的
                                                            里面的html结构不能改动 也就是他里面的类名swiper-container、swiper-wrapper不能改
                            loop: true, // 循环模式选项
                            pagination: {// 如果需要分页器
                            el: ".swiper-pagination",
                            clickable :true, //分页器功能  默认为不写，也就是默认为false
                            },
                            navigation: {// 如果需要前进后退按钮
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                            },
                        });
                        });
                    },
                    },
                },

12.nextTick：可以保证页面中的结构一定是有的，经常和很多插件一起使用。(很多插件都需要dom已经存在了才能用)
