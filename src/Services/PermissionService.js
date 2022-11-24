"use strict"

const PERMISSION = new (require('../Models/Permission'))();
class PermissionService {

    async create(body) {
        try {
            let permission = await PERMISSION.create({ 'module_id': body.module_id, 'permission': body.permission, 'description': body.description });
            return { status: 200, message: 'Permission added', data: permission };

        } catch (err) {
            return { status: 500, message: err };
        }

    }
    async all() {
        try {
            let permission = await PERMISSION.all();
            return { status: 200, message: 'Data retrieved', data: permission };

        } catch (err) {
            return { status: 500, message: err };
        }

    }
    async update(req) {
        try {
            let body = req.body;
            let params = req.params;
            let permission = await PERMISSION.get({ id: params.id });
            if (permission) {
                await PERMISSION.update(body, { id: params.id });
                return { status: 200, message: 'Permission successfully updated' };
            } else {
                return { status: 404, message: "Permission does not exist" };
            }

        } catch (err) {
            return { status: 500, message: err };
        }

    }
}

module.exports = PermissionService;