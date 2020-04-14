<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template #default="props">
            <el-tag v-if="props.row.pay_status==='0'" type="danger">未付款</el-tag>
            <el-tag v-else type="primary">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="is_send" label="下单时间">
          <template
            #default="props"
          >{{new Date(props.row.create_time).toLocaleDateString()}} {{new Date(props.row.create_time).toLocaleTimeString()}}</template>
        </el-table-column>
        <el-table-column prop="is_send" label="操作">
          <template #default="props">
            <el-button size="mini" type="warning" icon="el-icon-edit" @click="showEditDialog"></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressDialog(props.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 编辑对话框 -->
      <el-dialog title="修改地址" :visible.sync="editVisible" width="50%" @close="handleClose">
        <el-form :model="eidtForm" :rules="eidtFormRules" ref="eidtFormRef" label-width="100px">
          <el-form-item label="选择省/市/区" prop="address1">
            <el-cascader v-model="eidtForm.address1" :options="cityData" :props="cascaderProps"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="eidtForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 展示物流进度的对话框 -->
      <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './city-picker-app';
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 订单数据列表
      orderList: [],
      editVisible: false,
      // 编辑表单
      eidtForm: {
        // 省市区
        address1: [],
        // 详细地址
        address2: ''
      },
      eidtFormRules: {
        address1: [
          { required: true, message: '省市不能为空', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ]
      },
      cityData,
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'name',
        label: 'name',
        children: 'sub'
      },
      // 物流对话框
      progressVisible: false,
      // 物流信息
      progressInfo: []
    };
  },
  mounted() {
    this.getOderList();
  },
  methods: {
    async getOderList() {
      const { data: res } = await this.$axios.get('orders', {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error('获取数据失败');
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOderList();
    },
    // 关闭编辑对话框
    handleClose() {
      this.$refs.eidtFormRef.resetFields();
    },
    // 显示编辑对话框
    showEditDialog() {
      this.editVisible = true;
    },
    // 展示物流对话框
    async showProgressDialog(row) {
      this.progressVisible = true;
      const { data: res } = await this.$axios.get('/kuaidi/1106975712662');
      if (res.meta.status !== 200) { return this.$message.error('查询物流信息失败!'); }
      this.progressInfo = res.data;
    }
  }
};
</script>

<style lang='stylus' scoped>
.el-table
  margin-top: 10px
</style>
