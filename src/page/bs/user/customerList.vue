<template>
    <el-row class="warp" style="margin:5px;">
        <el-col :span="24" class="warp-breadcrum">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
            <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.orgName" placeholder="客户名称" style="min-width: 120px;" @keyup.enter.native="handleSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.orgCode" placeholder="客户代码" style="min-width: 120px;" @keyup.enter.native="handleSearch"></el-input>
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
                <el-table-column prop="orgName" label="客户名称" width="200px" sortable>
                </el-table-column>
                <el-table-column prop="orgCode" label="客户代码" width="200px" sortable>
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
                    <el-form-item label="客户名称" prop="orgName">
                        <el-input v-model="addForm.orgName" auto-complete="off" placeholder="请输入客户名称"></el-input>
                    </el-form-item>
                    <el-form-item label="客户代码" prop="orgCode">
                        <el-input v-model="addForm.orgCode" auto-complete="off" placeholder="请输入客户代码"></el-input>
                    </el-form-item>
                    <el-form-item label="客户类型" prop="type">
                        <el-input v-model="addForm.type" auto-complete="off" placeholder="请输入客户类型1 企业 2 个体户"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-input v-model="addForm.status" auto-complete="off" placeholder="状态（是否启用：1启用，2停用）"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="orderFlag">
                        <el-input v-model="addForm.orderFlag" auto-complete="off" placeholder="排序"></el-input>
                    </el-form-item>
                    <el-form-item label="省code" prop="province">
                        <el-input v-model="addForm.province" auto-complete="off" placeholder="省code"></el-input>
                    </el-form-item>
                    <el-form-item label="市code" prop="city">
                        <el-input v-model="addForm.city" auto-complete="off" placeholder="市code"></el-input>
                    </el-form-item>
                    <el-form-item label="县code" prop="county">
                        <el-input v-model="addForm.county" auto-complete="off" placeholder="县code"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="addForm.address" auto-complete="off" placeholder="地址"></el-input>
                    </el-form-item>
                    <el-form-item label="邮政编码" prop="zipcode">
                        <el-input v-model="addForm.zipcode" auto-complete="off" placeholder="邮政编码"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phone">
                        <el-input v-model="addForm.phone" auto-complete="off" placeholder="电话号码"></el-input>
                    </el-form-item>
                    <el-form-item label="传真" prop="fax">
                        <el-input v-model="addForm.fax" auto-complete="off" placeholder="传真"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email" auto-complete="off" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="网页地址" prop="webAddress">
                        <el-input v-model="addForm.webAddress" auto-complete="off" placeholder="网页地址"></el-input>
                    </el-form-item>
                    <el-form-item label="客户机构负责人姓名" prop="satrapName">
                        <el-input v-model="addForm.satrapName" auto-complete="off" placeholder="客户机构负责人姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="机构负责人电话" prop="satrapPhone">
                        <el-input v-model="addForm.satrapPhone" auto-complete="off" placeholder="机构负责人电话"></el-input>
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
                <el-form-item label="客户名称" prop="orgName">
                    <el-input v-model="editForm.orgName" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="客户代码" prop="orgCode">
                    <el-input v-model="editForm.orgCode" auto-complete="off"></el-input>
                </el-form-item>  
                     
                    <el-form-item label="客户类型" prop="type">
                        <el-input v-model="editForm.type" auto-complete="off" placeholder="请输入客户类型1 企业 2 个体户"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-input v-model="editForm.status" auto-complete="off" placeholder="状态（是否启用：1启用，2停用）"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="orderFlag">
                        <el-input v-model="editForm.orderFlag" auto-complete="off" placeholder="排序"></el-input>
                    </el-form-item>
                    <el-form-item label="省code" prop="province">
                        <el-input v-model="editForm.province" auto-complete="off" placeholder="省code"></el-input>
                    </el-form-item>
                    <el-form-item label="市code" prop="city">
                        <el-input v-model="editForm.city" auto-complete="off" placeholder="市code"></el-input>
                    </el-form-item>
                    <el-form-item label="县code" prop="county">
                        <el-input v-model="editForm.county" auto-complete="off" placeholder="县code"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="editForm.address" auto-complete="off" placeholder="地址"></el-input>
                    </el-form-item>
                    <el-form-item label="邮政编码" prop="zipcode">
                        <el-input v-model="editForm.zipcode" auto-complete="off" placeholder="邮政编码"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phone">
                        <el-input v-model="editForm.phone" auto-complete="off" placeholder="电话号码"></el-input>
                    </el-form-item>
                    <el-form-item label="传真" prop="fax">
                        <el-input v-model="editForm.fax" auto-complete="off" placeholder="传真"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email" auto-complete="off" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="网页地址" prop="webAddress">
                        <el-input v-model="editForm.webAddress" auto-complete="off" placeholder="网页地址"></el-input>
                    </el-form-item>
                    <el-form-item label="客户机构负责人姓名" prop="satrapName">
                        <el-input v-model="editForm.satrapName" auto-complete="off" placeholder="客户机构负责人姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="机构负责人电话" prop="satrapPhone">
                        <el-input v-model="editForm.satrapPhone" auto-complete="off" placeholder="机构负责人电话"></el-input>
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
            if (this.addForm.orgCode != ''){
                let param = new URLSearchParams();
                param.append("orgCode", this.addForm.orgCode)
                this.axios.post(`${this.api.baseURL}/customerOrg/getCountByOrgCode`, param).then(res =>{
                    if (parseInt(res.data.data.result) > 0){
                        callback(new Error('已存在相同的分类名称!')) 
                    }else callback()
                })
            }else callback()  //空值则默认成功
        };        
        return{
            taskCateList: [],
            filters:{
                orgName: '',
                orgCode: '',
                createTime: ''
            },
            total: 0,
            page: 1,
            limit: 10,
            loading: false,
            addFormVisible : false,  //新增界面是否显示
            addFormRules :{
                orgName :[
                    {required: true, message : '请输入名称', trigger : 'blur'},
                    {min:2, max:60, message: '必须输入2-60个字', trigger: 'blur'}
                ],
                orgCode: [
                    {required: true, message: '请输入描述', trigger: 'blur'},
                    {max:60, message: '备注文字太长', trigger: 'blur'},
                    {validator: checkExistsCateDesc, trigger: 'blur'} //自定义校验
                ]
            },
            addForm: {
                orgName: "",
                orgCode: ""
            },
            editFormVisible: false,
            editForm: {
                id: "",
                orgName: "",
                orgCode: ""                
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
                searchByKeys: {orgName: that.filters.orgName, orgCode: that.filters.orgCode},
                orderByKeys: {createTime: 'desc'}
            }
            // that.loading = true // show loading progress  
            that.axios.post(`${this.api.baseURL}/customerOrg/getPageCustomerOrg`, params).then(res =>{
                //console.log(res);
                that.taskCateList = res.data.data.result.content;
                that.total = res.data.data.result.totalRecord;
                /*this.taskCateList = [
                    {id:'9e9a4a2320c44c70adc4572c87ae0824', orgName:'AAAA', orgCode: 'remark1'}, 
                    {id:'222', orgName:'BBBB', orgCode: 'remark2'}
                ]*/
            })

        },
        handleAddNew(){
            this.addFormVisible = true;
            this.addForm = {
                orgName: "",
                orgCode: ""
            }            
        },
        addSubmit: function(){
            let that = this
            this.$refs.addForm.validate((valid) =>{
                if(valid){
                    let para = Object.assign({}, this.addForm);
                    that.axios.post(`${this.api.baseURL}/customerOrg/createCustomerOrg`, para).then(function(result){
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
                    that.axios.post(`${this.api.baseURL}/customerOrg/updateCustomerOrg`, para).then(function(result){
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
            this.$confirm('您确定要删除【' + row.orgName + '】吗？', '提示', 
                {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => 
            {
                let that = this
                let param = new URLSearchParams();
                param.append("id", row.id)
                that.axios.post(`${this.api.baseURL}/customerOrg/deleteCustomerOrg`, param).then(function(result){
                    //console.log(result);
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