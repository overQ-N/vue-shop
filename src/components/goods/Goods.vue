<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchObj.query" class="input-with-select" clearable @clear="searchGoods">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goods" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="90"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="90"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="90"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90"></el-table-column>
        <el-table-column  label="创建时间" width="180">
          <template #default="props">
            {{new Date(props.row.add_time).toLocaleDateString()}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default='props'>
            <el-button size="mini" icon="el-icon-edit" type="warning" :id="props.id" >编辑</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="removeById(props.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchObj.pagenum"
      :page-sizes="[20, 40, 60, 80]"
      :page-size="searchObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索输入框
      searchObj: {
        query: '',
        pagenum: 1,
        pagesize: 20
      },
      // 总数据条数
      total: 0,
      // 商品数据列表
      goods: []
    };
  },
  mounted() {
    this.getGoods();
  },
  methods: {
    // 获取商品列表
    async getGoods() {
      const { data: res } = await this.$axios.get('goods', {
        params: this.searchObj
      });
      if (res.meta.status !== 200) return this.$message.error('获取数据失败');
      this.total = res.data.total;
      this.goods = res.data.goods;
    },
    // 分布 每页条数
    handleSizeChange(newSize) {
      this.searchObj.pagesize = newSize
      this.getGoods()
    },
    // 分页 页码
    handleCurrentChange(newPage) {
      this.searchObj.pagenum = newPage
      this.getGoods()
    },
    // 搜索商品
    searchGoods() {
      this.getGoods()
    },
    // 删除商品
    removeById(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`goods/${row.goods_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.getGoods()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    addGoods() {
      // 添加商品
      this.$router.push('/goods/add')
    }
  }
};
</script>

<style lang='stylus' scoped>

.el-card

  .el-table
    margin-top 15px
/deep/ .el-scrollbar
  height auto
</style>
