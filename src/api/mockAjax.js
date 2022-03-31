//对于axios进行二次封装 主要用到的是封装请求拦截和响应拦截
import axios from "axios"
//引入进度条插件
import nprogress from "nprogress";
//引入进度条插件的样式
import "nprogress/nprogress.css"
console.log(nprogress);
const mockrequests = axios.create({
    //配置对象
    //基础路径，发请求的时候，路径当作会出现api
    baseURL:"/mock",
    //代表请求超时的时间5s  代表请求在5s之内没有响应  那就失败了
    timeout:5000,
});
//请求拦截器:在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情

mockrequests.interceptors.request.use((config)=>{
   
    //进度条开始
    nprogress.start();

     //config:配置对象，对象里面有一个属性很重要，headers请求头
    return config;
    
},(error)=>{

})

//响应拦截器
mockrequests.interceptors.response.use((res)=>{
    //成功的回调  服务器相应数据回来以后，响应拦截器可以检测到，可以做一些事情
    nprogress.done();
    
    return res.data //只返回res的data数据

},(error)=>{
    //响应失败的回调

});

export default mockrequests;