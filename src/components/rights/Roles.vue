<template>
  <div id="roles_container">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button type="primary" @click="addRolesVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="rolesList"
        stripe
        border
        :default-sort="{prop: 'roleName', order: 'descending'}"
        style="width: 100%"
      >
        <el-table-column type="expand" width="180">
          <template slot-scope="scope">
           <el-row class="vcenter" v-for="(item1, index) in scope.row.children" :key="index" :class="['bb',index===0?'bt':'']">
            <!-- 一级权限列表 -->
            <el-col :span="4" >
              <el-tag closable @close='delRights(scope.row,item1.id)'>{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级和三级 -->
            <el-col :span="20">
              <el-row v-for="(item2, i2) in item1.children" :key="i2" :class="[i2===0?'':'bt']" class="vcenter">
                <el-col :span="6" >
                  <el-tag type="success" closable @close='delRights(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" v-for="(item, i3) in item2.children" 
                  :key="i3" closable @close='delRights(scope.row,item.id)'>{{item.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
           </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRoles(scope.row)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesVisible" width="30%">
      <el-form ref="addRolesFormRef" :model="addRolesForm" label-width="80px" :rules="addRolesRule">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesVisible" width="30%">
      <el-form ref="editRolesFormRef" :model="editRolesForm" label-width="80px" :rules="addRolesRule">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="setRightsDialogVisible"
  width="50%"
  @close='resetCheckKeyList'
  >
  <el-tree
  ref="rihgtTreeRef"
  show-checkbox
  default-expand-all
  :default-checked-keys="defCheckKeyList"
  node-key='id'
  :data="rightsList"
  :props="defProp"
  check-on-click-node
  > 
</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolesList: [],
      // 添加角色对话框的显示与否
      addRolesVisible: false,
      // 添加角色的表单数据
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的表单验证
      addRolesRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', tigger: 'blur' }
        ],
        roleDesc: []
      },
      // 编辑用户的表单数据
      editRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 控制编辑用户对话框显示与否
      editRolesVisible: false,
      // 控制编辑用户对话框显示与否
      setRightsDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 树形数据的结构定义
      defProp: {
        children: 'children',
        label: 'authName'
      },
      // 树形默认选中的key
      defCheckKeyList: [],
      // 即将分配权限被选中角色id
      seletedRoleID: ''
    };
  },
  mounted () {
    this.getRolesList();
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$axios.get('roles');
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表失败'); }
      this.rolesList = res.data;
    },
    // 添加角色
    addRoles () {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post(
          'roles',
          this.addRolesForm
        );
        if (res.meta.status !== 201) return this.$message.error('添加角色失败');
        this.$message.success('添加角色成功');
        this.addRolesVisible = false;
        this.getRolesList();
      });
    },
    // 删除角色
    delRoles (rolesInfo) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete('roles/' + rolesInfo.id)
        if (res.meta.status !== 200) return this.$message.error('删除角色失败')
        this.getRolesList();
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
    // 点击编辑按钮,显示编辑对话框
    async showEditDialog (rolesInfo) {
      this.editRolesVisible = true
      const { data: res } = await this.$axios.get('roles/' + rolesInfo.id)
      if (res.meta.status !== 200) return this.$message.error('获取角色数据失败')
      this.editRolesForm = res.data
    },
    // 编辑用户
    eidtRoles () {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return 
        const { data: res } = await this.$axios.put('roles/' + this.editRolesForm.roleId, this.editRolesForm)
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        this.$message.success('修改用户成功')
        this.getRolesList()
        this.editRolesVisible = false
      })
    },
    // 删除tag标签权限
    delRights (role, rightsId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightsId}`)
        if (res.meta.status !== 200) return this.$message.error('删除权限失败')
        role.children = res.data
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
    async showSetRightsDialog (role) {
      this.setRightsDialogVisible = true
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限失败')
      this.rightsList = res.data
      this.seletedRoleID = role.id;
      role.children.forEach(item => {
        // 如果有二级权限
        if (item.children) {
          item.children.forEach(item2 => {
            if (item2.children) {
              item2.children.forEach(item3 => {
                this.defCheckKeyList.push(item3.id)
              })
            }
          })
        }
      })
    },
    // 监听关闭分配权限对话框的事件，清空默认选中的数组 defCheckKeyList
    resetCheckKeyList () {
      this.defCheckKeyList = []
    },
    // 分配权限
    async setRights () {
      // 获取所有被选中节点的id
      const checkKeysList = [
        ...this.$refs.rihgtTreeRef.getCheckedKeys(),
        ...this.$refs.rihgtTreeRef.getHalfCheckedKeys()
      ]
      const idStr = checkKeysList.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.seletedRoleID}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightsDialogVisible = false
    }
  },
  watch: {
    addRolesVisible (flag) {
      // 如果关闭表单,清空表单已输入的内容
      if (!flag) this.$refs.addRolesFormRef.resetFields();
    }
  }
};
</script>
<style lang="stylus" scoped>
#roles_container
  text-align: left

.el-table
  margin-top: 10px
  .vcenter
    display flex
    align-items center
  .el-tag
    margin 7px
.bb
  border-bottom 1px solid #ccc
.bt
  border-top 1px solid #ccc
</style>
