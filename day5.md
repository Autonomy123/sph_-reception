1.search组件的子组件searchSelect
    动态展示searchSelect数据
2.search模块 根据不同参数，获取不同的数据
   
   1.
    在search组件中，我们本来是直接把请求
    this.$store.dispatch('getSearchList',{})放在mounted钩子里面的
    因为我们一打开search页面，肯定要展示商品数据的，所以我们要用到mounted钩子来发请求 
    获取商品数据
    但是你有没有想过，我们只要点击分类，比如说你点击了个手机分类 那肯定又要重新发请求，
    然后页面展示手机相关的数据 再比如，你在搜索框输入华为，那么页面肯定是要展示华为相关的数据。所以说发请求获取商品数据不应该放在mounted里面，(因为在整个组件中，mounted钩子只执行一次)但是我们要发多次请求。
    那么我们可以这样做:
    mounted(){
     this.getData()
    },
    methods:{
        getData(){
        this.$store.dispatch('getSearchList',{})
    },
    这样一上来打开页面，当我们还没有点击分类或者搜索商品的时候，也能够保证，在mounted里面能发请求，获取到刚打开的面的数据
    当我们点击分类或者搜索商品的时候，再调用methods里面的getData()方法就行了。
   2. 
    我们用searchParams对象来接收这些参数 
    为什么要在beforeMount()里面整理参数呢？
    首先,在发请求之前给服务器之前，这些参数searchParams我们要拿到
    无论是参数发生变化，或者是参数从没有变为有值。都需要带给服务器
    我们是通过mounted里调用this.getData发请求的 所以要在mounted前整理好参数
    beforeMount(){
        //发请求之前整理参数，带给服务器 
        Object.assign(this.searchParams,this.$route.query,this.$route.params)
     },
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

    无论我们点击的是分类中的手机  或者在搜索框输入 华为等等
     这些都是不同的参数，我们要根据这些参数来重新发请求
     获取不同的页面数据
     三级分类的参数以及及输入框的参数，是由路由跳转的时候传递过来的
     所以只要路由的地址发生改变，我们就可以知道参数改变了
     参数一改变，就重新发请求。
     有一点要注意，重新发请求前把参数再整理一遍

3.面包屑处理分类
    1.面包屑的是否展示分类是根据categoryName展示的
    categoryName是由前面，三级联动的组件路由跳转到search组件时，通过query传递过来的参数
    而在前面 searchParams还把当前组件的query和params参数合并了
    所以只要判断searchParams是否有categoryName 有就展示
    2.至于点击 x 面包屑消失 并且当前路由的路径中的categoryName也没了
    
            <li class="with-x"  v-show="searchParams.categoryName">{{searchParams.categoryName}}
                <i @click="removeCategoryName">×</i>
            </li>

             removeCategoryName(){
                this.searchParams.categoryName = ''
                this.$router.push({name:'search'})
                },
        search组件又跳回search组件 如果路由参数改变的话 search组件当前的路由路径中的参数也是会跟着改变的
        比如：原本search路由的路径是 /search/categoryName=xxx
        this.$router.push({name:"search"}) 自己跳自己 什么参数都不带 那当前路由参数的路径变为 /search
4.面包屑处理关键字
   1. 面包屑除了展示分类，还展示关键字
    关键字的展示跟上面的一样
    判断searchParams有无keyword
   2. 至于点击 x 面包屑消失 
    需要的是把input输入框里面的值去掉
    就是我点击x不但我面包屑里面的关键字没有了，就连input框里面的关键字也没有了
    那就要从当前search组件 把keyword:{} 这个参数传给 Header组件(以为input框在Header里面) 让input框v-model的值也变为空
   3.search组件和header组件之间是兄弟关系
        兄弟组件之间传值用全局事件总线
            1.在main.js里面配置 
            beforeCreate(){
                Vue.prototype.$bus =this
                }
            2.接收数据的Header组件
             methods(){
                demo(data){......}
            }
            mounted() {
                this.$bus.$on('xxxx',this.demo)
            }
            3.提供数据的search组件：this.$bus.$emit('xxxx',数据)

    4.跟面包屑分类一样,也要把路由的路径中的keyword也删掉了
    套路和他一样，路由自己跳自己,啥参数都不带
    this.$router.push({name:"search"})

5.面包屑处理品牌
    1.面包屑除了展示分类，关键字,还展示品牌
    品牌的数据在searchSelect子组件中，
    我们要把品牌的数据传给search组件   子给父传值 自定义事件
    关键字的展示跟上面的一样
    
    2.判断searchParams有无trademark 有就展示。
        1.<Demo @atguigu="test"/>需要数据的search组件

        2.this.$emit('atguigu',数据)提供数据的searchSelect组件
    看接口文档，发请求的时候，trademark参数要求格式是："trademark": "4:小米"
    所以我们也要整成跟他一样的格式

    3.面包屑的位置展示完品牌之后，还需要重新发请求，展示该品牌的数据
    所以在自定义回调事件中，获取完trademark，并且整理好后，还需要重新发请求
     //自定义事件获取trademark
    gettrademark(trademark){
      //trademark参数要求格式是："trademark": "4:小米"
      this.searchParams.trademark= `${trademark.tmId}:${trademark.tmName}`
      this.getData()
    },
    4.截取 trademark trademark数组等于 ["4:小米"] trademark=["4:小米"] 等同于 trademark=['4',':','小','米']
    我们要展示最后两个字符 用到slice(2,4)
    <li class="with-x"  v-show="searchParams.trademark">{{searchParams.trademark.slice(2,4)}}
     