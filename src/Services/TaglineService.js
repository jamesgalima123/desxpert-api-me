"use strict";

const TAGLINE = new (require("../Models/Tagline"));
class TaglineService {

    async create(body) {

        try {

            let isExist = await TAGLINE.get({ tagline: body.tagline });

            if (isExist) {
                return { status: 404, message: "Creation Unsuccessful. Tagline already exists." };
            }
            await TAGLINE.create({ tagline: body.tagline });

            return { status: 200, message: "Success! The new tagline has been created." };

        } catch (err) {
            console.log("error  " + err);
            return { status: 500, message: err };
        }
    }

    async update(req) {
        let params = req.params;
        let body = req.body;
        try {

            let isExist = await TAGLINE.get({ id: params.id });

            if (!isExist) {
                return { status: 404, message: "Update Unsuccessful. Tagline does not exist." };
            }
            await TAGLINE.update({ tagline: body.tagline }, { id: params.id });

            return { status: 200, message: "Success! The tagline has been updated." };

        } catch (err) {
            console.log("error  " + err);
            return { status: 500, message: err };
        }
    }


    async getRandom() {

        try {

            let tagline = await TAGLINE.getRandom();

            return { status: 200, data: tagline, message: "Data retrieved" };

        } catch (err) {
            return { status: 500, message: err };
        }

    }

    async get(req) {
        let params = req.params;
        try {

            let tagline = await TAGLINE.get({ id: params.id });
            if (!tagline) {
                return { status: 404, message: "Tagline does not exist" };
            }
            return { status: 200, data: tagline, message: "Data retrieved" };

        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }

    }
}

module.exports = TaglineService;
