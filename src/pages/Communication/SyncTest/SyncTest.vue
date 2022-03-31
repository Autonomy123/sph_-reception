<template>
<!-- 1.通过props和自定义事件 实现父子组件数据同步
	2.sync :money.sync 1.父组件给子组件传递props 叫money2给当前子组件绑定了一个自定义事件 自定义事件的名字是updata:加上当前属性的名字
 .sync也可以实现父子数据同步
 -->
  <div>
    小明的爸爸现在有{{ money }}元
    <h2>不使用sync修改符</h2>
    <Child :money="money" @update:money="money = $event"></Child>
    <h2>使用sync修改符</h2>
    <!--  -->
    <Child :money.sync="money"></Child>
    <h2>使用v-model修改符</h2>
    <hr />
  </div>
</template>

<script type="text/ecmascript-6">
import Child from './Child.vue'

export default {
  name: 'SyncTest',
  data() {
    return {
      money: 10000
    }
  },
  components: {
    Child,
  }
}
</script>
