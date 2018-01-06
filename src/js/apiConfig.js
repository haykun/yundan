const baseurl  = 'http://119.29.249.147:8080';
// const baseurl = 'http://localhost:8089'       //内网IP
export default {
    baseURL: baseurl,
    // 登录接口
    getlogin:`${baseurl}/userAuth/loginUserByUserCode`, //该接口需要两个参数
    //获取一级导航栏接口
    getOneNav:`${baseurl}/user/queryUserAllMenu`,     //该接口需要传递一个tokenid

    //获取用户列表
    getUserList:`${baseurl}/user/getPageUser`,
    //添加用户
    adduser:`${baseurl}/user/createUser`,
    //删除用户
    deleatuser:`${baseurl}/user/deleteUser`,    //该接口需要一个usercode
    //查询用户的角色列表
    queryUserRole:`${baseurl}/userRole/getUserRoleTree`, 
    
    //修改用户的角色列表
    updateUserRole:`${baseurl}/userRole/updateUserRole`  
}