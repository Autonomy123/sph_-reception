<template>
<!-- v-model的实现原理：value和input事件实现
可以通过v-model实现父子组件数据同步 -->
  <div>
    <h2>深入v-model</h2>
    <input type="text" v-model="msg">
    <span>{{msg}}</span>
    <br>
    <h2>深入v-model原理</h2>
    <!-- v-model的原理就是给元素绑定 v-bind的value事件跟v-on的oninput事件 -->
    <!-- 原生DOM当中是有oninput事件：当表单元素发生文本的变化的时候就会立即触发 -->
    
    <input type="text" :value="msg" @input=" msg = $event.target.value"/>
    <span>{{msg}}</span>
     <!--并非原生DOM：自定义组件-->
    <!-- 	:value是什么？ 是props 父子组件通信
	@input是什么？ 是非原生dom的input事件 属于自定义事件 -->
    <CustomInput :value="msg" @input="msg = $event"></CustomInput> 
     <!-- v-model可以在非表单元素身上使用 -->   
    <CustomInput v-model="msg"></CustomInput>
    <hr>
  </div>
</template>

<script type="text/ecmascript-6">
  import CustomInput from './CustomInput.vue'
  export default {
    name: 'ModelTest',
    data() {
      return {
         msg:"我爱塞北的大雪呀"
      }
    },
    components: {
      CustomInput
    }
  }
</script>
