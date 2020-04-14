<template>
  <div>
     <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
     
      <el-table
      :data="rightsList"
      border
      stripe
      style="width: 100%">
       <el-table-column type="index" label="序号" width="120">

      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        >
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        
        >
      </el-table-column>
      <el-table-column
        prop="level"
        label="等级"
        >
        <template slot-scope='scope'>
         <el-tag type="primary" v-if="scope.row.level === '0'">一级</el-tag>
         <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
         <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="操作"
        >

      </el-table-column> -->
    </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 用户权限列表
      rightsList: []
    }
  },
  mounted () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$axios.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.rightsList = res.data
    }
  }
}
</script>
