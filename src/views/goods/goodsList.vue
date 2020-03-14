<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!--搜索 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="gitGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="gitGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品 -->
        <el-col :span="2">
          <el-button type="primary" @click="goodsAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="goodsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格" prop="goods_price"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
          <el-table-column label="创建时间" prop="add_time">
              <template slot-scope="scope">
                  {{scope.row.add_time | dateFormat}}
              </template>
          </el-table-column>
     
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editDialog(scope.row.id)"
              ></el-button>
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeGoods(scope.row.id)"
              ></el-button>
           
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 5]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-row>
    </el-card>

  
  </div>
</template>

<script>
export default {
  name: "Users",

  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };

    return {
      goodsList: [],
     
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      dialogVisible: false,
      editdialogVisible: false,
      setRoleDialogVisible:false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editForm: {},
      userInfo:{},
      selectRolesId:"",

      rules: {
        // 添加表单验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度3～10个字符"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度6～10个字符"
          }
        ],
        email: [
          { required: true, message: "请输邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },

  created() {
    this.gitGoodsList();
  },
  methods: {
      goodsAddPage(){
          this.$router.push('/goods/add')

      },

      
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    setRoleDialogColsed(){
      this.selectRolesId='',
      this.userInfo={}


    },
    gitGoodsList() {
      let _this = this;
      this.$http
        .get("goods", { params: this.queryInfo })
        .then(res => {
          let data = res.data;
          console.log(data);
          if (res.status !== 200)
            return _this.$message.error("失败");
          (_this.goodsList = data.data.goods), (_this.total = data.data.total);
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleSizeChange(newsize) {
      console.log(newsize);
      this.queryInfo.pagesize = newsize;
      this.gitGoodsList();
    },
    // 修改当前页数，请求接口重新
    handleCurrentChange(newpage) {
      console.log(newpage);
      this.queryInfo.pagenum = newpage;
      this.gitGoodsList();
    },


    // 查询用户
    editDialog(id) {
      let _this = this;
      this.editdialogVisible = true;
      this.$http.get("users/" + id).then(res => {
        let data = res.data;
        if (data.meta.status !== 200) {
          return _this.$message.error("查询用户失败");
        }
        _this.editForm = data.data;
      });
    },
    editUsers() {
      let _this = this;
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;

        this.$http
          .put("users/" + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          .then(res => {
            let data = res.data;
            console.log(data);
            if (data.meta.status !== 200) {
              return _this.$message.error("修改用户失败");
            }
            _this.$message.success("修改用户成功");
            _this.editdialogVisible = false;
            _this.gitUserList();
          });
      });
    },
    removeUsers(id) {
      let _this = this;
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$http.delete("users/" + id).then(res => {
            let data = res.data;
            if (data.meta.status !== 200) {
              return _this.$message.error("删除用户失败");
            }
            _this.gitUserList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },



  }
};
</script>

<style  scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-row {
  margin-bottom: 20px;
}
</style>
