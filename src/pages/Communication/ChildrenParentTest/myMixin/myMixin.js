export default{
    methods: {
        geiQian(money){
            this.money-=money;
            //$parent 在子组件内部，获取到某一个父组件可以操作父组件的（数据+方法）
            this.$parent.money+=money;
         }
    },
    watch:{},
    mounted(){},
}