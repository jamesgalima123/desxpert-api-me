"use strict"

const connector = require('./Connector');

class BaseQuery {
	
	query(sql, values = null) {                                                              
        return new Promise(async function (resolve, reject) {
            var con = await connector.mysql();
            var query = "";                         
            con.query(sql, values, function (error, results) {
                try {                
                    if (error) {
                        console.log('error:: ', error);
                        reject(error);
                    } else {
 //                       console.log('results:: ', results);
                        resolve(results);
                    }
                }
                catch (err) {
                    reject(err);
                }                
            })  
        });             
    }

	all(where = {}, table = this.table) {        
        var columns = '*';
        var values = [];
        var query = `SELECT ${columns} FROM ${table}`;
        
        if (JSON.stringify(where) !== '{}') {
            columns = '';            
            for (var key in where) {                                
                if (key == "deleted_at") {
                    if (where[key]) {
                        columns += columns == "" ? `${key} IS NOT NULL` : ` AND ${key} IS NOT NULL `;                
                    } else {
                        columns += columns == "" ? `${key} IS NULL` : ` AND ${key} IS NULL `;                
                    }                    
                } else {
                    columns += columns == "" ? `${key}=?` : ` AND ${key}=? `;                
                    values.push(where[key])
                }                
            }
            query += ` WHERE ${columns} `;            
        }      
        
	    return this.query(query, values);    
	}

    get(where = {}, table = this.table) {        
        return new Promise((resolve, reject) => {
            this.all(where, table)
            .then((data) => {                
                resolve(data[0])
            })
            .catch((err) => {
                reject(err)
            });
        })    
    }

    create(payload = {}, saveDate = true, table = this.table) {
        const prop = Object.getOwnPropertyNames(payload);
        if (prop.length == 0) throw "No object";

        var query = saveDate ? `INSERT INTO ${table} SET ?, created_at = now(), updated_at = now()` : `INSERT INTO ${table} SET ?`;

        return new Promise((resolve, reject) => {
            this.query(query, payload)
            .then((row) => {
                let newObj = { ...payload };
                newObj['id'] = row.insertId;
                console.log('insertRec', newObj);
                resolve(newObj)
            })
            .catch(err => reject(err));
        });        
    }

    update(payload = {}, where = {}, table = this.table) {
        var columns = "";
        var refColumn = "";
        var values = [];

        const prop = Object.getOwnPropertyNames(payload);

        if (prop.length == 0) { throw "No object"; }
        
        for (var key in payload) {
            
            if (payload[key] !== null || key == 'deleted_at') {
                columns += columns == "" ? key + ` = ?` : `, ` + key + ` = ?`;
                values.push(payload[key]);
            }
        }

        for (var key in where) {
            refColumn += refColumn == "" ? `${key}=?` : ` AND ${key}=? `;
            values.push(where[key])
        }
        
        var query = `UPDATE ${table} SET ${columns}, updated_at = now() WHERE ${refColumn}`;
        
        return this.query(query, values);
    }

    delete(where = {}, softDelete = true, table = this.table) {
        if (JSON.stringify(where) !== '{}') {
            var columns = "";
            var values = [];
            for (var key in where) {
                columns += columns == "" ? `${key}=?` : ` AND ${key}=? `;
                values.push(where[key])
            }

            if (softDelete) {
                var query = `UPDATE ${table} SET deleted_at = now() WHERE ${columns}`;
            } else {
                var query = `DELETE FROM ${table} WHERE ${columns}`;
            }            
            
            return this.query(query, values);
        }
    }
}

module.exports = BaseQuery;