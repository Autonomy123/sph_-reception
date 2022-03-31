把路由配置里面的routes里面的东西单独拎出来，封装为一个js文件
然后在router.js里引入一下
    路由的滚动行为
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
    

1.分页器
   分页器这里我用了element-ui
   我躺平了


2.开发某一个产品的详情页面
    1.静态组件 先把详情页组件注册为路由组件
    2.发请求
    3.vuex  把放回来的goodInfo对象里面的数据存储到state中
      接着用getters把goodInfo对象的几个数组('skuInfo','spuSaleAttrLis','categoryView')拿出来，简化数据
        //简化数据而生
        const getters = {
        //比如:state.goodInfo初始状态空对象，空对象的categoryView属性值undefined
          //当前计算出的 categoryView属性值至少是一个空对象，假的报错不会有了。
        categoryView(state){
          return state.goodInfo.categoryView||[]
        },
        spuSaleAttrList(state){
          return state.goodInfo.spuSaleAttrList||[]
        },
        skuInfo(state){
          return state.goodInfo.skuInfo||[]
        },
     为什么要加||[]
        //假如网络不好，或者没网络，searchList的数据还没有回来 没回来就是空对象
        //那我们执行到这一行tate.searchList.goodsList就会报undefined   因为 空对象 {}.xxxx最多就是undefined，还不会报错
         //既然searchList.goodsList已经是undefined了，那我们还拿他去遍历数据，
         比如说拿到goodsList goodsList.xxxx 就会报错,因为undefined.xxx就会报错
         //所以加多一个条件||[]，至少是个空数组  
         //空数组和空对象一样 都不会报错
    4.动态展示组件
      图片是在子组件zoom中的，我们要把detail获取到的图片传给zoom组件
      父给子  prop

3.售卖属性的高亮切换
    售卖的几种属性都是通过遍历一个dl得来的
    1.颜色：亮黑色 冰霜银色
    2.版本：6g+128 8g+128

    这两种售卖属性都是通一个dl遍历出来的
    所以不能用常规的方法：
    在data中定义当前点击的索引
    然后传属性遍历的索引过来
    两者判断的方法


    点击属性的时候，把当前属性，还有存储整个属性的数组传过来
    刚点击的时候，给他


  
 
