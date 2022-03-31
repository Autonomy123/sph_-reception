1.动态的展示购物车
    1.购物车静态组件
    2.发请求
    3.vuex三连环
    4.展示购物车动态数据

2.购物车中input的勾选
    返回的购物车数据中，有个属性是isChecked 只要isChecked==1 就勾选
    input框的checked选项是否勾选 :checked="cart.isChecked==1"  cart.isChecked==1为true就勾选
ps：input框里面的值也可以绑定动态:value="cart.skuNum"
3.购物车的全选  
    every方法
    //计算全选 
      isAllChecked(){
        //遍历数组里面的元素 只要全部元素的isChecked都==1 返回true 只要有一个不为1 就为false
        return this.cartInfoList.every(item=>item.isChecked==1)
      }
4.修改购物车产品数量用到（函数节流）
   1. 只要点击 + - 或者修改input里面的值 就向后台发请求
    正数代表增加,负数代表减少什么意思呢？
    就是说：原本你选中xxx商品数量为2，点击添加到购物车 ，这时候你已经发请求给后台，把你这个添加到购物车的商品数据传给后台
    到购物车页面时，从后台拿出你添加的数据进行展示。
    这时候你点击+ -或者修改值  
    比如说你点击+ 这时候数量加一变为3  那么你传过去的就是 +1(而不是3) 正数代表增加，原本的数量为2，现在为3那就是告诉后台，该商品的数量你要加一
   2. 给+ - input绑定同一个函数，因为都要靠这个函数向后台发请求
    除了传递个数，还要传商品id
    既然绑定的是同一个函数，那么在给函数传参的时候，就要传一个标识符，用来区别，(+ - input)是哪一个点击触发的该函数
   3. 给修改产品数量要加节流
        使用节流首先引入lodash import throttle from "lodash/throttle";
    
    1. <a class="mins" @click="handler('mins',-1,cart)">-</a>
        <input minnum="1" :value="cart.skuNum" @change="handler('change',$event.target.value * 1,cart)">
        <a  class="plus" @click="handler('plus',+1,cart)">+</a>

    2.   handler:throttle(async function(type,disNum,cart){
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
5.删除购物车
    删除跟添加购物车一样 都要等待一个删除成功或者删除失败的结果
    成功之后，再次发请求，获取新的数据
6.修改产品状态
   修改， 删除跟添加购物车一样 都要等待一个成功或者失败的结果
    成功之后，再次发请求，获取新的数据
    ps:(因为选没选中 要通过0代表取消选中 1代表选中 来告诉后端)
    1. <input type="checkbox" name="chk_list" :checked="cart.isChecked==1" @change="updateChecked(cart,$event.target.checked)">

       //修改产品的勾选状态
    2. async updateChecked(cart,isChecked){
       //勾选$event.target.checked的值为true 不勾选为false
       // 为true的时候，就把isChecked=1传过去 不勾选传isChecked=0
        try {
          isChecked =isChecked ? "1" : "0"
       await this.$store.dispatch('updateCheckedById',cart.skuId,isChecked)
       this,getData()
        } catch (error) {
          alert(error.message)
        }
     }
    },


