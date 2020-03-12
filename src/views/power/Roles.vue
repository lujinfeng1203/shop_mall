<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/rights'}">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/roles'}">角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item in scope.row.children" :key="item.id" class="center">
              <el-col :span="5">
                <el-tag closable @close="removeRightsId(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="item2 in item.children" :key="item2.id" class="center">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsId(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsId(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showsetRightdialog(scope.row)"
            >设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="setRightDialogVisible" @close="setRightDialogClosed">
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rolesList: [],
      setRightDialogVisible: false,
      rightList: [],
      treeProps: {
        label: "authName",
        children: "children"
      },
      defkeys: [],
      roleId:[]
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      let _this = this;
      this.$http.get("roles").then(res => {
        let data = res.data;
        console.log(data);

        if (data.meta.status !== 200) {
          return _this.$message.error("获取角色列表失败");
        }
        _this.rolesList = data.data;
      });
    },
    removeRightsId(role, rightsId) {
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
          this.$http.delete(`roles/${role.id}/rights/${rightsId}`).then(res => {
            console.log(res);

            if (res.status !== 200) {
              return _this.$$message.error("删除失败");
            }
            role.children = res.data.data;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showsetRightdialog(role) {
      let _this = this;
        this.roleId=role.id
      this.$http.get("rights/tree").then(res => {
        let data = res.data;
        if (data.meta.status !== 200) {
          return this.$message.error("获取权限失败");
        }
        this.rightList = data.data;
      });
      this.getLeafkeys(role, this.defkeys);
      this.setRightDialogVisible = true;
      console.log(this.defkeys);
    },

    // 通过递归的形式获取三级权限id ,node 节点
    getLeafkeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafkeys(item, arr);
      });
    },
    // 关闭时清除defkeys数组
    setRightDialogClosed() {
      this.defkeys = [];
    },

    async addRights(){
        let _this=this
        let keys=[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]
        console.log(keys)
        let idstr=keys.join(',')
        this.$http.post(`roles/${this.roleId}/rights`,{rids:idstr})
        .then(res => {
            console.log(res)

            let data=res.data
            if(data.meta.status !==200){
                return _this.$message.error("失败")
            }
            _this.$message.success("成功")
            this.getRolesList()
         
        })
      
           this.setRightDialogVisible=false
        


    }
  }
};
</script>

<style  scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-tag {
  margin: 10px;
}
.center {
  display: flex;
  align-items: center;
}
</style>