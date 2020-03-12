<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
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
            @clear="gitUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="gitUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="2">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="userList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <!-- 状态 -->
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
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
                @click="removeUsers(scope.row.id)"
              ></el-button>
              <!-- 分配角色 -->
              <el-tooltip content="分配角色" placement="top">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRoles(scope.row)"></el-button>
              </el-tooltip>
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

    <!-- 添加用户  :rules验证规则-->

    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addusers">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="30%" @closed="setRoleDialogColsed" >
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>当前角色：
          <el-select v-model="selectRolesId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </p>
        
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="saveUserRole">确 定</el-button>
      </span>
    </el-dialog>
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
      userList: [],
      rolesList:[],
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
    this.gitUserList();
  },
  methods: {
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
    gitUserList() {
      let _this = this;
      this.$http
        .get("users", { params: this.queryInfo })
        .then(res => {
          let data = res.data;
          console.log(data);
          if (res.status !== 200)
            return _this.$message.error("获取用户列表失败");
          (_this.userList = data.data.users), (_this.total = data.data.total);
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleSizeChange(newsize) {
      console.log(newsize);
      this.queryInfo.pagesize = newsize;
      this.gitUserList();
    },
    // 修改当前页数，请求接口重新
    handleCurrentChange(newpage) {
      console.log(newpage);
      this.queryInfo.pagenum = newpage;
      this.gitUserList();
    },
    userStatusChange(userinfo) {
      let _this = this;
      this.$http
        .put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then(res => {
          let data = res.data;
          if (data.meta.status !== 200) {
            // 失败 立即切回原来的状态
            userinfo.mg_state = !userinfo.mg_state;
            return _this.$$message.error("失败");
          }
          _this.$message.success("成功");

          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    },
    addusers() {
      let _this = this;

      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;

        this.$http.post("users", this.addForm).then(res => {
          let data = res.data;
          console.log(data);
          if (data.meta.status !== 200) {
            return _this.$message.error("添加用户失败");
          }
          _this.$message.success("添加用户成功");
          _this.dialogVisible = false;
          _this.gitUserList();
        });
      });
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

    // 分配角色
 setRoles(userInfo){
      let _this=this
      this.userInfo=userInfo

      this.$http.get('roles').then(
        res=>{
          let data=res.data
          if(data.meta.status !==200){
            return _this.$message.error("失败")
          }
              _this.$message.success("成功")
              _this.rolesList=data.data
        }
      )

      this.setRoleDialogVisible=true


    },

 saveUserRole(){
      let _this=this
      if(!this.selectRolesId){
        return _this.$message.error("请选择角色")

      }
     this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRolesId}).then(
       res=>{
         let data= res.data
         if(data.meta.status!==200){
      return _this.$message.error("失败")
    }
    _this.$message.success("成功")
    _this.gitUserList()
    _this.setRoleDialogVisible=false

         
       }
     )
    

      
    }
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
