//统一管理项目接口的模块
//引入二次封装的axios（带有请求、响应的拦截器）
import requests from "./ajax";
import mockrequests from "./mockAjax";
//获取三级联动数据
//三级菜单的请求地址  /api/product/getBaseCategoryList   GET    没有任何参数
// /api/product/getBaseCategoryList get 无参数
// 发请求 :axios发请求 返回结果是Promise对象
// export const reqBaseCategoryList = ()=>{
//     return requests({url:'product/getBaseCategoryList',method:'get'});
// }
// 下面这个是简写形式  因为箭头函数返回语句只有一句的话 return和{}都可以省略

export const reqCategoryList = ()=> requests({url:'/product/getBaseCategoryList',method:'get'});
//这两种发请求都一样
// export const reqCategoryList = ()=> requests.get('/product/getBaseCategoryList');

//获取轮播图数据(home首页轮播图接口)
export const reqgetBannerList = ()=>mockrequests.get('/banner');

//获取floor数据
export const reqgetFloorList = ()=>mockrequests.get('/floor');

//获取搜索模块的数据 /api/list 请求方式POST
//获取搜索模块数据 地址:/api/list  请求方式:post  参数:需要带参数
//当前这个接口（获取搜索模块的数据），给服务器传递一个默认参数【至少是一个空对象】
export const reqgetSearchList = (params)=>requests({url:'/list',method:'post',data:params});
// {
//     "category3Id": "61",
//     "categoryName": "手机",
//     "keyword": "小米",
//     "order": "1:desc",
//     "pageNo": 1,
//     "pageSize": 10,
//     "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
//     "trademark": "4:小米"
//   }

//获取商品详情数据
//获取产品详情信息的接口  URL: /api/item/{ skuId }  请求方式：get  
export const reqGoodsInfo = (skuId)=>requests({url:`/item/${skuId}`,method:'get'});

//添加商品到购物车
///api/cart/addToCart/{ skuId }/{ skuNum }  POST
export const reqAddOrUpdateShopCart = (skuId,skuNum)=>requests({url:`/cart/addToCart/${skuId}/${skuNum}`,method:'post'})

//获取购物车数据
//URL:/api/cart/cartList   method:get 
export const reqgetShopCartList = ()=>requests({url:'/cart/cartList',method:'get'})

//删除购物车商品
//URL:/api/cart/deleteCart/{skuId}   method:DELETE  
export const reqdeleteShopCartList = (skuId)=>requests({url:`/cart/deleteCart/${skuId}`,method:'delete'})

//修改商品选中状态
//URL:/api/cart/checkCart/{skuId}/{isChecked}   method:get 
export const reqUpdateCheckedByid = (skuId,isChecked)=>requests({url:`/cart/checkCart/${skuId}/${isChecked}`,method:'get'})

//获取验证码
//URL:/api/user/passport/sendCode/{phone}  method:get
export const reqgetcode = (phone)=>requests({url:`/user/passport/sendCode/${phone}`,method:'get'})

//注册
//url:/api/user/passport/register  method:post    phone code password
export const reqregisteruser = (params)=>requests({url:`/user/passport/register`,data:params,method:'post'})
// 如果说后端接口中，路径没有带参数 而发请求需要用到参数 ，直接把参数写在data里面

//登录
//URL:/api/user/passport/login  method:post phone password
export const reqUserLogin = (params)=>requests({url:'/user/passport/login',method:'post',data:params})

//获取用户信息
//URL:/api/user/passport/auth/getUserInfo  method:get 
//需要带着用户的token向服务器要用户信息
export const reqUserInfo= ()=>requests({url:'/user/passport/auth/getUserInfo',method:'get'});

//退出登录
//URL:/api/user/passport/logout method：get
export const reqloginOut=()=>requests({url:'/user/passport/logout',method:'get'})

//获取用户地址信息       没有任何参数  method:get
//URL:/api/user/userAddress/auth/findUserAddressList
export const reqAddressInfo=()=>requests({url:"/user/userAddress/auth/findUserAddressList",method:'get'})

//获取订单详情
//url：/api/order/auth/trade     没有任何参数  method:get
export const reqOrderInfo = ()=>requests({url:'/order/auth/trade',method:'get'});

//提交订单
//url:/api/order/auth/submitOrder?tradeNo={tradeNo}  method:POST  
export const reqSubmitOrder =(tradeNo,params)=>requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,method:'post',data:params})
// traderNo
// consignee
// consigneeTel
// deliveryAddress
// paymentWay
// orderComment
// orderDetailList  提交订单的参数有这么多，只有traderNo拼接在路径上,而且很明显是query传参

//获取订单支付信息
//url:/api/payment/weixin/createNative/{orderId} 参数orderId method:get
export const reqPayInfo =(orderId)=>requests({url:`/payment/weixin/createNative/${orderId}`,method:'get'})

//获取支付订单状态
//URL:/api/payment/weixin/queryPayStatus/{orderId}  get
export const reqPayStatus = (orderId)=>requests({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'});

//获取我的订单的数据
//url：/api/order/auth/{page}/{limit}
export const reqMyOrderList =(page,limit)=>requests({url:`/order/auth/${page}/${limit}`,method:'get'})