"use strict"
const USER = new (require('../Models/User'))();
const ROLE = new (require('../Models/Role'))();
const ROLE_PERMISSION = new (require('../Models/RolePermission'))();

class RoleService  {

    async defaultProperties(body) {
        
        let properties = {
            role: body.role,
            description: body.description
        };

        return properties;
    }

    async all() {       
        
        try {

            let roles = await ROLE.all();

            return { status: 200, data: roles, message: "Data retrieved"};

        } catch (err) {
            return { status: 500, message: err };
        }
        
    }
    async getRoleByRoleName(roleName){
        try {
                               
            let role = await ROLE.get({role: roleName});
            
            if (!role) {

                return { status: 404, message: "Role does not exist" };
            }
            
  
            return { status: 200, data: role, message: "Data retrieved"};

        } catch (err) {

            return { status: 500, message: err };
        }
    }
    async get(roleId) {       
        
        try {
                               
            let role = await ROLE.get({id: roleId});
            
            if (!role) {
                return { status: 404, message: "Role does not exist" };
            }
            
            role.permissions = await ROLE_PERMISSION.getPermissions(role.id);
                       
            return { status: 200, data: role, message: "Data retrieved"};

        } catch (err) {
            return { status: 500, message: err };
        }
        
    }

	async create(body) {       
        
        try {
            
            let isExist = await ROLE.get({role : body.role});
        
            if (isExist) {                            
                return { status: 404, message: "Creation Unsuccessful. Role already exist." };                
            }                   
            
            let payload = await this.defaultProperties(body);

            let role =  await ROLE.create(payload);
            
            if (typeof body.permissions != "undefined") {
                for (let permission of body.permissions) {                    
                    await ROLE_PERMISSION.create({role_id : role.id, permission_id: permission});
                }
            }
            
            role.permission = await ROLE_PERMISSION.get({role_id: role.id});

            return { status: 200, data: role, message: "Success! The new role has been created."};

        } catch (err) {
            return { status: 500, message: err };
        }
        
    }

    async update(body, roleId) {       
        
        try {
            
            let isExist = await ROLE.get({role : body.role});
        
            if (isExist && isExist.id != roleId) {                            
                return { status: 404, message: "Update Unsuccessful. Role already exist." };                
            }                   
                        
            let payload = await this.defaultProperties(body);            

            let role =  await ROLE.update(payload, {id: roleId});

            await ROLE_PERMISSION.delete({role_id: roleId}, false);

            if (typeof body.permissions != "undefined") {
                for (let permission of body.permissions) {                    
                    await ROLE_PERMISSION.create({role_id : roleId, permission_id: permission});
                }
            }
            
            return { status: 200, data: role, message: "Success! role has been updated."};

        } catch (err) {
            return { status: 500, message: err };
        }        
    }

    async delete(roleId) {       
        
        try {
                               
            let role = await ROLE.get({id: roleId});
            
            if (!role) {
                return { status: 404, message: "Role does not exist" };
            }
            
            let checkIfUsed = await USER.all({role_id: roleId});

            if (checkIfUsed.length > 0) {
                return { status: 400, message: "Unable delete role. This role are used by one or more users" };
            }

            await ROLE.delete({id: roleId}, false);

            await ROLE_PERMISSION.delete({role_id: roleId}, false);

            return { status: 200, message: "Success! The role has been deleted."};

        } catch (err) {
            return { status: 500, message: err };
        }
        
    }
}

module.exports = RoleService;
