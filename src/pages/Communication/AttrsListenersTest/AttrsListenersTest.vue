<template>
  <div>
    <h2>自定义带Hover提示的按钮</h2>
    <!-- 当用户在使用我们封装的按钮的时候，需要向HintButton组件传递响应的参数 -->
    <!-- 二次封装的HintButton按钮的时候，把人家el-button需要的数据传递过去 -->
    <!-- @click="handler"在这里是自定义事件  想要变为原生事件得加@click.native -->
    <!-- 这里的意思就是，我点击HintButton想要弹出666 当然这里用@click.native把他变为原生事件也行
    但是我这里不这么写，我可以在子组件中 用$listeners接收父组件传过来的自定义事件 子组件接受到这个自定义事件后，用v-on="$listeners"绑定为自身的点击事件 -->
     <HintButton type="success" icon="el-icon-plus" title="我是中国人" @click="handler"/>
     <HintButton type="danger" icon="el-icon-minus" title="我是中国人2" @click="handler"/>
     <!-- 我用到了HintButton组件，但是我每次展示都向展示不一样内容的HintButton组件 就把el-button需要的数据传递过去 -->
  </div>
</template>

<script type="text/ecmascript-6">
import HintButton from  './HintButton';
export default {
  name: 'AttrsListenersTest',
  components:{
     HintButton 
  },
  methods: {
    handler() {
       alert('弹弹弹');
    },
  },
}
</script>
