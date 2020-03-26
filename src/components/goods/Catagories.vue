<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="categories"
        :columns="columns"
        border
        stripe
        :selection-type="false"
        :expand-type="false"
        show-index
        :show-row-hover="false"
        class="tree-table"
      >
        <template #default='scope'>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-check"
            v-if=" !scope.row.cat_deleted "
            circle
          ></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" circle v-else></el-button>
        </template>
        <template #default="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template #default="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditCate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="delCate(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCategoriesInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryCategoriesInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" 
    :visible.sync="AddCateDialogVisible" 
    @close='resetForm'
    width="50%">
      <el-form
        ref="AddCateFormRef"
        :model="AddCateForm"
        label-width="130px"
        :rules="AddCateFormRules"
      >
        <el-form-item label="新增分类名称" prop="cat_name">
          <el-input v-model="AddCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="选择父级分类">
          <el-cascader
            v-model="selectedKeys"
            :props="cascaderProps"
            :options="parentCateList"
            clearable
            @change="setParentCate"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" 
    :visible.sync="editCateDialogVisible" 
    width="50%">
      <el-form
        ref="editCateFormRef"
        :model="newCate"
        label-width="130px"
        :rules="editCateFormRules"
      >
        <el-form-item label="旧分类名称" >
          <el-input v-model="newCate.oldCat_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="新分类名称" prop="cat_name">
          <el-input v-model="newCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 分类数据的查询条件
      queryCategoriesInfo: {
        type: 3,
        pagenum: 0, // 页码
        pagesize: 5 // 每页条数
      },
      total: 0,
      // 获取所有分类列表
      categories: [],
      // 表格各列的配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '400px'
        },
        {
          type: 'template',
          label: '是否有效',
          template: 'cat_deleted',
          prop: 'cat_deleted'
        },
        {
          type: 'template',
          label: '等级',
          template: 'cat_level',
          prop: 'cat_level'
        },
        {
          type: 'template',
          label: '操作',
          template: 'setting',
          prop: 'cat_id'
        }
      ],
      // 添加分类的对话框显示与否
      AddCateDialogVisible: false,
      // 添加分类对话框的表单数据
      AddCateForm: {
        // 新增分类的父级id 1级分类，则父分类Id应该设置为  `0
        cat_pid: 0,
        cat_name: '',
        // 分类等级，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      AddCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 级联选择器的配置
      cascaderProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 所有父级分类的列表
      parentCateList: [],
      // 级联选择器 选中的值
      selectedKeys: [],
      // 控制编辑分类对话框的显示与否
      editCateDialogVisible: false,
      // 编辑分类原有分类的数据
      // oldCate: {},
      newCate: { 
        // 新分类名称
        cat_name: '',
        // 原有分类名称
        oldCat_name: ''
      },
      // 编辑分类对话框的验证
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    this.getCategories();
  },
  methods: {
    // 获取所有分类列表
    async getCategories () {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryCategoriesInfo
      });
      if (res.meta.status !== 200) return this.$message.error('获取数据失败');
      this.total = res.data.total;
      this.categories = res.data.result;
    },
    // 每页大小发生变化时
    handleSizeChange (newSize) {
      this.queryCategoriesInfo.pagesize = newSize;
      this.getCategories();
    },
    // 当前页码发生变化时
    handleCurrentChange (newPage) {
      this.queryCategoriesInfo.pagenum = newPage;
      this.getCategories();
    },
    // 点击添加分类的按钮，显示添加分类的对话框
    showAddCateDialog () {
      this.AddCateDialogVisible = true;
      this.getParentCate();
    },
    // 获取父级的分类 一级和二级
    async getParentCate () {
      const { data: res } = await this.$axios.get('categories', {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) return this.$message.error('获取数据失败');
      this.parentCateList = res.data;
    },
    // 获取选择的父级分类信息
    setParentCate () {
      // 选择一级和二级父级
      if (this.selectedKeys.length !== 0) {
        this.AddCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.AddCateForm.cat_level = this.selectedKeys.length;
      } else {
        // 如果没有选择父级分类
        this.AddCateForm.cat_pid = 0;
        this.AddCateForm.cat_level = 0;
      }
    },
    // 新增分类
    async AddCate () {
      this.$refs.AddCateFormRef.validate(valid => {
        if (!valid) return false
      })
      const { data: res } = await this.$axios.post(
        'categories',
        this.AddCateForm
      );
      if (res.meta.status !== 201) return this.$message.error('创建分类失败');
      this.$message.success('创建分类成功');
      this.getCategories();
      this.AddCateDialogVisible = false;
    },
    // 关闭添加分类对话框，重置表单
    resetForm () {
      this.selectedKeys = []
      this.AddCateForm.cat_name = ''
      this.AddCateForm.cat_pid = 0
      this.AddCateForm.cat_level = 0
    },
    // 删除分类
    delCate (cateInfo) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`categories/${cateInfo.cat_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getCategories()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 显示编辑分类对话框
    showEditCate (cateInfo) {
      this.editCateDialogVisible = true
      this.newCate.oldCat_name = cateInfo.cat_name
      this.newCate.cat_id = cateInfo.cat_id
    },
    // 编辑分类
    editCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios.put(`categories/${this.newCate.cat_id}`,
          { cat_name: this.newCate.cat_name })
        if (res.meta.status !== 200) return this.$message.error('编辑分类失败')
        this.$message.success('更新分数成功!')
        this.oldCate = res.data
        this.getCategories()
        this.editCateDialogVisible = false
      })
    }
  },
  watch: {
    // selectedKeys (val) {
    //   console.log(val);
    // }
  }
};
</script>
<style lang="stylus">
#app
  text-align: left

  .tree-table
    margin-top: 10px

  .el-pagination
    margin-top: 10px

.el-dialog
  .el-input
    width: 80%

  .el-cascader
    width: 100%
</style>
