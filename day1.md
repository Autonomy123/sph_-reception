1.项目运行的时候，让浏览器自动打开
   在package.json "serve": "vue-cli-service serve --open",  加个--open

2.关闭eslint的校验给关闭掉
   没有vue.config.js文件的话  就创建一个 有的话 就加一句 lintOnSave:false
   在package.json或者.eslintrc.js中找到  eslintConfig  块，在其rules下加入"no-unused-vars": "off"即可

3.安装less   npm install less less-loader@5 --save-dev

4.引用reset.css  这个是取消HTML标签在浏览器里有默认的样式的

5.路由组件的搭建 ：home Search Login Register
   1.安装路由 cnpm  install  --save vue-router@3.5.2
   2.$router: 一般获取路由信息【路径，query和params参数等等】
   3.$router:一般进行编程式导航进行路由跳转【push，replace】
   4.注册完路由 不管是路由组件 还是非路由组件身上都有$route $router属性
   5.{ //重定向，在项目跑起来的时候，访问/, 立马让他定向到首页
            path:'/',
            redirect:"/Home"
     }
   6.路由的跳转 登录 注册 logo都是router-link跳转，编译为a标签  搜索按钮为编程式跳转 

6.Footer组件的显示与隐藏 v-if(操作dom) v-show(操作样式)
   Footer组件:在Home，Search显示Footer组件
   Footer组件:在Login，Register时隐藏Footer组件
   有2种方法可以来显示隐藏Footer
      1.可以通过组件上的$route获取当前路由路径 通过路径控制显示隐藏
      <Footer v-show="$route.path=='/home'||$route.path=='/search'"></Footer>
      2.(推荐) 在需要显示Footer的路由里配置一个路由元信息 meta:{show:true} 不需要的配置为meta:{show:false}
      然后在<Footer v-show='$route.meta.show'></Footer>通过show的布尔值来控制显示隐藏

7.路由传参
   1.路由跳转的几种方式:
      1.router-link
      2.编程式路由导航：
   2.路由传递参数的几种方式
      query和params传参数  params传参的key值不会出现在url中,所以需要在路由的路径配置中,配置key的占位
      传参的几种方式：query?后面是参数  params/后面是参数
      ps：在这里我们把keyword作为params传参  keyword2作为query传参
      1.字符串传参 this.$router.push("/search/"+ this.keyword+"?keyword2="+this.keyword.toUpperCase())
      2.模板字符串传参 this.$router.push(`/search/${this.keyword}?keyword2=${this.keyword.toUpperCase()}`)
      3.(最常用)对象传参  对象写法中，params传参不能结合path使用，只能结合name一起使用
      this.$router.push({
            name:'search',
            params:{
               keyword:this.keyword
            },
            query:{
               keyword2:this.keyword.toUpperCase()
            }
      }) 

8.路由传参的面试题
   1.前面我们已经知道  如果要用params传参  就得先去配置路由的路径里，把参数的key配置一个占位
   但是配置了占位之后，也可以指定不传递这个params参数，这时候就要在占位后面加一个?  如果不加? url的地址就会错误显示
    path:"/search/:id?"  加个?代表可传 可不传

   2.我们已经知道params配置了占位之后 可传可不传 但是传的时候  如果传的是空字符'' 也会出现url的地址错误显示
    所以我们明确要传空字符''的话  就要在传递空字符的参数后面使用undefined解决
     this.$router.push({
            name:'search',
            params:{
               keyword:this.keyword||undefined
            },
      }) 
   3.目前我们只是知道 props可以用来接收路由传递过来的参数（用来接收参数的）
     但是，路由组件能不能传递props数据呢? 是可以的 这个我们知道就行 项目中遇到的话 我们再去百度一手（他一般会以函数的写法传递）

9.push方法 和replace方法的重写
   编程式路由跳转到当前路由(只要参数不变)，多次执行会抛出NavigationDuplicated的警告错误?
      路由跳转有两种方式：声明式导航,编程式导航
      声明式导航没有这类问题，因为vue-router底层已经处理好了
      只有编程式路由导航才有这类问题，为什么编程式路由跳转的时候，就有这种警告错误?
      通过给push方法传递相应的成功，失败的回调函数，可以捕获当前错误，可以解决。
      goSearch() {
         this.$router.push({
               name:"search",
               params:{
                  keyword:this.keyword
               },
               query:{
                  keyword2:this.keyword.toUpperCase()
               }
         },()=>{},()=>{}) // 添加一个空的 成功和失败的回调，可以捕获到当前错误，可以解决。
      }
   },
   这种写法指标不治本，将来在别的组件中用push和replace，编程式导航还是有类似的错误
   最直接的办法是在配置路由那里，重写VueRouter.prototype原型对象身上的push|replace方法