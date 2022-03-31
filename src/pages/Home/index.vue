<template>
    <div>
        <!-- 三级联动组件 已经全局注册，不用再引入 -->
        <TypeNav></TypeNav>
        <ListContainer></ListContainer>
        <Recommend></Recommend>
        <Rank></Rank>
        <Like></Like>
        <Floor v-for="(floor) in floorList" :key="floor.id" :list="floor"></Floor>
        <Brand></Brand>
    </div>
</template>
<script>
import ListContainer from '../Home/ListContainer/index.vue';
import Recommend from '../Home/Recommend/index.vue';
import Rank from '../Home/Rank';
import Like from '../Home/Like';
import Floor from '../Home/Floor';
import Brand from '../Home/Brand'
import {mapState} from 'vuex'
export default {
    name:'home',
    components:{  
        ListContainer,
        Recommend,
        Rank,
        Like,
        Floor,
        Brand
    },
  mounted() {
    //派发action 获取floor组件的数据
    this.$store.dispatch('getFloorList')
    //获取有信息在首先显示
    this.$store.dispatch('getUserInfo')
  },
  computed:{
    ...mapState({
      floorList: (state) => state.home.floorList,
    }),
  }
}
</script>
<style lang="less">
    
</style>