<template>
    <el-row class="warp" style="margin:5px;">
        <el-col :span="24" class="warp-breadcrum">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
            <el-breadcrumb-item>运单分类管理</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.categoryDesc" placeholder="项目名称" style="min-width: 120px;" @keyup.enter.native="handleSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.remarks" placeholder="项目描述" style="min-width: 120px;" @keyup.enter.native="handleSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleAddNew">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        
            <!--列表-->
            <el-table :data="taskCateList" highlight-current-row v-loading="loading" style="width: 100%;" stripe>
                <el-table-column type="index" width="60px">
                </el-table-column>
                <el-table-column prop="id" label="id" v-if="false"></el-table-column>
                <el-table-column prop="categoryDesc" label="项目名称" width="200px" sortable>
                </el-table-column>
                <el-table-column prop="remarks" label="项目描述" width="200px" sortable>
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" width="180px" sortable>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                    <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="danger" @click="delUser(scope.$index,scope.row)" size="small">删除</el-button>
                </template>
                </el-table-column>              
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!-- <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button> -->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="limit" 
                            :total="total" background 
                            style="float:right;">
                </el-pagination>
            </el-col>

            <!--弹出框-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="100px;" :rules="addFormRules" ref="addForm">
                    <el-form-item label="名称" prop="categoryDesc">
                        <el-input v-model="addForm.categoryDesc" auto-complete="off" placeholder="请输入分类名称"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="remarks">
                        <el-input v-model="addForm.remarks" auto-complete="off" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="addFormRules" ref="editForm">
                <el-form-item label="名称" prop="categoryDesc">
                    <el-input v-model="editForm.categoryDesc" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remarks">
                    <el-input v-model="editForm.remarks" auto-complete="off"></el-input>
                </el-form-item>       
                </el-form>
                <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog>         
            <!--弹出框-->
        </el-col>
    </el-row>
</template>

<script>
export default{
    data(){
        //在此自定义校验，如新录入数据，在输入后校验后台是否重复
        var checkExistsCateDesc = (rule, value, callback) =>{
            if (this.addForm.categoryDesc != ''){
                let param = new URLSearchParams();
                param.append("cateDesc", this.addForm.categoryDesc)
                this.axios.post(`${this.api.baseURL}/bsresource/getCountByCateDesc`, param).then(res =>{
                    if (parseInt(res.data.data.result) > 0){
                        callback(new Error('已存在相同的分类名称!')) 
                    }else callback()
                })
            }else callback()  //空值则默认成功
        };        
        return{
            taskCateList: [],
            filters:{
                categoryDesc: '',
                remarks: ''
            },
            total: 0,
            page: 1,
            limit: 10,
            loading: false,
            addFormVisible : false,  //新增界面是否显示
            addFormRules :{
                categoryDesc :[
                    {required: true, message : '请输入名称', trigger : 'blur'},
                    {min:2, max:60, message: '必须输入2-60个字', trigger: 'blur'},
                    {validator: checkExistsCateDesc, trigger: 'blur'} //自定义校验
                ],
                remarks: [
                    {required: true, message: '请输入描述', trigger: 'blur'},
                    {max:60, message: '备注文字太长', trigger: 'blur'}
                ]
            },
            addForm: {
                categoryDesc: "",
                remarks: ""
            },
            editFormVisible: false,
            editForm: {
                id: "",
                categoryDesc: "",
                remarks: ""                
            }
        }
    },
    methods:{
        handleSearch(){
            this.total = 0;
            this.page = 1;
            this.search();
        },
        handleCurrentChange(val){
            this.page = val;
            this.search();
        },
        search: function(){
            let that = this
            let params = {
                currentPage: that.page,
                pageSize: that.limit,
                searchByKeys: {categoryDesc: that.filters.categoryDesc, remarks: that.filters.remarks},
                orderByKeys: {createDate: 'desc'}
            }
            // that.loading = true // show loading progress  
            that.axios.post(`${this.api.baseURL}/bsresource/getTaskCategoryList`, params).then(res =>{
                //console.log(res);
                that.taskCateList = res.data.data.result.content;
                that.total = res.data.data.result.totalRecord;
                /*this.taskCateList = [
                    {id:'9e9a4a2320c44c70adc4572c87ae0824', categoryDesc:'AAAA', remarks: 'remark1'}, 
                    {id:'222', categoryDesc:'BBBB', remarks: 'remark2'}
                ]*/
            })

        },
        handleAddNew(){
            this.addFormVisible = true;
            this.addForm = {
                categoryDesc: "",
                remarks: ""
            }            
        },
        addSubmit: function(){
            let that = this
            this.$refs.addForm.validate((valid) =>{
                if(valid){
                    let para = Object.assign({}, this.addForm);
                    that.axios.post(`${this.api.baseURL}/bsresource/createTaskCategory`, para).then(function(result){
                        //console.log(result);
                        if ((result) && (result.status == '200')){ //保存成功
                            that.$message.success({showClose: true, message: '添加成功', duration: 2000});
                            that.$refs['addForm'].resetFields();
                            that.addFormVisible = false;
                            //that.search();
                        }else{
                            that.$message.error({showClose: true, message: '添加失败', duration: 2000});
                        }
                    })
                }
            })
        },
        editSubmit: function(){
            let that = this
            this.$refs.editForm.validate((valid) =>{
                if(valid){
                    let para = Object.assign({}, this.editForm);
                    that.axios.post(`${this.api.baseURL}/bsresource/updateTaskCategory`, para).then(function(result){
                        //console.log(result);
                        if ((result) && (result.status == '200')){ //修改成功
                            that.$message.success({showClose: true, message: '修改成功', duration: 2000});
                            that.$refs['editForm'].resetFields();
                            that.editFormVisible = false;
                            that.search();
                        }else{
                            that.$message.error({showClose: true, message: '修改失败', duration: 2000});
                        }
                    })
                }
            })
        },
        showEditDialog(index, row){
            //console.log(row);
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        delUser(index, row){
            this.$confirm('您确定要删除【' + row.categoryDesc + '】吗？', '提示', 
                {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => 
            {
                let that = this
                let param = new URLSearchParams();
                param.append("id", row.id)
                that.axios.post(`${this.api.baseURL}/bsresource/deleteTaskCategory`, param).then(function(result){
                    //console.log(result);
                    if ((result) && (result.status == '200')){ //删除成功
                        that.$message.success({showClose: true, message: '已删除', duration: 2000});
                        that.search();
                    }else{
                        that.$message.error({showClose: true, message: '删除失败', duration: 2000});
                    }
                })
            }).catch(() => {
                this.$message({type: 'info', message: '已取消删除'});          
            });
        }
    },
    mounted(){
        this.handleSearch();
    }
}
</script>