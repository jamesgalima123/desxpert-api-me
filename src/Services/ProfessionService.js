"use strict"

const PROFESSION = new (require('../Models/Profession'))();
class ProfessionService {

    async create(body) {
        try {
            let isExist = await PROFESSION.get({ 'name': body.name });
            if (!isExist) {
                let profession = await PROFESSION.create({ 'parent_id': body.parent_id, 'name': body.name, 'color_hex': body.color_hex, 'salutation': body.salutation });
                return { status: 200, message: 'Profession added', data: profession };

            } else {
                return { status: 404, message: "Creation Unsuccessful. Profession already exists." };
            }

        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }

    }
    async all() {
        try {
            let professions = await PROFESSION.all();
            return { status: 200, data: professions, message: "Data retrieved" };
        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }
    }
    async getByParent() {
        try {
            let professions = await PROFESSION.all();
            let profession_parents = [];
            let parents_count = 0;
            for (let i = 0; i < professions.length; i++) {
                let profession = professions[i];
                if (profession.parent_id == 0) {
                    profession.children = [];
                    profession_parents[parents_count] = profession;
                    parents_count += 1;
                } else {
                    for (let j = 0; j < parents_count; j++) {
                        let profession_parent = profession_parents[j];
                        if (profession_parent.id == profession.parent_id) {
                            profession_parent.children[profession_parent.children.length] = profession;
                        }
                    }
                }
            }
            return { status: 200, data: profession_parents, message: "Data retrieved" };
        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }
    }
    async get(params) {
        try {
            let profession = await PROFESSION.get({ id: params.id });
            if (profession) {
                return { status: 200, data: profession, message: "Data retrieved" };
            } else {
                return { status: 404, message: "Profession does not exist" };
            }
        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }
    }
    async update(req) {
        let params = req.params;
        let body = req.body;
        try {
            let profession = await PROFESSION.get({ id: params.id });
            if (profession) {
                await PROFESSION.update(body, { id: params.id });
                return { status: 200, message: "Profession successfully updated" };
            } else {
                return { status: 404, message: "Profession does not exist" };
            }
        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }
    }
}

module.exports = ProfessionService;
