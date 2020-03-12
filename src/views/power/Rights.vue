<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path:'/home'}" >首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path:'/rights'}" >权限管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path:'/rights'}">权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>

          <el-table :data="rightsList" border stripe >
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column  label="权限名称" prop="authName"></el-table-column>
              <el-table-column label="权限路径" prop="path"></el-table-column>
              <el-table-column label="权限等级" prop="level">
                  <template slot-scope="scope">
                      <el-tag v-if="scope.row.level =='0'">一级</el-tag>
                      <el-tag type="success" v-else-if="scope.row.level =='1'">二级</el-tag>
                      <el-tag type="warning" v-else >三级</el-tag>
                  </template>
              </el-table-column>


          </el-table>
        </el-card>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                
                // 权限列表
                rightsList:[]
            }
        },
        created(){
            this.getRightsList()

        },
        methods:{
            getRightsList(){
               let  _this=this
                this.$http.get('rights/list').then(
                    res=>{
                       
                        let data= res.data
                        console.log(data)
                      
                        
                        if(data.meta.status!==200){
                          return _this.$message.error("获取权限列表失败")
                        }
                        _this.rightsList=data.data
                        
                       
                    }
                )


            }
        }
        
    }
</script>
 
<style  scoped>

.el-breadcrumb{
    margin-bottom: 20px;
}

</style>