<template>
  <div>
     <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      chartsData: {
        
      },
      option: {
        title: {
          text: '数据统计'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20]
        }]
      },
      mychart: {}
    }
  },
  created() {
  },
  async mounted() {
    var mychart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$axios.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    var result = { ...this.option, ...res.data }
    mychart.setOption(result)
  },
  methods: {
   
  }
}
</script>

<style lang='stylus' scoped>
#main
  width 800px
  height 800px

</style>
