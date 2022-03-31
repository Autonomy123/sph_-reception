1.detail的轮播图子组件imageList 
    1.imageList组件轮播的图片是由detail组件传过去的skuImageList
    给给子传值 props

    2.点击轮播图的时候出现边框变红的高亮效果
        1.一开始是通过css样式 hover控制的
        2.我们把他改为js的点击切换
            还是那三步骤
            1.在data里设置一个当前鼠标点击的索引 currentIndex
            2.给需要切换的元素绑定回调  并且把当前元素的索引作为回调的参数
            3.在回调内把修改当前鼠标点击的索引 让他等于传过来的索引
            4.动态的绑定:class{active:currentIndex==index}
2.放大镜的zoom组件
    放大镜跟imageList组件一样，都是由detail组件传过去的skuImageList
    我在imageList点击哪张图片，放大镜也要展示响应的图片
    比如我在imageList点击的是播图数组skuImageList的第一张图片，那么zoom也要展示第一张图
    那我就把点击的一张轮播图数组skuImageList的第一个索引值传给zoom 告诉zoom他要展示的也是skuImageList的第一个索引值的图片
    1.把点击轮播的图片传给放大镜组件 zoom的index
    2.放大镜组件zoom和imageList组件是兄弟组件
        通过全局事件总线
        imageList组件把当前轮播的整个对象传给zoom(不要只传图片，把整个当前点击轮播的对象传过去)
        提供数据的imageList组件内
            1.<div class="swiper-slide" v-for="(img,index) in imgList" :key="img.id" >
                    <img :src="img.imgUrl" @click="changeCurrentIndex(index)" :class="{active:currentIndex==index}">
                </div>

           2. methods: {
                changeCurrentIndex(index){
                    this.currentIndex = index
                    this.$bus.$emit('getIndex',this.currentIndex)
                },
           3. 接收数据的zoom组件
           mounted() {
            this.$bus.$on('getIndex',(index)=>{
                this.currentIndex=index
            })
3.放大镜的操作
     <div class="event" @mousemove="handler"></div> 
    <!-- 这个big是放大后的那个图片 -->
    <div class="big">
      <img :src="imgs.imgUrl" ref="big"/>
    </div>
    <!-- 这个是鼠标放上去就变为绿色div的遮罩层 -->
    <div class="mask" ref="mask"></div>

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
4.购买数字操作
    1.isNaN() 函数可确定值是否为非数字
    如果该值等于 NaN，则此函数返回 true。否则返回 false。
    2.input框最好用change
        change绑定的事件是一定要等到input框的value值改变之后才会被触发
    3. <input autocomplete="off" class="itxt" v-model="num" @change="changeNum">
    4.  changeNum(event){
                //用户输入进来的文本 * 1
                //为什么要*1  因为你要输入的是非字符*1 结果就是是NaN 比如说 "我爱你"*1结果是NaN
            this.num = this.num * 1;
            //isNaN() 函数可确定值是否为非数字
            //如果该值等于 NaN，则此函数返回 true。否则返回 false。
            //如果用户输入进来的非法,出现NaN或者小于1
            if (isNaN(this.num) || this.num < 1) {
                this.num = 1;
            } else {
                //正常大于1【大于1整数不能出现小数】
                this.num = parseInt(this.num);//parseInt取整
            }
        }

