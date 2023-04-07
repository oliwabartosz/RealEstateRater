const {pool} = require("../config/dbConn");


class UsersRecord {
    constructor(obj) {
        this.id = obj.id;
        this.username = obj.username;
        this.password = obj.password;
        this.refreshToken = obj.refreshToken;
        this.roles = obj.roles
    }

    _validate() {

    }


}

module.exports = {
    UsersRecord,
}