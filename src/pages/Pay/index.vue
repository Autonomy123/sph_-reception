<template>
  <div class="pay-main">
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
        </h4>
        <div class="paymark">
          <span class="fl">请您在提交订单<em class="orange time">4小时</em>之内完成支付，超时订单会自动取消。订单号：<em>{{this.$route.query.orderId}}</em></span>
          <span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{payInfo.totalFee}}</em></span>
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>尚品汇商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。</li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）</h4>
        <ul>
          <li>支付帐号：11111111</li>
          <li>密码：111111</li>
          <li>支付密码：111111</li>
        </ul>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay2.jpg"></li>
            <li><img src="./images/pay3.jpg"></li>
          </ul>

        </div>
        <div class="hr"></div>

        <div class="payshipInfo">
          <div class="step-tit">
            <h5>支付网银</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay10.jpg"></li>
              <li><img src="./images/pay11.jpg"></li>
              <li><img src="./images/pay12.jpg"></li>
              <li><img src="./images/pay13.jpg"></li>
              <li><img src="./images/pay14.jpg"></li>
              <li><img src="./images/pay15.jpg"></li>
              <li><img src="./images/pay16.jpg"></li>
              <li><img src="./images/pay17.jpg"></li>
              <li><img src="./images/pay18.jpg"></li>
              <li><img src="./images/pay19.jpg"></li>
              <li><img src="./images/pay20.jpg"></li>
              <li><img src="./images/pay21.jpg"></li>
              <li><img src="./images/pay22.jpg"></li>

            </ul>
          </div>

        </div>
        <div class="hr"></div>

        <div class="submit">
          <a class="btn" @click="open">立即支付</a>
        </div>
        <div class="otherpay">
          <div class="step-tit">
            <h5>其他支付方式</h5>
          </div>
          <div class="step-cont">
            <span><a href="weixinpay.html" target="_blank">微信支付</a></span>
            <span>中国银联</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
  export default {
    name: 'Pay',
    data() {
      return {
        payInfo:{},
        timer:null,//定时器 
        code:''

      }
    },
    mounted(){
      this.getPayInfo()
    },
    methods:{
      //获取支付信息
     async getPayInfo(){
       let result = await this.$API.reqPayInfo(this.$route.query.orderId)
        //如果成功，组件当中存储支付信息
        if(result.code==200){
          this.payInfo=result.data
        }
      },
      //弹出框
      async open() {
         //生成二维码
           let url = await QRCode.toDataURL(this.payInfo.codeUrl);
           //codeUrl是后台返回的微信二维码支付的字符串，我们要把他转为图片
           //因为QRCode.toDataURL返回的也是一个promise 
          //  传一个二维码字符串，转化为二维码(一个二维码图片的url地址) 他也要等待字符串是否转化为二维码成功
           //QRCode.toDataURL这个东西他本身也是一个异步请求 跟我们关系不大，文档中也加了async await
          //  而且他还用try catch来捕获。我们这不用捕获，成功了就直接显示二维码，失败了就不显示
          //  说白了，我们这里不用后续操作
        this.$alert(`<img src=${url} />`, '请你微信支付', {
          dangerouslyUseHTMLString: true,
          //中间布局
          center:true,
          //是否显示取消按钮
          showCancelButton:true,
          //右上角的x
          showClose:false,
          //取消按钮的文本内容
          cancelButtonText:'支付遇见问题',
          //确定按钮的文本内容
          confirmButtonText:'已支付成功',
          //是否可通过点击遮罩关闭 MessageBox
          closeOnClickModal:true,
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
                               //只有你支付成功之后，点击确定才能跳转到字符成功的页面  我这里先注释掉，方便我们做项目。
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
</script>

<style lang="less" scoped>
  .pay-main {
    margin-bottom: 20px;

    .pay-container {
      margin: 0 auto;
      width: 1200px;

      a:hover {
        color: #4cb9fc;
      }

      .orange {
        color: #e1251b;
      }

      .money {
        font-size: 18px;
      }

      .zfb {
        color: #e1251b;
        font-weight: 700;
      }

      .checkout-tit {
        padding: 10px;

        .tit-txt {
          font-size: 14px;
          line-height: 21px;

          .success-icon {
            width: 30px;
            height: 30px;
            display: inline-block;
            background: url(./images/icon.png) no-repeat 0 0;
          }

          .success-info {
            padding: 0 8px;
            line-height: 30px;
            vertical-align: top;
          }
        }

        .paymark {
          overflow: hidden;
          line-height: 26px;
          text-indent: 38px;

          .fl {
            float: left;
          }

          .fr {
            float: right;

            .lead {
              margin-bottom: 18px;
              font-size: 15px;
              font-weight: 400;
              line-height: 22.5px;
            }
          }
        }
      }

      .checkout-info {
        padding-left: 25px;
        padding-bottom: 15px;
        margin-bottom: 10px;
        border: 2px solid #e1251b;

        h4 {
          margin: 9px 0;
          font-size: 14px;
          line-height: 21px;
          color: #e1251b;
        }

        ol {
          padding-left: 25px;
          list-style-type: decimal;
          line-height: 24px;
          font-size: 14px;
        }

        ul {
          padding-left: 25px;
          list-style-type: disc;
          line-height: 24px;
          font-size: 14px;
        }
      }

      .checkout-steps {
        border: 1px solid #ddd;
        padding: 25px;

        .hr {
          height: 1px;
          background-color: #ddd;
        }

        .step-tit {
          line-height: 36px;
          margin: 15px 0;
        }

        .step-cont {
          margin: 0 10px 12px 20px;

          ul {
            font-size: 0;

            li {
              margin: 2px;
              display: inline-block;
              padding: 5px 20px;
              border: 1px solid #ddd;
              cursor: pointer;
              line-height: 18px;
            }
          }
        }
      }

      .submit {
        text-align: center;

        .btn {
          display: inline-block;
          padding: 15px 45px;
          margin: 15px 0 10px;
          font: 18px "微软雅黑";
          font-weight: 700;
          border-radius: 0;
          background-color: #e1251b;
          border: 1px solid #e1251b;
          color: #fff;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          text-decoration: none;
        }
      }
    }
  }
</style>