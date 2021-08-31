// export const hasRole = (roles, requiredRole)=>{
//     let has =  roles.find(role=>role.role === requiredRole)
//     return has
// }

export const hasRole =(roles, requiredRole)=>{
    console.log(roles)
     roles.findIndex(function(role, index) {
         console.log(role,"role")
        if(role.role == requiredRole){
            return true
        } 
    });
}

// role:[{_id:"1",type:"IT",page:["homepage","aboutpage"]}]


// user :[
//     {username:"vannaky",password:"123",roleId:1,previllege:["getUser","deleteProduct"]}
// ]
