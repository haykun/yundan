<template>
    <el-row class="warp" style="margin:5px;">
        <el-col :span="24" class="warp-breadcrum">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
            <el-breadcrumb-item>常用地址管理</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
                
        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.addressCode" placeholder="地址编码" style="min-width: 120px;" @keyup.enter.native="handleSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.addressName" placeholder="地址/单位名称" style="min-width: 120px;" @keyup.enter.native="handleSearch"></el-input>
                    </el-form-item>
                            <el-form-item label="地址类型" prop="addressType">
                                <el-select v-model="filters.addressType" placeholder="请选择地址类型" style="width:70%">
                                    <el-option v-for="i in addressTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                </el-select>
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
            <el-table :data="addressList" highlight-current-row v-loading="loading" style="width: 100%;" stripe>
                <el-table-column prop="id" label="id" v-if="false"></el-table-column>
                <!-- 列显示转换 -->
                <el-table-column prop="addressType" label="类型" width="100px" sortable :formatter="formatAddrType"> 
                </el-table-column>
                <el-table-column prop="addressCode" label="编码" width="100px" sortable>
                </el-table-column>
                <el-table-column prop="addressName" label="单位名称" width="180px" sortable>
                </el-table-column>
                <!-- 列显示转换 -->
                <el-table-column prop="pcdName" label="省市区" width="200px" sortable :formatter="formatPcdName">
                </el-table-column>              
                <el-table-column prop="street" label="详细地址" width="180px" sortable>
                </el-table-column>  
                <el-table-column prop="currentContactPerson" label="联系人" width="200px" sortable>
                </el-table-column> 
                <el-table-column prop="currentContactMobile" label="联系电话" width="180px" sortable>
                </el-table-column>                                                                      
                <el-table-column fixed="right" prop="createDate" label="创建时间" width="180px" sortable>
                </el-table-column>                
                <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                    <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="danger" @click="delAddress(scope.$index,scope.row)" size="small">删除</el-button>
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
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" :before-close="beforeCloseAddForm">
                <el-form :model="addForm" label-width="100px;" :rules="addFormRules" ref="addForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="地址类型" prop="addressType">
                                <el-select v-model="addForm.addressType" placeholder="请选择地址类型" style="width:70%">
                                    <el-option v-for="i in addressTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="地址编码" prop="addressCode">
                                <el-input v-model="addForm.addressCode" auto-complete="off" placeholder="请输入地址编码" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="省市区县" prop="pcdCode">
                        <!-- 在此实现父子组件之间的传值 @pcdChange由子组件触发向父传值；  :tempPcdText="this.pcdCodeStr"触发子组件的tempPcdText监控-->
                        <add-pcd v-model="addForm.pcdCode" @pcdChange="pcdChange" :tempPcdText="this.pcdCodeStr"></add-pcd>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="street">
                        <el-input v-model="addForm.street" auto-complete="off" @change="convertAddr2LonLat" placeholder="请输入详细地址" style="width:80%"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人员" prop="currentContactPerson">
                                <el-input v-model="addForm.currentContactPerson" auto-complete="off" placeholder="请输入联系人" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系手机" prop="currentContactMobile">
                                <el-input v-model="addForm.currentContactMobile" auto-complete="off" placeholder="请输入联系电话" style="width:70%"></el-input>
                            </el-form-item>                            
                        </el-col>                        
                    </el-row>
                    <el-form-item label="单位名称" prop="addressName">
                        <el-input v-model="addForm.addressName" auto-complete="off" placeholder="请输入单位名称" style="width:80%"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="经度" prop="longitudeX">
                                <el-input v-model="addForm.longitudeX" auto-complete="off" placeholder="自动计算经度" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="纬度" prop="latitudeY">
                                <el-input v-model="addForm.latitudeY" auto-complete="off" placeholder="自动计算纬度" style="width:70%"></el-input>
                            </el-form-item>                            
                        </el-col>                        
                    </el-row>
                    <!-- <el-form-item label="TEST"> 另外一个简单的父子传值的例子，相关代码可删除
                        <add-test v-model="addForm.test" :message1="addForm.addressName"></add-test>
                    </el-form-item> -->
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="beforeCloseAddForm">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="addFormRules" ref="editForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="地址类型" prop="addressType">
                                <el-select v-model="editForm.addressType" placeholder="请选择地址类型" style="width:70%" :disabled="true">
                                    <el-option v-for="i in addressTypeEnum" :key="i.val" :label="i.lbl" :value="i.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="地址编码" prop="addressCode">
                                <el-input v-model="editForm.addressCode" auto-complete="off" placeholder="请输入地址编码" style="width:70%" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="省市区县" prop="pcdCode">
                        <!-- 在此实现父子组件之间的传值 @pcdChange由子组件触发向父传值；  :tempPcdText="this.pcdCodeStr"触发子组件的tempPcdText监控-->
                        <add-pcd v-model="editForm.pcdCode" @pcdChange="pcdChange" :tempPcdText="this.pcdCodeStr"></add-pcd>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="street">
                        <el-input v-model="editForm.street" auto-complete="off" @change="convertAddr2LonLat" placeholder="请输入详细地址" style="width:80%"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人员" prop="currentContactPerson">
                                <el-input v-model="editForm.currentContactPerson" auto-complete="off" placeholder="请输入联系人" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系手机" prop="currentContactMobile">
                                <el-input v-model="editForm.currentContactMobile" auto-complete="off" placeholder="请输入联系电话" style="width:70%"></el-input>
                            </el-form-item>                            
                        </el-col>                        
                    </el-row>
                    <el-form-item label="单位名称" prop="addressName">
                        <el-input v-model="editForm.addressName" auto-complete="off" placeholder="请输入单位名称" style="width:80%"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="经度" prop="longitudeX">
                                <el-input v-model="editForm.longitudeX" auto-complete="off" placeholder="自动计算经度" style="width:70%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="纬度" prop="latitudeY">
                                <el-input v-model="editForm.latitudeY" auto-complete="off" placeholder="自动计算纬度" style="width:70%"></el-input>
                            </el-form-item>                            
                        </el-col>                        
                    </el-row>
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
import pcdSelect from '../../../components/common/cityPicker.vue'
//import testComp from '../../../components/common/testComp.vue' 父子传值的另外一个简单例子，代码可删除
import BMap from 'BMap'  //引用baiduMap相关的API
export default{
    data(){
        //在此自定义校验，如新录入数据，在输入后校验后台是否重复，在rules中调用
        var checkExistsAddrCode = (rule, value, callback) =>{
            if (this.addForm.addressCode != ''){
                let param = new URLSearchParams();
                param.append("addressCode", this.addForm.addressCode)
                this.axios.post(`${this.api.baseURL}/address/getCountByAddrCode`, param).then(res =>{
                    //console.log(res);
                    if (parseInt(res.data.data.result) > 0){
                        callback(new Error('已存在相同的地址编码!')) 
                    }else callback()
                })
            }else callback()  //空值则默认成功
        };             
        return{
            addressList: [],
            filters:{
                addressType: '',
                addressCode: '',
                addressName: ''
            },
            addressTypeEnum: [{val: '', lbl: ''}, {val: 'D', lbl: '装货'}, {val: 'U', lbl: '卸货'}], //定义下拉框的options
            total: 0,
            page: 1,
            limit: 10,
            loading: false,
            pcdCode: [],
            pcdName: [],
            pcdCodeStr: "", //向子组件赋值用
            addFormVisible : false,  //新增界面是否显示
            addFormRules :{
                addressType :[
                    {required: true, message : '请选择地址类型', trigger : 'blur'}
                ],
                addressCode: [
                    {required: true, message: '请输入地址编码', trigger: 'blur'},
                    {min:2, max:10, message: '地址编码长度应为2-10位', trigger: 'blur'},
                    {validator: checkExistsAddrCode, trigger: 'blur'} //自定义校验
                ],
                street:[
                    {required: true, message: '请输入详细地址', trigger: 'blur'},
                    {min:2, message: '详细地址太短', trigger: 'blur'},
                    {max:100, message: '详细地址太长', trigger: 'blur'}
                ],
                addressName: [
                    {max:100, message: '单位名称太长', trigger: 'blur'}
                ],
                pcdCode: [
                    {required: true, message: '请选择省市区', trigger: 'blur'}
                ],                
                currentContactPerson: [
                    {required: true, message: '请输入联系人', trigger: 'blur'},
                    {min:2, message: '联系人长度太短', trigger: 'blur'},
                    {max:50, message: '联系人长度太长', trigger: 'blur'}
                ],
                currentContactMobile: [
                    {required: true, message: '请输入联系手机号', trigger: 'blur'},
                    {min:11, max:11, message: '联系人手机号长度太短', trigger: 'blur'}
                ],
                longitudeX: [
                    {required: true, message: '地址错误，请检查省市区或详细地址', trigger: 'blur'}
                ],
                latitudeY: [
                    {required: true, message: '地址错误，请检查省市区或详细地址', trigger: 'blur'}
                ]
            },
            addForm: {
                addressType: '',
                addressCode: '',
                pcdCode: '',
                street: '',
                addressName: '',
                currentContactPerson: '',
                currentContactMobile: '',
                longitudeX: '',
                latitudeY: ''
            },
            editFormVisible: false,
            editForm: {
                addressType: '',
                addressCode: '',
                pcdCode: '',
                street: '',
                addressName: '',
                currentContactPerson: '',
                currentContactMobile: '',
                longitudeX: '',
                latitudeY: ''
            }
        }
    },
    methods:{
        //列表显示中 性别列的显示转换
        formatAddrType: function(row, column) {
            return row.addressType == 'U' ? '卸货' : row.addressType == 'D' ? '装货' : '未知';
        },
        formatPcdName: function(row, column){ //列表显示中 将省市区合并为一个临时的省市区列
            return row.provinceName + ' ' + row.cityName + ' ' + row.districtName
        },
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
                searchByKeys: {addressCode: that.filters.addressCode, addressName: that.filters.addressName, addressType: that.filters.addressType},
                orderByKeys: {createDate: 'desc'}
            }
            that.axios.post(`${this.api.baseURL}/address/getAddressList`, params).then(res =>{
                that.addressList = res.data.data.result.content;
                that.total = res.data.data.result.totalRecord;
            })

        },
		convertAddr2LonLat: function(){ //详细地址change事件触发，自动计算经纬度
            let that = this
			if (this.pcdName.length == 3){
                let pcd = this.pcdName[0] + this.pcdName[1] + this.pcdName[2]
                let fullAddr = pcd + " " + this.addForm.street;
				var myGeo = new BMap.Geocoder();
				myGeo.getPoint(fullAddr, function(point){
					if (point){
                        if (that.addFormVisible){
                            that.addForm.longitudeX = point.lng
                            that.addForm.latitudeY = point.lat
                        }
                        if (that.editFormVisible){
                            that.editForm.longitudeX = point.lng
                            that.editForm.latitudeY = point.lat
                        }
					}else{
						alert('无法识别该地址，请更正！');
					}
                });
			}
		},        
        handleAddNew(){ //初始化
            this.addFormVisible = true;
            this.pcdCode = [];
            this.pcdName = [];
            this.pcdCodeStr = ",,"  //触发向子组件传值
            this.addForm = {
                addressType: "",
                street: ""
                //,test: "02"
            }
        },
        pcdChange(msg){ //由子组件触发，向父组件传值。 本页面为父组件
            this.pcdCode = msg.codes;
            this.pcdName = msg.names;
            this.pcdCodeStr = msg.codes.join(",")
        },
        addSubmit: function(){
            if (this.pcdCode == ""){ //子组件，暂时无法再rules里面实现validate，故在此校验
                this.$message.error({showClose: true, message: '请输入省市区！', duration: 3000});
                return false;
            }else{
                this.addForm.pcdCode = this.pcdCode;
                this.addForm.pcdName = this.pcdName;
            }
            this.convertAddr2LonLat(); //重算经纬度

            let that = this
            this.$refs.addForm.validate((valid) =>{
                if(valid){
                    let para = Object.assign({}, this.addForm);
                    that.axios.post(`${this.api.baseURL}/address/createUsualAddress`, para).then(function(result){
                        if ((result) && (result.status == '200')){ //保存成功
                            that.$message.success({showClose: true, message: '添加成功', duration: 2000});
                            that.$refs['addForm'].resetFields();
                            that.addFormVisible = false;
                        }else{
                            that.$message.error({showClose: true, message: '添加失败', duration: 2000});
                        }
                    })
                }
            })
        },
        beforeCloseAddForm: function(){ //点击取消，重置fields。避免validate form的错误信息再次显示
            this.addFormVisible = false
            this.$refs['addForm'].resetFields();
        },
        editSubmit: function(){
            if (this.pcdCode == ""){
                this.$message.error({showClose: true, message: '请输入省市区！', duration: 3000});
                return false;
            }else{
                this.editForm.pcdCode = this.pcdCode;
                this.editForm.pcdName = this.pcdName;
            }
            let that = this
            this.$refs.editForm.validate((valid) =>{
                if(valid){
                    let para = Object.assign({}, this.editForm);
                    that.axios.post(`${this.api.baseURL}/address/updateAddress`, para).then(function(result){
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
            this.pcdCode = [row.provinceCode, row.cityCode, row.districtCode];
            this.pcdName = [row.provinceName, row.cityName, row.districtName];
            this.pcdCodeStr = row.provinceCode + "," + row.cityCode +  "," + row.districtCode  //触发向子组件传值
            this.editForm = Object.assign({}, row);
        },
        delAddress(index, row){
            this.$confirm('您确定要删除【' + row.addressCode + '】吗？', '提示', 
                {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => 
            {
                let that = this
                let param = new URLSearchParams();
                param.append("id", row.id)
                that.axios.post(`${this.api.baseURL}/address/deleteUsualAddress`, param).then(function(result){
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
        },
    mounted(){
        this.handleSearch();
    }
},
components: {
    "add-pcd": pcdSelect   //定义子组件
    //,"add-test": testComp
  }
}
</script>

<style>
    /* 子组件的长度有问题，再次覆盖该css，重新定义省市区级联输入的长度 */
    .el-cascader{
        width: 500px
    }
</style>
