enum Roles {
    User = 1,
    API = 2,
    Admin = 3
}

// @TODO: czy to jest potrzebne? może wystarczy sam enum?

const ROLES_LIST = {
    "User": Roles.User,
    "API": Roles.API,
    "Admin": Roles.Admin,
}

module.exports = ROLES_LIST