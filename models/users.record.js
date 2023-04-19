const {pool} = require("../config/dbConn");


class UsersRecord {
    constructor(obj) {
        this.id = obj.id;
        this.username = obj.username;
        this.password = obj.password;
        this.refreshToken = obj.refreshToken;
        this.roles = obj.roles
        this._validate()
    }

    _validate() {
        // @TODO - validate
        // if (!obj || obj.name.length < 3 || obj.name.length > 25) {
        //     throw new ValidationError('..message..')
        // }

    }


}

module.exports = {
    UsersRecord,
}