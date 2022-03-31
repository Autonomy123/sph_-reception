<template>
  <div>
    <h2>BABA有存款: {{ money }}</h2>
    <button @click="JieQianFromXM(100)">找小明借钱100</button><br />
    <button @click="JieQianFromXH(150)">找小红借钱150</button><br />
    <button @click="JieQianAll(200)">找所有孩子借钱200</button><br />
    <button @click="SendInfo">我是baba</button>
    <br />
    <!-- 小明  ref获取节点 (组件也是标签 也能获取到)  并且子组件所有的响应式数据都能拿到,还能操作他们-->
    <Son ref="xm" />
    <br />
    <!-- 小红 -->
    <Daughter ref="xh"/>
  </div>
</template>

<script>
import Son from "./Son";
import Daughter from "./Daughter";

export default {
  name: "ChildrenParentTest",
  data() {
    return {
      money: 1000,
    };
  },

  methods: {
    //找儿子借钱
    JieQianFromXM(money) {
      //父组件的数据累加100
      this.money += money;
      //ref可以还可以获取到子组件的节点 并且还能操作子组件的数据与方法
      this.$refs.xm.money -= money;
    },
    JieQianFromXH(money) {
      //父组件的数据累加150
      this.money += money;
      this.$refs.xh.money -= money;
    },
    JieQianAll(money){
      this.money += 2*money;
      this.$children.forEach(item=>item.money-=money);
      // $children 可以获取当前组件的所有子组件，可以操作子组件的（数据+方法）
      //不建议用枚举获取子组件：因为没办法确定到底是那个子组件
      // this.$children[0].money -=money;

    },
    SendInfo(){
      //在父组件中获取到子组件（数据+方法）
      this.$refs.xm.tinghua();
    }
  },

  components: {
    Son,
    Daughter,
  },
};
</script>

<style></style>
