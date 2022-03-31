<template>
  <!-- $attrs属于组件的一个属性 可以获取到父组件传递过来的props数据
  以前接收父组件数据是通过props接收
  $listeners也属于组件的一个属性 可以获取到父组件给子组件传递自定义事件

   -->
  <div>
    <!-- a标签加title是鼠标移动上去后，可以有浮动提示。 -->
     <a :title="title"> 
       <!-- 下面的写法不能用: 虽然: 是v-bind的简写   v-on也不能用@-->
       <!-- 说白了就是 父组件点击 click="handler=>alert('弹弹弹');" 子组件通过($listeners)收到了这个事件 click="handler=>alert('弹弹弹') 
       再把他变为自身的click事件 v-on="$listeners"且这里不用用缩写 -->
        <el-button v-bind="$attrs" v-on="$listeners">添加</el-button>
     </a>
  </div>
</template>

<script>
export default {
  name: "",
  props:['title'],
  mounted(){
    //this.$attrs:可以获取到父亲传递的数据【props】
    //this.$attrs是可以获取父亲传递的props数据，如果子组件通过
    //props:[],接受，this.$attrs属性是获取不到的
    console.log(this.$attrs);
    console.log(this.$listeners);
  }
};
</script>

<style scoped></style>
