<template>
    <div>
        <el-pagination
              background
              layout="prev, pager, next"
              :total="searchList.totalPages * 10"
              @prev-click="perv"
              @next-click="next"
            >
            </el-pagination>
    </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
    data() {
        return {
            
        }
    },
    methods:{
        next(){
        console.log("下一页")
        },
        perv(){
        console.log("上一页")
        },
    },
    computed:{
        ...mapState({
            searchList:(state)=>state.search.searchList
        })
    }
}
</script>
<style lang="less">
    
</style>