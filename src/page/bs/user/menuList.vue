<template>
    <el-row class="warp" style="margin:5px;">
        <el-col :span="24" class="warp-breadcrum">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
            <el-breadcrumb-item>菜单权限管理</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.nodeName" placeholder="菜单权限名称" style="min-width: 120px;" @keyup.enter.native="handleSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.nodeCode" placeholder="菜单权限代码" style="min-width: 120px;" @keyup.enter.native="handleSearch"></el-input>
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
                <el-table-column prop="nodeName" label="菜单权限名称" width="200px" sortable>
                </el-table-column>
                <el-table-column prop="nodeCode" label="菜单权限代码" width="200px" sortable>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180px" sortable>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                    <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="danger" @click="del(scope.$index,scope.row)" size="small">删除</el-button>
                </template>
                </el-table-column>              
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!-- <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button> -->
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="limit" 
                            :total="total" background 
                            style="float:right;">
                </el-pagination>
            </el-col>

            <!--弹出框-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="100px;" :rules="addFormRules" ref="addForm">
                    <el-form-item label="菜单权限名称" prop="nodeName">
                        <el-input v-model="addForm.nodeName" auto-complete="off" placeholder="请输入菜单权限名称"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单权限代码" prop="nodeCode">
                        <el-input v-model="addForm.nodeCode" auto-complete="off" placeholder="请输入菜单权限代码"></el-input>
                    </el-form-item>
                    <el-form-item label="父级菜单代码" prop="parentNodeCode">
                        <el-input v-model="addForm.parentNodeCode" auto-complete="off" placeholder="请输入父级菜单代码"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单层级" prop="nodeLevel">
                        <el-input v-model="addForm.nodeLevel" auto-complete="off" placeholder="请输入菜单层级"></el-input>
                    </el-form-item>
                    <el-form-item label="子节点标记" prop="childFlag">
                        <el-input v-model="addForm.childFlag" auto-complete="off" placeholder="请输入子节点标记1-有，0-无'"></el-input>
                    </el-form-item>
                    <el-form-item label="顺序标记" prop="orderFlag">
                        <el-input v-model="addForm.orderFlag" auto-complete="off" placeholder="请输入顺序标记'"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-input v-model="addForm.status" auto-complete="off" placeholder="请输入状态：1-可用，-0不可用'"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单请求地址" prop="activeUrl">
                        <el-input v-model="addForm.activeUrl" auto-complete="off" placeholder="请输入菜单请求地址"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="noti">
                        <el-input v-model="addForm.noti" auto-complete="off" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="addFormRules" ref="editForm">
                <input type="hidden" v-model="editForm.id"/>
                <el-form-item label="菜单权限名称" prop="nodeName">
                    <el-input v-model="editForm.nodeName" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="菜单权限代码" prop="nodeCode">
                    <el-input v-model="editForm.nodeCode" auto-complete="off"></el-input>
                </el-form-item>      
                
                <el-form-item label="父级菜单代码" prop="parentNodeCode">
                    <el-input v-model="editForm.parentNodeCode" auto-complete="off" placeholder="请输入父级菜单代码"></el-input>
                </el-form-item>
                <el-form-item label="菜单层级" prop="nodeLevel">
                    <el-input v-model="editForm.nodeLevel" auto-complete="off" placeholder="请输入菜单层级"></el-input>
                </el-form-item>
                <el-form-item label="子节点标记" prop="childFlag">
                    <el-input v-model="editForm.childFlag" auto-complete="off" placeholder="请输入子节点标记1-有，0-无'"></el-input>
                </el-form-item>
                <el-form-item label="顺序标记" prop="orderFlag">
                    <el-input v-model="editForm.orderFlag" auto-complete="off" placeholder="请输入顺序标记'"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-input v-model="editForm.status" auto-complete="off" placeholder="请输入状态：1-可用，-0不可用'"></el-input>
                </el-form-item>
                <el-form-item label="菜单请求地址" prop="activeUrl">
                    <el-input v-model="editForm.activeUrl" auto-complete="off" placeholder="请输入菜单请求地址"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="noti">
                    <el-input v-model="editForm.noti" auto-complete="off" placeholder="请输入备注"></el-input>
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
            if (this.addForm.nodeCode != ''){
                let param = new URLSearchParams();
                param.append("nodeCode", this.addForm.nodeCode)
                this.axios.post(`${this.api.baseURL}/menu/getCountByNodeCode`, param).then(res =>{
                    if (parseInt(res.data.data.result) > 0){
                        callback(new Error('已存在相同的菜单代码!')) 
                    }else callback()
                })
            }else callback()  //空值则默认成功
        };        
        return{
            taskCateList: [],
            filters:{
                nodeName: '',
                nodeCode: '',
                createTime: ''
            },
            total: 0,
            page: 1,
            limit: 10,
            loading: false,
            addFormVisible : false,  //新增界面是否显示
            addFormRules :{
                nodeName :[
                    {required: true, message : '请输入名称', trigger : 'blur'},
                    {min:2, max:60, message: '必须输入2-60个字', trigger: 'blur'}
                ],
                nodeCode: [
                    {required: true, message: '请输入描述', trigger: 'blur'},
                    {max:60, message: '备注文字太长', trigger: 'blur'},
                    {validator: checkExistsCateDesc, trigger: 'blur'} //自定义校验
                ]
            },
            addForm: {
                nodeName: "",
                nodeCode: ""
            },
            editFormVisible: false,
            editForm: {
                id: "",
                nodeName: "",
                nodeCode: ""                
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
                searchByKeys: {nodeName: that.filters.nodeName, nodeCode: that.filters.nodeCode},
                orderByKeys: {createTime: 'desc'}
            }
            // that.loading = true // show loading progress  
            that.axios.post(`${this.api.baseURL}/menu/getPageMenu`, params).then(res =>{
                //console.log(res);
                that.taskCateList = res.data.data.result.content;
                that.total = res.data.data.result.totalRecord;
                /*this.taskCateList = [
                    {id:'9e9a4a2320c44c70adc4572c87ae0824', nodeName:'AAAA', nodeCode: 'remark1'}, 
                    {id:'222', nodeName:'BBBB', nodeCode: 'remark2'}
                ]*/
            })

        },
        handleAddNew(){
            this.addFormVisible = true;
            this.addForm = {
                nodeName: "",
                nodeCode: ""
            }            
        },
        addSubmit: function(){
            let that = this
            this.$refs.addForm.validate((valid) =>{
                if(valid){
                    let para = Object.assign({}, this.addForm);
                    that.axios.post(`${this.api.baseURL}/menu/createMenu`, para).then(function(result){
                        //console.log(result);
                        if ((result) && (result.data.code == '200')){ //保存成功
                            that.$message.success({showClose: true, message: '添加成功', duration: 2000});
                            that.$refs['addForm'].resetFields();
                            that.addFormVisible = false;
                            that.search();
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
                    that.axios.post(`${this.api.baseURL}/menu/updateMenu`, para).then(function(result){
                        //console.log(result);
                        if ((result) && (result.data.code == '200')){ //修改成功
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
        del(index, row){
            this.$confirm('您确定要删除【' + row.nodeName + '】吗？', '提示', 
                {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => 
            {
                let that = this
                let param = new URLSearchParams();
                param.append("id", row.id)
                that.axios.post(`${this.api.baseURL}/menu/deleteMenu`, param).then(function(result){
                    console.log(result);
                    if ((result) && (result.data.code == '200')){ //删除成功
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