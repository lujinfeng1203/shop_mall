<template>
  <div id="params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/params'}">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/params'}">分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert show-icon type="warning" title="警告警告警告警告警告警告警告警告" :closable="false"></el-alert>

      <el-row>
        <el-col>
          <span style="font-size:16px">选择商品分类：</span>
          <el-cascader
           expand-trigger="hover"
            :options="cateList"
            :props="cataProps"
            v-model="selectedkeys"
            @change="CateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- d动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" :closable="true" @close="removetag(i,scope.row)">{{item}}</el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>

                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditdialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeparams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
              <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" :closable="true" @close="removetag(i,scope.row)">{{item}}</el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>

                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditdialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeparams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加'+TitleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="Dialogclosed"
    >
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="100px">
        <el-form-item :label="TitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改'+TitleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogclosed"
    >
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item :label="TitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cataProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedkeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      inputVisible:false,
      inputValue:"",
      addForm: {
        attr_name: ""
      },
      editForm: {},
      rules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      let _this = this;
      this.$http.get("categories").then(res => {
        let data = res.data;
        console.log(data);
        _this.cateList = data.data;
      });
    },
    // 级联选择框变化触发
    CateChanged() {
      this.getparamsdata();
    },
    // tab 页面点击函数
    handleTabClick() {
      this.getparamsdata();
    },
    // 获取参数的列表数据函数
    getparamsdata() {
      let _this = this;
      if (this.selectedkeys.length !== 3) {
        this.selectedkeys = [];
        return;
      }

      //   选择三级，获取下面的分类参数

      this.$http
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName }
        })
        .then(res => {
          let data = res.data;
          data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
            item.inputVisible=false
            item.inputValue=''
          });

          console.log(data);
          if (_this.activeName === "many") {
            _this.manyTableData = data.data;
          } else {
            _this.onlyTableData = data.data;
          }
          console.log(_this.manyTableData);
          console.log(_this.onlyTableData);
        });
    },
    Dialogclosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogclosed() {
      this.$refs.editFormRef.resetFields();
    },
    addparams() {
      let _this = this;
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        this.$http
          .post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          .then(res => {
            let data = res.data;
            _this.getparamsdata();
            _this.addDialogVisible = false;
          });
      });
    },
    editparams() {
      let _this = this;
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        this.$http
          .put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName
            }
          )
          .then(res => {
            let data = res.data;

            _this.getparamsdata();
            _this.editDialogVisible = false;
          });
      });
    },
    // 编辑对话框

    showEditdialog(attr_id) {
      let _this = this;
      this.$http
        .get(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: {
            attr_sel: this.activeName
          }
        })
        .then(res => {
          console.log(res);
          let data = res.data;
          _this.editForm = data.data;
        });

      this.editDialogVisible = true;
    },
    removeparams(attr_id) {
      let _this = this;
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$http
            .delete(`categories/${this.cateId}/attributes/${attr_id}`)
            .then(res => {
              _this.getparamsdata();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

   
    },
      // 失去焦点或者按下enter 触发
        handleInputConfirm(row){
            // 没有输入内容
            if(row.inputValue.trim().length===0){
                row.inputValue=''
                 row.inputVisible=false
                 return
            }
            // 输入了内容
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue=''
            row.inputVisible=false
            this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_vals:row.attr_vals.join(),
                attr_sel:row.attr_sel,

            })

           

        },
        showInput(row){
            row.inputVisible=true
              this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });

        },
        removetag(i,row){
            row.attr_vals.splice(i,1)
            this.saveattrvalues(row)


        },
        saveattrvalues(row){
            this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_vals:row.attr_vals.join(),
                attr_sel:row.attr_sel,

            })


        }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedkeys.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectedkeys.length === 3) {
        return this.selectedkeys[2];
      }
      return null;
    },
    TitleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>

<style scoped>
#params {
  font-size: 16px;
}
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-alert {
  margin: 20px 0;
  padding: 0;
  background-color: #fff;
  line-height: 10px;
}
</style>