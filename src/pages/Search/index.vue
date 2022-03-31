<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-show="searchParams.categoryName">
              {{ searchParams.categoryName }}
              <i @click="removeCategoryName">×</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-show="searchParams.keyword">
              {{ searchParams.keyword }}
              <i @click="removekeyword">×</i>
            </li>
            <!-- 品牌的面包屑      截取 trademark trademark数组等于 ["4:小米"] 我们要展示最后两个字符 用到slice(2,4)-->
            <li class="with-x" v-show="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1] }}
              <i @click="removetrademark">×</i>
            </li>
            <!-- 商品售卖属性的面包屑 需要一个字符串作为参数,将根据这个参数拆分数组 
                    比如："23:8G:运行内存"  以:为参数 将23 8G 运行内存这三个字符串拆为3个数组   split(":")[1]去第二个数组的值                                                                -->
            <li
              class="with-x"
              v-for="(prop, index) in searchParams.props"
              :key="index"
             
            >
              {{ prop.split(":")[1] }}
              <i  @click="removeprops(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trade="trade" @atterInfo="atterInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder(1)">
                  <a 
                    >综合
                    <span
                      v-show="isOne"
                      class="iconfont"
                      :class="{
                        'icon-xiangshang4': isAsc,
                        'icon-xiangxia4': isDesc,
                      }"
                    >
                    </span>
                  </a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder(2)">
                  <a 

                    >价格
                    <span
                      v-show="isTwo"
                      class="iconfont"
                      :class="{
                        'icon-xiangshang4': isAsc,
                        'icon-xiangxia4': isDesc,
                      }"
                    >
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${goods.id}`">
                      <img v-lazy="goods.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{ goods.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ goods.title }}</a>
                    
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <!-- <div class="fr page">
            <div class="sui-pagination clearfix">
              <ul>
                <li class="prev disabled">
                  <a href="#">«上一页</a>
                </li>
                <li class="active">
                  <a href="#">1</a>
                </li>
                <li>
                  <a href="#">2</a>
                </li>
                <li>
                  <a href="#">3</a>
                </li>
                <li>
                  <a href="#">4</a>
                </li>
                <li>
                  <a href="#">5</a>
                </li>
                <li class="dotted"><span>...</span></li>
                <li class="next">
                  <a href="#">下一页»</a>
                </li>
              </ul>
              <div><span>共10页&nbsp;</span></div>
            </div>
          </div> -->
          <!-- 引用element-ui的分页 -->
          <div class="page">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="searchList.totalPages * 10"
              @prev-click="perv"
              @next-click="next"
              @current-change="change"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/index.vue";
import {mapGetters, mapState} from "vuex";

export default {
  name: "Search",
  data() {
    return {
      searchParams:{
        category1Id:"",//一级分类id
        category2Id:"",//二级分类id
        category3Id: "",//三级分类id
        categoryName: "",//分类名字
        keyword: "",//搜索关键字
        order: "1:desc",//排序
        pageNo: 1,//分页器用的，代表的是当前是第几页
        pageSize:10 ,//分页器用的，代表每一页展示多少数据
        props: [],//平台售卖属性操作带的参数
        trademark: ""//品牌
      }
    }
  },
  components: {
    SearchSelector,
  },
  beforeMount(){
    //发请求之前整理参数，带给服务器
    Object.assign(this.searchParams,this.$route.query,this.$route.params)
  },
  mounted() {
    // this.$store.dispatch('getSearchList',{})
    //在发请求之前给服务器参数  searchParams参数发生变化，有值带给服务器
    this.getData()
  },
  computed:{
    ...mapState({
      searchList:(state)=>state.search.searchList
    }),
    ...mapGetters(['goodsList']),
     isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
  },
  methods:{
    getData(){
      this.$store.dispatch('getSearchList',this.searchParams)
     
    },
    //清空分类的名字
    removeCategoryName(){
      //清空分类的名字
      this.searchParams.categoryName = ''
      this.$router.push({name:'search'}) //为什么这里不要再次发起请求，因为再次跳转到search页面 路径就发生变化 
      //路劲一旦改变，watch就会监听到，watch里面就会重新发请求
    },
    //清空关键字
    removekeyword(){
      //清空关键字
      this.searchParams.keyword = '' 
      //需要重新发请求
      this.getData()
       //通知兄弟组件Header清除关键字
      this.$bus.$emit('clear',this.searchParams.keyword)
      //路由跳转 路由自己跳自己,啥参数都不带 这样就能把路径中的参数去掉
      this.$router.push({name:"search"})
    },
    //清空品牌
    removetrademark(){
      //清空品牌
      this.searchParams.trademark = '' 
      //需要重新发请求
      this.getData()
      //路由跳转 路由自己跳自己,啥参数都不带 这样就能把路径中的参数去掉
      this.$router.push({name:"search"})
    },
    //删除售卖属性
    removeprops(index){
      this.searchParams.props.splice(index,1)
      //需要重新发请求
      this.getData()
    },
    //自定义事件获取trademark
    trade(trademark){
      //trademark参数要求格式是："trademark": "4:小米"
      this.searchParams.trademark= `${trademark.tmId}:${trademark.tmName}`
      this.getData()
    },
    //自定义事件 获取平台售卖的属性
    atterInfo(attr,attrValue){
       let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
       //数组去重 判断新获取到的售卖属性 在this.searchParams.props有没有 没有的话在push到
       //this.searchParams.props中
       if(this.searchParams.props.indexOf(props)==-1){
         this.searchParams.props.push(props);
       }
       this.getData()
    },
    // 排序的操作
     changeOrder(flag) {
      //flag:用户每一次点击li标签的时候，用于区分是综合（1）还是价格（2）
      //现获取order初始状态【咱们需要通过初始状态去判断接下来做什么】
      //初始值order的为 : "1:desc", 我们把这个"1:desc"拆开为2个数组 
     
      let originOrder = this.searchParams.order;
      let orginsFlag = originOrder.split(":")[0];
      let originSort = originOrder.split(":")[1];
      //新的排序方式
      let newOrder = "";
      //判断的是多次点击的是不是同一个按钮
      if (flag == orginsFlag) {
        newOrder = `${orginsFlag}:${originSort == "desc" ? "asc" : "desc"}`;
        //判断当前是否为降序操作 是的话，那下次点击就要变为升序了
        //下次点击就是 下次就是触发 changeOrderd的时刻
        //本来没触发 changeOrder之前 默认为降序 
        //当点击了 changeOrder 做判断 当前是否为降序 是的把值 取反 把降序改为升序
      } else {
        //点击不是同一个按钮
        newOrder = `${flag}:${"desc"}`;
      }
      //需要给order重新赋值
      this.searchParams.order = newOrder;
      //再次发请求
      this.getData();
    
    },
    //下一页
    next(){
      this.searchParams.pageNo++
      this.getData()
    },
    //上一页
    perv(){
      this.searchParams.pageNo--
      this.getData()
    },
    //点击页数
    change(index){
       this.searchParams.pageNo=index
       this.getData() 
    },
    //
  
  },
    watch: {
      $route(newValue, oldValue){
        //再次发请求之前整理参数带给服务器
        Object.assign(this.searchParams,this.$route.query,this.$route.params);
        this.getData();
        console.log(this.searchParams)
      }
    }
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;
                  cursor: pointer;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 813px;
        height: 66px;
        overflow: hidden;
        float: right;

        .el-pagination {
          margin: 18px 0;
          /deep/.el-pager li {
            width: 40px;
          }

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>