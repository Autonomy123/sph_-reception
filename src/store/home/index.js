//home模块的小仓库
import { 
    reqCategoryList,
    reqgetBannerList,
    reqgetFloorList
} from "../../api";

const state = {
    categoryList:[],//存储三级联动数据数组
    bannerList:[],  //存储轮播图数据数组
    floorList:[],//存储floor数据数组
};
const mutations = {
    CATEGORYLIST(state,categoryList){
        state.categoryList=categoryList.slice(0,16);
    },
    BANNERLIST(state,bannerList){
        state.bannerList = bannerList
    },
    FLOORLIST(state,floorList){
        state.floorList = floorList
    },
};
const actions = {
    //获取三级联动数据
   async categoryList({commit}){
        let result = await reqCategoryList()
        if(result.code ==200){
            commit("CATEGORYLIST",result.data)
        }
    },
    //获取轮播图数据
    async getBannerList({commit}){
        let result = await reqgetBannerList()
        if(result.code ==200){
            commit("BANNERLIST",result.data)
        }
    },
    //获取floor数据
    async getFloorList({commit}){
        let result = await reqgetFloorList();
        console.log(result);
        if(result.code ==200){
            commit("FLOORLIST",result.data)
        }
    }
};
const getters = {};
export default {
    state,
    mutations,
    actions,
    getters
}