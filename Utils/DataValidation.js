const DataValidationObj = {
    username: {
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        isString: {
            errorMessage: "Username must be a string"
        }
    },
    displayname: {
        notEmpty: {
            errorMessage: "Displayname cannot be empty"
        },
        isString: {
            errorMessage: "Displayname must be a string"
        }
    },
    password: {
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
        isLength: {
            options: {min: 6, max: 12},
            errorMessage: "Password must be between 6 and 12 characters"
        }
    }
}

module.exports = DataValidationObj