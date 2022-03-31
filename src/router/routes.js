// import Home from '@/pages/Home' 这种方式也能引进路由
//一级路由
// import Home from '../pages/Home'
// import Login from '../pages/Login'
// import Register from '../pages/Register'
// import Search from '../pages/Search'
// import Detail from '../pages/Detail/index.vue'
// import AddCartSuccess from '../pages/AddCartSuccess'
// import ShopCart from '../pages/ShopCart'
// import Trade from '../pages/Trade';
// import Pay from '../pages/Pay';
// import PaySuccess from "../pages/PaySuccess";
// import Center from '../pages/Center';
// //二级路由
// import myOrder from '../pages/Center/myOrder';
// import groupOrder from '../pages/Center/groupOrder'
export default

    [   
        {
            path:'/center',
            component:()=>import('../pages/Center'),
            meta: {
                show: true
            },
            children:[
                {
                    path:'myorder',
                    component:()=>import('../pages/Center/myOrder'),
                },
                {
                    path:'grouporder',
                    component:()=>import('../pages/Center/groupOrder'),
                },{
                    path:'/center',
                    redirect:'/center/myorder'
                }
            ]
            
        },
        {
            path:'/paysuccess',
            component:()=>import("../pages/PaySuccess"),
            meta: {
                show: true
            },
        },
        {
            path:'/pay',
            component:()=>import('../pages/Pay'),
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
            path: "/home",
            component: ()=>import('../pages/Home'),
            meta: {
                show: true
            }
        },
        {

            path: "/search/:keyword?",  //params传参数 需要配置key的占位:keyword  加一个?代表这个params可以传递也可以不传递
            component: ()=>import('../pages/Search'),
            meta: {
                show: true
            },
            name: "search",
        },
        {
            path: "/login",
            component: ()=>import('../pages/Login'),
            meta: {
                show: false
            }
        },
        {
            path: "/register",
            component: ()=>import('../pages/Register'),
            meta: {
                show: false
            }
        },
        {
            name: 'detail',  // 是当前路由的标识名称
            path: '/detail/:skuId',
            component: ()=>import('../pages/Detail'),
            meta: {
                show: true
            }
        },
        {   //重定向，在项目跑起来的时候，访问/, 立马让他定向home到首页
            path: '/',
            redirect: "/home",
            meta: {
                show: false
            }
        },
        {
            name:'ddCartSuccess',
            path:'/addCartSuccess',
            component:()=>import('../pages/AddCartSuccess'),
            meta: {
                show: true
            }
        },
        {
            name:'shopcart',
            path:'/shopcart',
            component:()=>import('../pages/ShopCart'),
            meta: {
                show: true
            }
        },
        {
            path:'/trade',
            component:()=>import('../pages/Trade'),
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
        },


        
  {
    path: '/communication',
    component: () => import('@/pages/Communication/Communication'),
    children: [
      {
        path: 'event',
        component: () => import('@/pages/Communication/EventTest/EventTest'),
        meta: {
          isHideFooter: true
        },
      },
      {
        path: 'model',
        component: () => import('@/pages/Communication/ModelTest/ModelTest'),
        meta: {
          isHideFooter: true
        },
      },
      {
        path: 'sync',
        component: () => import('@/pages/Communication/SyncTest/SyncTest'),
        meta: {
          isHideFooter: true
        },
      },
      {
        path: 'attrs-listeners',
        component: () => import('@/pages/Communication/AttrsListenersTest/AttrsListenersTest'),
        meta: {
          isHideFooter: true
        },
      },
      {
        path: 'children-parent',
        component: () => import('@/pages/Communication/ChildrenParentTest/ChildrenParentTest'),
        meta: {
          isHideFooter: true
        },
      },
      {
        path: 'scope-slot',
        component: () => import('@/pages/Communication/ScopeSlotTest/ScopeSlotTest'),
        meta: {
          isHideFooter: true
        },
      }
    ],
  },
    ]
