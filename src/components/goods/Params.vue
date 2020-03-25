<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意,只能修改第三级分类的相关参数" type="warning" :closable="false" show-icon></el-alert>
      <el-row>
        <el-col>
          <span>选择商品的分类 :</span>
          <el-cascader
            v-model="selectedKey"
            :options="categories"
            :props="cascaderProp"
            clearable
            @change="changedCate"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" @click="addDialogVisible=true">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" @click="addDialogVisible=true">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
      <el-table border stripe 
      :data="activeName==='many'?manyTableData:onlyTableData">
        <el-table-column type="expand" >
          <template v-slot='scope'>
            <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="delTagParams(scope.row,index)">{{item}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
          <!-- <template v-slot:default='soltProps'>
            {{soltProps.row.cat_id}}
            <pre>{{soltProps.cat_id}}</pre>
          </template> -->
        </el-table-column>
        <el-table-column type="index" label="序号" width="120px"></el-table-column>
        <el-table-column prop="attr_name" label="参数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="editParams(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="delParams(scope.row.attr_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加参数的对话 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="40%">
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 选中的分类列表id
      selectedKey: [],
      // 所有分类列表
      categories: [],
      // 级联选择器的配置
      cascaderProp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // tag激活的name
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 添加分类对话框的控制
      addDialogVisible: false,
      // 添加分类的表单数据
      addForm: {},
      addFormRules: {
        attr_name: [
          { required: true, message: '参数不能为空', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '参数不能为空', trigger: 'blur' }
        ]
      }
      // 控制tag标签的显示与否 
      // inputVisible: false,
      // // tag标签的内容
      // inputValue: ''
     
    };
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      const { data: res } = await this.$axios.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败');
      }
      this.categories = res.data;
    },
    // 监听级联选择器的change
    async changedCate() {
      // 如果不是选择第三级分类
      if (this.selectedKey.length !== 3) {
        this.selectedKey = [];
        return false;
      }
      this.getAttr();
    },
    // tag 点击切换事件
    handleClick() {
      this.getAttr();
    },
    // 获取分类属性
    async getAttr() {
      // 如果选择了第三级分类 通过切换tag来获取动态参数或静态属性
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) return this.$message.error('获取数据失败');
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
        // 控制tag标签的显示与否 
        item.inputVisible = false
        //  tag标签的文本内容
        item.inputVisible = ''
      });
      // 如果获取的是动态参数
      if (this.activeName === 'many') {
        this.manyTableData = res.data;
      } else {
        // 如果获取的数据是静态属性
        this.onlyTableData = res.data;
      }
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击新增属性，添加属性
    addCateParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) return this.$message.error('新增属性失败');
        this.$message.success('新增成功！');
        this.addDialogVisible = false;
        this.getAttr();
      });
    },
    // 点击确认，修改分类参数
    editCateParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) return this.$message.error('修改失败');
        this.$message.success('修改成功');
        this.getAttr();
        this.editDialogVisible = false;
      });
    },
    editParams(params) {
      this.editForm = params;
      this.editDialogVisible = true;
    },
    // 删除参数
    delParams(attrid) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            `categories/${this.cateId}/attributes/${attrid}`
          );
          if (res.meta.status !== 200) return this.$message.error('删除失败');
          this.getAttr();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 监听键盘enter和点击时
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      this.saveParams(row)
    },
    // 将tag标签的内容保存到数据库
    async saveParams(row) {
      const { data: res } = await this.$axios.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('更新参数项失败')
      this.$message.success('更新参数项成功')
    },
    // 删除标签项
    delTagParams(row, index) {
      row.attr_vals.splice(index, 1)
      this.saveParams(row)
    },
    // 显示tag标签
    showInput(row) {
      row.inputVisible = true
      // input焦点自动聚焦
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  },
  computed: {
    // 监听级联选择器是否选中第三级
    isDisabled() {
      if (this.selectedKey.length !== 3) {
        return true;
      }
      return false;
    },
    // 获取第三级分类的id
    cateId() {
      return this.selectedKey[2] || null;
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数';
      } else {
        return '静态属性';
      }
    }
  },
  watch: {
    // selectedKey (vat) {
    //   console.log(vat)
    // }
  }
};
</script>

<style lang='stylus' scoped>
.el-alert
  margin-bottom: 15px

.el-table
  margin-top: 15px

  .el-tag
    margin: 0 4px
  .input-new-tag
    width 100px
</style>
