1.平台售卖的属性操作
   
    1.平台的售卖属性在searchSelect里组件 需要把他这些属性传给search组件
    2.子给父传值 用的自定义事件 当search组件拿到值后，重新发请求获取跟售卖属性相关的数据
    3.看接口文档 
    //props参数要求格式是：
     "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
    //自定义事件 获取平台售卖的属性数据 
    atterInfo(attr,attrValue){
      console.log(attr,attrValue)
       let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;//整理参数
       this.searchParams.props.push(props);
        this.getData() //拿完整理好的售卖属性的数据 并且添加到props中，记得重新发请求
    },
    ps： trademark: ""  往一个空字符串 里添加字符 trademark= `${trademark.tmId}:${trademark.tmName}` 利用模板字符串解析{}里的值
    props: []     往一个空数组 里添加字符  let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
                                                props.push(props);  数组不可以像字符那样直接添加

     <li class="with-x"  v-for="(prop,index) in searchParams.props" :key="index">{{prop.split(":")[1]}}
    <!-- 商品售卖属性的面包屑 需要一个字符串作为参数,将根据这个参数拆分数组 
                    比如："23:8G:运行内存"  以:为参数 将23 8G 运行内存这三个字符串拆为3个数组   split(":")[1]去第二个数组的值    

    比如说我们点击平台售卖属性的中 运行内存的 8g 就会把"23:8G:运行内存"push到props内 面包屑会展示这个8g 
    再次点击机身内存的128g  又会把"24:128G:机身内存"push到props内 面包屑展示128g
    所以在展示售卖属性的面包屑中 应该用v-for遍历这个props 而不是跟之前那种用v-show

    当我们点击了 运行内存的 8g 又再次点击，运行内存的 8g他还会 把"23:8G:运行内存"push到props内这样面包屑又一次暂时8g
    所以我们要做数组去重

    当点击x的时候，我们要v-for遍历的props的index传给x的回调  应该展示的数据那么多 我要根据这个index 在props找到具体对应的值然后把他从数组中抹去。抹完后记得重新发请求

2.排序操作
    排序方式
    1: 综合,2: 价格 asc: 升序,desc: 降序  (1代表综合 2代表价格  asc代表价格中的升序 desc代表价格的降序)
    示例: "1:desc"
    默认一开始选中的是 1综合 降序

    根据this.searchParams.order默认 是1综合 desc降序

    1.综合和价格的切换高亮状态 高亮效果有class active决定
    如果：this.searchParams.order中存在1的话(isOne为true) 绑定class active 综合高亮
            this.searchParams.order存在2的话(isTwo为true) 绑定class active 价格高亮
            
            <li :class="{ active: isOne }" >综合
            <li :class="{ active: isTwo }" >价格
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },

2.我们的阿里矢量图标上和下是根据
    :class="{ 'icon-xiangshang4': isAsc, 'icon-xiangxia4': isDesc }
    对象绑定法绑定类名的
    
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
    asc存在 绑定icon-xiangshang4
     isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
    desc存在 绑定icon-xiangxia4
    如果this.searchParams.props中存在asc 则显示上

    //indexof()
	//该方法可以检索一个字符串是否含有指定内容
	//如果字符串中含有该内容,则会返回其第一次出现的索引
		//如果没找到指定的内容,则返回-1
        那只是单纯的想知道该指定字符存不存在  != -1(不等于-1就好了)

3.排序的操作

   changeOrder(flag) {
     1. //flag:用户每一次点击li标签的时候，用于区分是综合（1）还是价格（2）
      //现获取order初始状态【咱们需要通过初始状态去判断接下来做什么】
      //初始值order的格式order: "1:desc", 我们把这个"1:desc"拆开为2个数组 
      let originOrder = this.searchParams.order;
      let orginsFlag = originOrder.split(":")[0];
      let originSort = originOrder.split(":")[1];
      //新的排序方式
      let newOrder = "";
     2. //判断的是多次点击的是不是同一个按钮
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
     3.  //需要给order重新赋值
     4. this.searchParams.order = newOrder;
      //再次发请求
      this.getData();
    },
    
      获取data中searchParams.order初始值
      ps:初始值只在第一次判断有用，以后都跟初始值没关系了
      let originOrder = this.searchParams.order;
      let orginsFlag = originOrder.split(":")[0]; //第一次初始值为1  第一次判断之后这个值就不一定是1了
      let originSort = originOrder.split(":")[1]; //

      首先初始值orginsFlag为 1 originSort为desc(这是data里面的初始值)
    举例：1.当你第一次点击了综合 
    综合把参数1传过来 用flag接收
    来到if语句(flag == orginsFlag) 
    在if里他要判断你点的到底是不是1
    好 点的是1了
    newOrder = `${orginsFlag}:${originSort == "desc" ? "asc" : "desc"}`;
        把默认的降序desc改为升序asc 然后把新的排序方式给到newOrder
        再修改data里的值
        this.searchParams.order = newOrder;
        然后发请求
        this.getData();
        好了 这会data里searchParams.order的值就为 1:asc了

        2.data里searchParams.order的值就 1:asc了
        第二次点击 价格吧
        点击价格把参数2传过来还是用flag接收
        来到if语句(flag == orginsFlag) 
        在if里判断你传过来的flag等不等于我data里searchParams.order的值就 1:asc
        好 不等于
        走else语句
        newOrder = `${flag}:${"desc"}`;
        把新的排序指令 2：desc给到(默认第一次点击一个按钮是降序 你这里要升序也行) newOrder
         再修改data里的值
        this.searchParams.order = newOrder;
        然后发请求
        this.getData();
        这会data里searchParams.order的值就为 2:desc了
        3.这会data里searchParams.order的值就为 2:desc了
        第三次点击 价格
        拿着参数2 来到if语句
        判读是否点击的还是排序
        if(flag == orginsFlag)
        好 是了
        那就把降序改为升序
        
