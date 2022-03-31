<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(cart) in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked==1" @change="updateChecked(cart,$event.target.checked)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{cart.skuName}}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{cart.cartPrice}}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handler('mins',-1,cart)">-</a>
            <input autocomplete="off" type="text"  minnum="1" class="itxt" :value="cart.skuNum" @change="handler('change',$event.target.value * 1,cart)">
            <a href="javascript:void(0)" class="plus" @click="handler('plus',+1,cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{cart.skuNum*cart.cartPrice}}</span>
          </li>
          <li class="cart-list-con7">
            <a  class="sindelet" @click="deletecarts(cart)">删除  </a>
            <br><br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked&&cartInfoList.length>0" @change="updataAllChecked($event.target.checked)">
        <span>全选</span>
      </div>
      <div class="option">
        <a  @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{totalPrice}}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle"
import {mapGetters} from 'vuex'
  export default {
    name: 'ShopCart',
    data() {
      return {
        
      }
    },
    mounted() {
      this.getData()
    },
    methods:{
      getData(){
        this.$store.dispatch('getShopCartList')
      },
       //修改购物车数量
      handler:throttle(async function(type,disNum,cart){
          // type:为了区分这三个元素
        // disNum:+(变化量1)  -(变化量1) input最终的个数（并不是变化量）因为他传的是$event.target.value * 1  为什么*1前面说过了
        // cart:哪一个产品 产品上有id
        switch(type){
          case 'plus':
            disNum =1;
            break;
          case 'mins':
            //判断产品的个数大于1 才可以给服务器传-1
              if(cart.skuNum >1){
                disNum =-1;
              }else{
                //如果产品的个数小于等于1 给服务器传0(就表示没加也没减 原封不动)
                disNum = 0
              }
            break;
          case 'change':
            //用户输入进来的是非法的
            if(isNaN(disNum)||disNum<1){
              disNum = 0;
            }else{
              //正常情况(小数，取整)，带给服务器的变化量= 用户输入进来的 - 商品的起始个数
              disNum = parseInt(disNum) - cart.skuNum;
            }
            //简写
            // disNum = (isNaN(disNum)||disNum<1)?0:parseInt(disNum) - cart.skuNum;
            break;
        }
        try {
          //代表修改成功  修改成功之后，要刷新页面才能显示修改后的值，因为我们展示商品的数据，是从后端拿到的
          //我们这里给商品数量加1 先后端发请求后 可是购物车页面没发在执行一次mounted钩子 所以获取不到最新的值 得刷新一下页面
          //解决：用到async await 当修改成功后，再this.getData()一次
           await this.$store.dispatch('AddOrUpdateShopCart',{skuId:cart.skuId,skuNum:disNum});
          this.getData()
        } catch (error) {
           alert(error.message)
        }
      },500),
      //删除购物车数据
      async  deletecarts(cart){
        try {
          //删除成功，再次发请求，获取新的数据
          this.$store.dispatch('deleteShopCartList',cart.skuId)
          this.getData()
        } catch (error) {
          alert(error.message)
        }
      },
     //修改产品的勾选状态
     async updateChecked(cart,isChecked){
       //勾选$event.target.checked的值为true 不勾选为false
       // 为true的时候，就把isChecked=1传过去 不勾选传isChecked=0
        try {
          isChecked =isChecked ? "1" : "0"
          await this.$store.dispatch('updateCheckedById',{skuId:cart.skuId,isChecked:isChecked})
          this.getData()
        } catch (error) {
          alert(error.message)
        }
     },
     //删除全部选中的商品
     async deleteAllCheckedCart(){
      try {
        await this.$store.dispatch('deleteAllCheckedCart')
        //删除成功，再次发请求，获取新的数据
        this.getData()
      } catch (error) {
        alert(error.message)
      }
     },
     //修改全部商品的勾选状态
     async updataAllChecked(isChecked){
        try {
          //勾选$event.target.checked的值为true 不勾选为false
       // 为true的时候，就把isChecked=1传过去 不勾选传isChecked=0
         isChecked=isChecked ? "1" :"0"
        await this.$store.dispatch('updataAllChecked',isChecked)
        //删除成功，再次发请求，获取新的数据
        this.getData()
      } catch (error) {
        alert(error.message)
      }
     }
    },
    computed:{
      ...mapGetters(['cartList']),
      cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
     //计算购买产品总价
      totalPrice(){
        let sum = 0;
        this.cartInfoList.forEach(item => {
          sum+=item.skuNum*item.cartPrice
        });
        return sum
      },
      //计算全选
      isAllChecked(){
        //遍历数组里面的元素 只要全部元素的isChecked都==1 返回true 只要有一个不为1 就为false
        return this.cartInfoList.every(item=>item.isChecked==1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .cart {
    width: 1200px;
    margin: 0 auto;

    h4 {
      margin: 9px 0;
      font-size: 14px;
      line-height: 21px;
    }

    .cart-main {
      .cart-th {
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        overflow: hidden;

        &>div {
          float: left;
        }

        .cart-th1 {
          width: 25%;

          input {
            vertical-align: middle;
          }

          span {
            vertical-align: middle;
          }
        }

        .cart-th2 {
          width: 25%;
        }

        .cart-th3,
        .cart-th4,
        .cart-th5,
        .cart-th6 {
          width: 12.5%;

        }
      }

      .cart-body {
        margin: 15px 0;
        border: 1px solid #ddd;

        .cart-list {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          overflow: hidden;

          &>li {
            float: left;
          }

          .cart-list-con1 {
            width: 15%;
          }
          .cart-list-con2 {
            width: 35%;

            img {
              width: 82px;
              height: 82px;
              float: left;
            }

            .item-msg {
              float: left;
              width: 150px;
              margin: 0 10px;
              line-height: 18px;
            }
          }


          .cart-list-con4 {
            width: 10%;

          }

          .cart-list-con5 {
            width: 17%;

            .mins {
              border: 1px solid #ddd;
              border-right: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }

            input {
              border: 1px solid #ddd;
              width: 40px;
              height: 33px;
              float: left;
              text-align: center;
              font-size: 14px;
            }

            .plus {
              border: 1px solid #ddd;
              border-left: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }
          }

          .cart-list-con6 {
            width: 10%;

            .sum {
              font-size: 16px;
            }
          }

          .cart-list-con7 {
            width: 13%;

            a {
              color: #666;
              cursor: pointer;
              &:hover{
              color: red;
            }
            }
            
          }
        }
      }
    }

    .cart-tool {
      overflow: hidden;
      border: 1px solid #ddd;

      .select-all {
        padding: 10px;
        overflow: hidden;
        float: left;

        span {
          vertical-align: middle;
        }

        input {
          vertical-align: middle;
        }
      }

      .option {
        padding: 10px;
        overflow: hidden;
        float: left;

        a {
          float: left;
          padding: 0 10px;
          color: #666;
          cursor: pointer;
        }
      }

      .money-box {
        float: right;

        .chosed {
          line-height: 26px;
          float: left;
          padding: 0 10px;
        }

        .sumprice {
          width: 200px;
          line-height: 22px;
          float: left;
          padding: 0 10px;

          .summoney {
            color: #c81623;
            font-size: 16px;
          }
        }

        .sumbtn {
          float: right;

          a {
            display: block;
            position: relative;
            width: 96px;
            height: 52px;
            line-height: 52px;
            color: #fff;
            text-align: center;
            font-size: 18px;
            font-family: "Microsoft YaHei";
            background: #e1251b;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>