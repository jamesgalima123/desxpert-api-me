"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class RolePermission extends BaseQuery {

	constructor(){
		super();
		this.table = "role_permissions";
	}	

	async getPermissions(role_id) {
        try {            

            let query = `SELECT alias FROM module_permissions mp
                LEFT JOIN role_permissions rp ON mp.id = rp.permission_id
                WHERE rp.role_id = ?`;

            let results = await this.query(query, role_id);       

            let permissions = [];
            
            for(let result of results){
                permissions.push(result.alias);
            }

            return permissions;
                                
        } catch(err) {
            throw err;
        }
    }
}

module.exports = RolePermission;