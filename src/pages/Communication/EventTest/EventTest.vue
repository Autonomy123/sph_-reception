<template>
<!-- 
  1.原生dom可以绑定原生的自定义事件
  2.非原生dom绑定原生自定义事件要加修饰符.native
  3.原生dom绑定自定义事件无意义
  4.非原生dom绑定自定义事件 -->
<!-- 系统事件 -->
  <div>
    <h1>EventTest组件</h1>
    <!-- 原生DOM节点button，可以使用原生的系统事件 click -->
    <button @click="handler">原生btn按钮</button>

    <!-- 使用Event1组件：底下这个组件不是原生的dom节点(他是EventTest组件的子组件)  ，所以你给他绑定@click就变成自定义事件了，子给父传值的那个自定义事件
     但是你就是想给Event1绑定的是原生的click事件，加一个.native就行了-->
     <!-- <Event1 @click="handler1"></Event1> -->
    <Event1 @click.native="handler1"></Event1>
    <hr/>
    <!-- 自定义事件对于原生DOM没有任何意义 -->
    <!-- <button @erha="handler3"> 原生的btn</button> -->
    <Event2 @click="handler2" @xxx="handler2"></Event2>
    <!-- 表单元素 color:选取颜色  range：范围条 date：日历 week-->
    <input type="week" />
  </div>
</template>

<script type="text/ecmascript-6">
  import Event1 from './Event1.vue'
  import Event2 from './Event2.vue'

  export default {
    name: 'EventTest',

    components: {
      Event1,
      Event2,
    },

    methods: {
      //原生DOM事件的回调
      handler(event){
        console.log(event);
      },
      handler1(){
        console.log('66666666');
      },
      handler2(params){
       console.log(params);
      }
    }
  }
</script>
