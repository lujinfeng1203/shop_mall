<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/categories'}">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/categories'}">商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button type="primary" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="column"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" >
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

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

    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addCatedialogVisible" width="50%" @closed="cateDialogcolsed" >
      <el-form ref="Cateform" :model="addCateform" label-width="80px" :rules="addCateformRules"   >
        <el-form-item label="分类名称">
          <el-input v-model="addCateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedkeys"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCatedialogVisible: false,
      cateList: [],
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedkeys: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      addCateform: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateformRules: {
        cate_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      total: 0,
      column: [
        {
          lable: "分类名称",
          prop: "cat_name"
        },
        { lable: "是否有效", type: "template", template: "isok" },
        {
          lable: "排序",
          type: "template",
          template: "order"
        },
        {
          lable: "操作",
          type: "template",
          template: "opt"
        }
      ]
    };
  },

  methods: {
    getCateList() {
      let _this = this;
      this.$http
        .get("categories", { params: this.queryInfo })
        .then(res => {
          let data = res.data;

          if (data.meta.status !== 200) {
            return _this.$message.error("失败");
          }
          _this.cateList = data.data.result;
          _this.total = data.data.total;
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleSizeChange(newsize) {
      console.log(newsize);
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    // 修改当前页数，请求接口重新
    handleCurrentChange(newpage) {
      console.log(newpage);
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    showCateDialog() {
      this.getparentCateList();

      this.addCatedialogVisible = true;
  
    },
    getparentCateList() {
      let _this = this;
      this.$http.get("categories", { params: { type: 2 } }).then(res => {
        let data = res.data;
        console.log(data);
        if (data.meta.status !== 200) {
          return _this.$message.error("失败");
        }
        _this.parentCateList = data.data
      });
    },
    // 选择项被触发
    parentCateChanged() {
      console.log(this.selectedkeys);
      if(this.selectedkeys.length>0){
       this.addCateform.cate_pid= this.selectedkeys[this.selectedkeys.length -1 ]
        this.addCateform.cate_level=this.selectedkeys.length
        return
      }else{
        this.addCateform.cat_pid=0
        this.addCateform.cat_leve=0
      }
      

    },
    addCate(){
      let _this=this
      console.log(this.addCateform)
      this.$refs.Cateform.validate(valid=>{
        if(!valid) return
        this.$http.post('categories',this.addCateform).then(
          res=>{
            let data=res.data
            console.log(data)
            if(data.meta.status !==201){
              _this.$message.error("失败")
            }
            _this.$message.success("成功")

          },
          
          this.getCateList(),
         this.addCatedialogVisible = false
        )
      })

    },
    cateDialogcolsed(){
      this.$refs.Cateform.resetFields()
      this.selectedkeys=[]
      this.addCateform.cat_level=0
      this.addCateform.cat_pid=0
      this.addCateform.cat_name=""
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style  scoped>
.tree-table {
  margin: 20px 0;
}
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>