
  今天开始练习不用vuex发请求
  直接在组件内发请求

只引一次
    在main.js中
    //引入同一接口api文件里面全部的请求函数
    import *as API from './api';
    Vue.prototype.$API =API
    这样所有组件的所有请求都不需要一个一个引了，都可以直接访问

       
    原理就像全局事件总线$bus一样
    组件实例原型的原型是vue.prototype
    所有组件的实例可以找vue.prototype借用属性的方法

10.提交订单

  1.提交订单的交易编号是后端给我们的，他要我们把他tradeNo拼接在路径上
  其他的参数放在data里面即可，而且很明显是query传参 query传参?query是在path后面加上?形参名=值  params传参/，形参在路由里配置
  其实后端要求我们是query传参还是params传参跟我们没关系
  我们只要在封装统一接口的时候按照他的格式来就行了
  
  /api/order/auth/submitOrder?tradeNo={tradeNo}  接口也是这的  
                                        traderNo
                                      consignee
                                      consigneeTel
                                      deliveryAddress
                                      paymentWay
                                      orderComment
                                      orderDetailList  提交订单的参数有这么多，只有traderNo拼接在路径上,而且很明显是query传参
                                      所以我们在封装接口模块的时候
                                      这样封装
  export const reqSubmitorder =(tradeNo,params)=>requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,method:'post',data:params})

    2. 
    提交订单我们也需要知道
    请求成功或者失败
    因为成功我们要跳转到支付的页面 
    这里可以用try catch或者用if判断
    因为这时在组件内发请求的，我们完全可以通过返回的结果result.code==200知道请求成功没
    而派发action那种发请求，在组件中是不可以通过result.code==200知道请求成功没。
    因为这个result.code==200在仓库的js文件中呢 组件获取不到 只能通过async await结合try catch
    async submitOrder(){
        let {tradeNo} = this.orderInfo
        let data ={
          consignee: this.userDefaultAddress.consignee,//最终收件人的名字
          consigneeTel: this.userDefaultAddress.phoneNum,//最终收件人的手机号
          deliveryAddres: this.userDefaultAddress.fullAddress,//最终收件人的地址
          paymentWay: "ONLINE",//支付方式
          orderComment: this.msg,//买家留言的信息
          orderDetailList:this.orderInfo.detailArrayList// 商品清单
        }
        //这里也请求成功或者失败，不一定用if用try catch 判断也行
          let result =await this.$API.reqSubmitOrder(tradeNo,data)
          console.log(result)
          
          if(result.code==200){
            this.orderId = result.data;
            this.$router.push('/pay?orderId='+this.orderId)
          }else {
          alert(result.data);
        }
      
      }


 11.提交成功
        保存后台返回的订单号，并且跳转到支付页面(需要携带这订单号)
    提价失败
     报错误信息

12.获取订单支付信息
    这里也需要发请求，提交订单
    后台会返回一个订单号
    然后拿着订单号来到订单页面
13  获取订单交易信息
    来到订单页面之后还需要拿着订单号发请求，
    然后在订单页面展示你的订单号和商品总价钱
13.支付
    支付的时候，再一次需要拿着订单号去做支付
    支付这里用到element-ui
    和 qrcode二维码插件
        1.npm i qrcode
        2.import QRCode from 'qrcode'
    支付这里用长轮询
        什么意思呢？
        因为当用户提交完订单，点击支付的时候，弹出微信支付的二维码
        可这时候，你不知道用户什么时候付款 所以你要一直发请求获取用户支付的状态 用定时器
        如果付款了，路由跳转，跳到付款成功的页面 并且清除定时器 关闭支付的弹出框
        怎么判断用户付没付款?
        result.code==200
        付款成功
    平时发的请求都是短轮询

      //获取支付信息
     async getPayInfo(){
       let result = await this.$API.reqPayInfo(this.$route.query.orderId)
        //如果成功，组件当中存储支付信息
        if(result.code==200){
          this.payInfo=result.data
        }
      },
      //弹出框（element-ui做的弹出框）
      async open() {
         //生成二维码
           let url = await QRCode.toDataURL(this.payInfo.codeUrl);//codeUrl是后台返回的微信二维码支付的字符串，我们要把他转为图片
           //因为QRCode.toDataURL返回的也是一个promise 
            //  传一个二维码字符串，转化为二维码(一个二维码图片的url地址) 他也要等待字符串是否转化为二维码成功 
           //QRCode.toDataURL这个东西他本身也是一个异步请求 跟我们关系不大，文档中也加了async await
          //  而且他还用try catch来捕获。我们这不用捕获，成功了就直接显示二维码，失败了就不显示
          //  说白了，我们这里不用后续操作
        this.$alert(`<img src=${url} />`, '请你微信支付', {
          dangerouslyUseHTMLString: true,  //中间布局
          center:true, //是否显示取消按钮
          showCancelButton:true, //右上角的x
          showClose:false,//取消按钮的文本内容
          cancelButtonText:'支付遇见问题',//确定按钮的文本内容
          confirmButtonText:'已支付成功',//是否可通过点击遮罩关闭 MessageBox
          closeOnClickModal:true, //点击遮罩层，关闭弹出框

          //MessageBox 关闭前的回调  它会暂停实例的关闭，直到你手动的关闭他
          beforeClose:(type,instande,done)=>{
            //type区分确定|取消|关闭按钮
            //type的值有'confirm', 'cancel'或'close'
            //done:关闭弹出框的办法
            if(type=='cancel'){//点击取消
               //清空定时器
              clearInterval(this.timer)
              this.time=null
              //关闭弹出框
              done();
            }else if(type=='confirm'){//点击确定
              // if(this.code==200){//下面的支付成功，为什么要保存code 就在这里用到了
                               //只有你支付成功之后，点击确定才能跳转到字符成功的页面
                ////清空定时器
                clearInterval(this.timer)
                this.time=null
                //关闭弹出框
                done();
                //跳转到支付成功的页面
                this.$router.push('/paysuccess')
              // }
            }
          }
        });
        //你需要知道支付是否成功|失败 因为有后续操作
        //支付成功，路由跳转，支付失败，提示信息
        //判断有没有定时器，没有就开启
        if(!this.timer){
          this.timer =setInterval(async()=>{
            //发请求获取用户支付状态
            let result = await this.$API.reqPayStatus(this.$route.query.orderId) 
            console.log(result.data)
            if(result.code==200){//如果用户支付成功
               //第一步，清空定时器
              clearInterval(this.timer);
              this.timer=null;
               //第二步，关闭弹出框
               this.$msgbox.close();
               //第三步，保存支付成功返回的code  保存code有什么用呢？为了上面的弹出框
               this.code=result.code
                //第四步，跳转路由
               this.$router.push('/paysuccess');
            }else{
              console.log(result.message)
            }
          },1000);
        }
      }
    }
  }


总一下，支付怎么做
   点击哪个商品加入购物车
	就把点击的那个商品的id和数量之类的发给后端
来到购物车页面，点击结算(点击结算也肯定要发一个请求)。
	获取订单信息嘛，这时候后端会返回一个交易编码
拿着这个交易编码去提交订单(当然还有获取的订单信息的数据，比如说收件人地址，电话。还有商品对象)
提交完订单，后台会返回一个订单号
拿着这个订单号去发支付的请求
然后发起支付的请求用长轮询的方式
什么意思呢？
        因为当用户提交完订单，点击支付的时候，弹出微信支付的二维码
        可这时候，你不知道用户什么时候付款 所以你要一直发请求获取用户支付的状态 用定时器
        如果付款了，路由跳转，跳到付款成功的页面 并且清除定时器 关闭支付的弹出框




