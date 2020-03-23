<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryObj.query" @change="search" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table border style="width: 100%" stripe :data="userList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名称" prop="username" width="180"></el-table-column>
        <el-table-column label="角色" prop="role_name" width="180"></el-table-column>
        <!-- <el-table-column label="创建时间" prop="create_time">
          <template slot-scope="scope">
            {{new Date(2222)}}
            {{scope.row.create_time}}
        </template>-->
        <!-- </el-table-column> -->
        <el-table-column label="手机号码" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="状态" prop="mg_state" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-edit"
                @click="showEdit(scope.row)"
                type="primary"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-delete"
                @click="showDel(scope.row)"
                type="danger"
                :id="scope.row.id"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-setting"
                type="warning"
                @click="showSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        :page-sizes="[2, 10, 20, 40]"
        :page-size="queryObj.pagesize"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        status-icon
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%">
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        :rules="addFormRules"
        status-icon
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog class="setRoleDialog" title="分配角色" 
    :visible.sync="setRoleDialog" 
    @close='resetRoleDialog'
    width="40%">
      <div class="RoleDialogInp">
        <div>
          当前的用户：
          <el-input v-model="roleInfo.username" :disabled="true"></el-input>
        </div>
        <div>
          当前的角色：
          <el-input v-model="roleInfo.role_name" :disabled="true"></el-input>
        </div>
        <div>
          分配新角色：
        <el-select v-model="roleID" placeholder="请选择">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 验证邮箱
    var checkEmail = (rule, val, cb) => {
      var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!reg.test(val)) return cb(new Error('请输入合法的邮箱'));
      cb();
    };
    // 验证手机号码
    var checkMobile = (rule, val, cb) => {
      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(val)) return cb(new Error('请输入合法的手机号码'));
      cb();
    };
    return {
      // 查询用户列表的查询参数
      queryObj: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 用户列表的总条数
      total: 0,
      // 用户列表
      userList: [],
      // 添加用户对话框显示与隐藏的标识位
      dialogVisible: false,
      // 添加用户的表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          },
          { min: 3, max: 10, tigger: 'blur', message: '长度在3~10个字符之间' }
        ],
        password: [
          { required: true, tigger: 'blur', message: '密码不能为空' },
          { min: 6, max: 16, tigger: 'blur', message: '长度在6~16个字符之间' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, tigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          { validator: checkMobile, tigger: 'blur' }
        ]
      },
      // 控制编辑用户对话框的显示与否
      editDialogVisible: false,
      editForm: {
        id: '',
        email: '',
        mobile: ''
      },
      // 控制分配角色对话框的显示与否
      setRoleDialog: false,
      // 显示分配角色时表单数据
      roleInfo: {},
      // 所有角色列表
      roleList: [],
      // 分配角色当前选中的角色id
      roleID: ''
    };
  },
  mounted () {
    this.getUserList();
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryObj
      });
      // // =====================
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败');
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 分页切换每页显示条数的事件
    handleSizeChange (newSize) {
      this.queryObj.pagesize = newSize;
      this.getUserList();
    },
    // 页码发生改变
    handleCurrentChange (newPage) {
      this.queryObj.pagenum = newPage;
      this.getUserList();
    },
    // 搜索框输入搜索用户
    search () {
      this.getUserList();
    },
    // 修改用户状态
    async changUserState (userinfo) {
      const { data: res } = await this.$axios.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        this.userinfo.mg_state = !this.userinfo.mg_state;
        return this.$message.error('修改用户状态失败！');
      }
      this.$message.success('修改用户状态成功！');
    },
    // 添加用户
    async addUser () {
      const { data: res } = await this.$axios.post('users', this.addForm);
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return false;
        if (res.meta.status !== 201) return this.$message.error('添加用户失败');
        this.$message.success('添加用户成功！');
        this.dialogVisible = false;
        this.getUserList();
      });
    },
    // 点击编辑按钮，弹出编辑对话框
    async showEdit (userinfo) {
      this.editDialogVisible = true;
      const { data: res } = await this.$axios.get('users/' + userinfo.id);
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败');
      }
      this.editForm = res.data;
    },
    // 编辑用户
    async editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$axios.put(
          'users/' + this.editForm.id,
          this.editForm
        );
        if (res.meta.status !== 200) return this.$message.error('更新用户失败');
        this.$message.success('更新用户成功');
        this.getUserList();
        this.editDialogVisible = false;
      });
    },
    // 点击删除，删除用户
    showDel (userinfo) {
      // this.delDialogVisible = true
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            'users/' + userinfo.id
          );
          if (res.meta.status !== 200) return this.$message.error('删除失败');
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 显示分配角色对话框
    async showSetRoleDialog (roleInfo) {
      this.setRoleDialog = true;
      this.roleInfo = roleInfo;
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.roleList = res.data
    },
    // 点击确认，分配角色
    async setRole () {
      if (!this.roleID) return this.$message.info('请选择要分配的角色')
      const { data: res } = await this.$axios.put(`users/${this.roleInfo.id}/role`, { rid: this.roleID })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getUserList()
      this.$message.success('更新用户成功')
      this.setRoleDialog = false
    },
    // 分配角色对话框关闭时，重置下拉框信息
    resetRoleDialog () {
      this.roleInfo = {};
      this.roleID = ''
    }
  },
  watch: {
    dialogVisible (val) {
      if (!val) this.$refs.addFormRef.resetFields();
    }
  }
};
</script>
<style lang="stylus" scoped>
.setRoleDialog
  text-align: left
  .RoleDialogInp
    font-size 16px
    .el-select
      margin 4px
    .el-input
      width 70%
      margin 4px

.el-table
  margin-top: 10px

.el-pagination
  margin-top: 10px
</style>
