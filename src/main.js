import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
//引入图片懒加载插件 并且注册
//引入图片
import loading from '@/assets/1.gif';
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload,{
  loading: loading,//懒加载默认的图片
})

//按需引入Pagination的element-ui，并且注册
import {  Pagination,Button } from 'element-ui';
Vue.use(Pagination);
Vue.component(Button.name, Button);
//Vue..component(Pagination.name,Pagination)

//element-ui组成组件还有一种写法 挂载在原型上 组件实例对上就有这个属性或方法了
import {MessageBox} from 'element-ui';
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

//把TypeNav这个组件注册为全局组件 因为很多地方都会用的这个组件，注册为全局组件比较方便
//祖册全局组件：第一个参数 组件名字  第二个参数：那个组件
import TypeNav from './components/TypeNav'//先引入，再注册
Vue.component(TypeNav.name,TypeNav)

//把Carsousel声明为全局组件
// import Carsousel from './components/Carsousel'
// Vue.component(Carsousel.name,Carsousel)

//引入同一接口api文件里面全部的请求函数
import *as API from './api';

//引入表单校验插件
import "@/plugins/validate";

//引入MockServer数据
import "./mock/mockServer"
import "swiper/css/swiper.css";
import store from './store'
import {reqCategoryList} from './api/index'
Vue.config.productionTip = false
reqCategoryList();
new Vue({
  render: h => h(App),
  //注册路由 当我们注册完路由的时候，无论是路由还是非路由组件都拥有$router,$route属性
  router,
  //注册store 当我们注册完store的时候，组件实例身上就会多了一个$store属性
  store,
  //配置全局事件总线$bus
  beforeCreate(){
    Vue.prototype.$bus =this
    Vue.prototype.$API =API
  }
}).$mount('#app')
