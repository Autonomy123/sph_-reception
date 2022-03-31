<template>
  <div class="spec-preview">
    <img :src="imgObj.imgUrl" />
    <!-- 这个event是用来触发鼠标移动事件的  -->
    <div class="event" @mousemove="handler"></div> 
    <!-- 这个big是放大后的那个图片 -->
    <div class="big">
      <img :src="imgObj.imgUrl" ref="big"/>
    </div>
    <!-- 这个是鼠标放上去就变为绿色div的遮罩层 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    props:["imgList"],
    data() {
     return{
       currentIndex:0
     }
    },
    computed:{
      imgObj(){
        return this.imgList[this.currentIndex]||{}
      }
    },
    mounted() {
      this.$bus.$on('getIndex',(index)=>{ 
        this.currentIndex=index
      })
 
    },
    methods: {
      handler(event){
        // event代表当前事件
        // 给handler绑定一个鼠标移动事件 @mousemove="handler"
        // 那么event.offsetX代表鼠标移动时的x坐标 event.offsetY y坐标
        // 鼠标在内层div，mask的中心又mask的宽和高是最外层div的一半
        //约束范围 鼠标不能出最外层的div
      let mask = this.$refs.mask;
      let big = this.$refs.big;
      let left = event.offsetX - mask.offsetWidth/2;
      let top = event.offsetY - mask.offsetHeight/2;
      // left和right是mask这个div最左边和最右边的坐标
      if(left <=0) left = 0; //限制鼠标不能向左移出界限
      if(left >=mask.offsetWidth) left = mask.offsetWidth; //限制鼠标不能向右移出界限
                              //因为最外层范围的div是内层宽度2倍  只要内层div的左坐标不大于它本身的宽度
                              // 就能保证他右边不出界线
      if(top<=0)top = 0;//限制鼠标不能向上移出界限
      if(top>=mask.offsetHeight) top = mask.offsetHeight; // 同理右界限，外层div高度是内存2倍
      
       //修改元素的left|top属性值
      mask.style.left = left+'px';
      mask.style.top = top +'px';
      //因为鼠标上移的时候，放大的图片就会向下移动(放大的图片跟鼠标移动相反，又放大的图片是
      //mask内的2倍，所以*-2)
      big.style.left = - 2 * left+'px';
      big.style.top = -2 * top +'px';

      }
    },
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>