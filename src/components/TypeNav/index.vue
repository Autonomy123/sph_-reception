<template>
  <!-- 三级联动组件 -->
  <!-- 功能：
        1.动态的展示三级联动数据
        2.动态的完成三级联动的动态背景颜色
            这个背景颜色是通过鼠标移入和鼠标移除来控制的(其实，如果是通过点击来控制背景颜色，就没有这个移除事件。)
            鼠标移入：@mouseenter
            鼠标移除：@mouseleave  鼠标的移除用到了委派事件  鼠标移除到一级分类会触发  移除到h2也会触发  (其实没多大作用，主要让我了解了什么是事件委派)
        3.给三级联动的一级分类添加节流功能
        4.三级联动的一、二、三级分类携带产品(产品的名字和产品的id)进行路由跳转
        5.三级联动中的分类页面，在home路由组件中展示，在search路由组件中，一开始隐藏，通过鼠标移入控制显示，鼠标移除控制隐藏
        6.给search组件的三级联动的分类页面添加过渡动画
     -->
  <div>
    <!-- 商品分类导航 -->
    <div class="type-nav">
      <div class="container">
        
        <div @mouseleave="leaveIndex" > 
          <!-- 事件委派|事件代理 -->
          <!-- 这里用到了事件委派，其实就等于给h2和下面的div sort都绑定了一个 @mouseleave事件 -->
          <h2 class="all" @mouseenter="enterSearch">全部商品分类</h2>
          <!-- 三级联动 -->
          <!-- 给三级联动添加过渡动画功能 -->
          <!-- 是给一整个sort分类添加过渡动画 所以不用transition-group -->
          <transition name="sort"> 
              <div class="sort" v-show="show" >
            <div class="all-sort-list2">
              <!-- 一级分类 -->
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                @mouseenter="changeIndex(index)"
                :class="{ cur: currentIndex == index }"
              >
                <h3>
                  <a  @click="goSearch(c1.categoryName,c1.categoryId)">{{ c1.categoryName }}</a>
                </h3>
                <!-- 二级，三级分类 -->
                <div class="item-list clearfix" :style="{display:currentIndex == index?'block':'none'}">
                  <div class="subitem">
                    <dl
                      class="fore"
                      v-for="(c2) in c1.categoryChild"
                      :key="c2.categoryId"
                    >
                      <dt>
                        <a  @click="goSearch(c2.categoryName,c2.categoryId)">{{ c2.categoryName }}</a>
                      </dt>
                      <dd>
                        <em
                          v-for="(c3) in c2.categoryChild"
                          :key="c3.categoryId"
                        >
                          <a @click="goSearch(c3.categoryName,c3.categoryId)">{{ c3.categoryName }}</a>
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
              </div>
          </transition>
        </div>
        <nav class="nav">
          <a href="###">服装城</a>
          <a href="###">美妆馆</a>
          <a href="###">尚品汇超市</a>
          <a href="###">全球购</a>
          <a href="###">闪购</a>
          <a href="###">团购</a>
          <a href="###">有趣</a>
          <a href="###">秒杀</a>
        </nav>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
// 引入lodash 不推荐
//import _ from 'lodash';
//按需引入
import throttle from 'lodash/throttle';
export default {
  name: "TypeNav",
  data() {
    return {
      //存储用户鼠标移上的那个 一级分类
      currentIndex: -1,
      show:true,//
    };
  },
  mounted() {
    
    // this.$store.dispatch("categoryList"); 发请求，获取三级联动的数据写在APP.vue中
    // 如果不是search组件的话就隐藏
   if( this.$route.path !=='/home'){
     this.show = false
   }
  },
  computed: {
    ...mapState({
      //对象写法右侧是函数的时候 state是大仓库，我们要的是大仓库里面的home模块中的categoryList
      categoryList: (state) => state.home.categoryList,
    }),
  },
  methods: {
    // changeIndex(index) {鼠标移入 修改currentIndex
    //   this.currentIndex = index;
    // },

    // 鼠标移入添加节流功能
    // 使用lodash中封装好的防抖节流方法 不能使用es6的函数书写方式 也不能使用箭头函数
    changeIndex:throttle(function(index){
      this.currentIndex = index;
    },50),

   //鼠标移除 控制三级联动的背景颜色以及 search组件的分类页面隐藏 
    leaveIndex(){
      this.currentIndex = -1;
      if(this.$route.path !=='/home'){
        this.show = false
      }
    },
    //三级联动的编程式路由跳转
    goSearch(categoryName,categoryId){
      this.$router.push({
        name:'search',
        query:{
          categoryName:categoryName,
          categoryId:categoryId
        }

      })
    },
    //鼠标移入控制search路由组件的三级联动，分类页面
    enterSearch(){
      if(this.$route.path !='/home'){
        this.show = true
      }
    }
  },
};
</script>
<style lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;

      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
          //通过js来显示隐藏二三级分类 而不用hover了
          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
        }
        .cur {
          background-color: skyblue;
        }
        a{
          cursor:pointer
        }
      }
    }
    // 过渡动画开始
    .sort-enter{
      height: 0;
    }
    // 过渡动画结束
    .sort-enter-to{
      height: 461px;
    }
    //过渡动画离开开始
    .sort-leave{
      height: 461px;
    }
    //离开结束
    .sort-leave-to{
      height: 0;
    }
    //定义进入时动画的时间，速率
    .sort-enter-active{
      transition: all .5s linear;
    }
      //定义离开时动画的时间，速率
    .sort-leave-active{
      transition: all .2s linear;
    }
  }
}
</style>