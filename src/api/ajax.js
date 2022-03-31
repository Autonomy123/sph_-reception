//对于axios进行二次封装 主要用到的是封装请求拦截和响应拦截
import axios from "axios"
//引入进度条插件
import nprogress from "nprogress";
//引入进度条插件的样式
import "nprogress/nprogress.css"
import store from '@/store';

const requests = axios.create({
    //配置对象
    //基础路径，发请求的时候，路径当作会出现api
    baseURL:"/api",
    //代表请求超时的时间5s  代表请求在5s之内没有响应  那就失败了
    timeout:5000,
});
//请求拦截器:在发请求之前(所有的请求)，请求拦截器可以检测到，可以在请求发出去之前做一些事情

requests.interceptors.request.use((config)=>{//config:配置对象，对象里面有一个属性很重要，headers请求头
    //请求头添加一个字段(userTempId):和后台老师商量好了
    if(store.state.shopcart.userTempId){//如果仓库中有游客的临时身份id 就把它添加到请求头中
        config.headers.userTempId = store.state.shopcart.userTempId;
    }
    if(store.state.user.token){//如果仓库中有用户的token 就把它添加到请求头中
        config.headers.token = store.state.user.token
    }
    //进度条开始
    nprogress.start();
    return config;
    
},(error)=>{

})

//响应拦截器
requests.interceptors.response.use((res)=>{
    //成功的回调  服务器相应数据回来以后，响应拦截器可以检测到，可以做一些事情
    nprogress.done();
    
    return res.data //只返回res的data数据

},(error)=>{
    //响应失败的回调

});

export default requests;