<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon></el-alert>
      <el-steps :space="200" :active="+activeIndex" finish-status="success" :align-center="true">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTagLeave"
          @tab-click="clickTab"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="分类参数" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item
              :label="item.attr_name"
              prop="attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item2" v-for="(item2, i2) in item.attr_vals" :key="i2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              :action="uploadURL"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadImgSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="add" class="addBtn">添加商品</el-button>
          </el-tab-pane>
          <!-- <el-tab-pane label="完成">定时任务补偿</el-tab-pane> -->
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览的对话框 -->
    <el-dialog title="预览图片" :visible.sync="previewVisible" width="50%">
      <img :src="previewImgURL" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条的所显示的索引
      activeIndex: '0',
      // 添加商品的表单对象数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '分类参数不能为空', trigger: 'blur' }
        ]
      },
      // 级联选择器的配置选项
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        expandTrigger: 'hover',
        children: 'children'
      },
      // 分类参数列表
      cateList: [],
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的路径
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        // 上传的图片的token
        Authorization: sessionStorage.getItem('vue_shop_token')
      },
      // 预览图片的路径
      previewImgURL: '',
      // 预览图片对话框的显示与否
      previewVisible: false
    };
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$axios.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类参数失败');
      }
      this.cateList = res.data;
    },
    // 处理级联选择器的改变
    async handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 切换标签页前的操作,如果没有选择分类参数则无法切换
    beforeTagLeave() {
      if (this.activeIndex === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('分类参数不能空');
        return false;
      }
    },
    async clickTab() {
      // 获取动态参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败');
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals === '' ? [] : item.attr_vals.split(' ');
        });
        this.manyTableData = res.data;
      }
      // 获取静态属性
      if (this.activeIndex === '2') {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error('获取属性失败');
        }

        this.onlyTableData = res.data;
      }
    },
    // 图片预览
    handlePreview(file) {
      this.previewImgURL = file.response.data.url;
      this.previewVisible = true;
    },
    // 删除图片
    handleRemove(file) {
      const tmpPath = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(x => x.pic === tmpPath);
      this.addForm.pics.splice(index, 1);
    },
    // 图片上传成功的处理
    uploadImgSuccess(res) {
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.addForm.pics.push({
        pic: res.data.tmp_path
      });
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的信息')
        // 说明 ； 如果没有切换商品参数和商品属性tag 则没有attrs为空，因为没有请求
        // 处理动态参数
        this.manyTableData.forEach(item => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          })
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        const form = JSON.parse(JSON.stringify(this.addForm))
        form.goods_cat = form.goods_cat.join(',')
        const { data: res } = await this.$axios.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    } 
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat[2] || null;
    }
  },
  watch: {
    // manyTableData: {
    //   deep: true,
    //   handler() {
    //     console.log(this.manyTableData)
    //   }
    // }
  }
};
</script>

<style lang='stylus' scoped>
.el-steps
  margin-top: 20px

.el-tabs
  margin-top: 10px

.el-checkbox
  margin: 0 15px 0 0 !important

.previewImg
  width: 100%

.addBtn
  margin-top: 10px
</style>
