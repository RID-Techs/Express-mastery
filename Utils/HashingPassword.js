const argon2 = require("argon2");

const argon2Options = {
    type: argon2.argon2id,
    timeCost: 3,
    parallelism: 2,
    hashLength: 64
}

const PasswordHashFunc = async (password) => {
    try {
        const hashPasword = await argon2.hash(password, argon2Options);
        console.log("Hased password : ", hashPasword);
        return hashPasword;
    } catch (error) {
        console.log('Error hashing password:', error);
    }
}

const PasswordVerifyFunc = async (storedHash, password) => {
    try {
        const isValid = await argon2.verify(storedHash, password);
        if(!isValid) throw new Error("Invalid password");
        return isValid;
    } catch (error) {
        console.log('Error verifying password:', error);
    }
}

module.exports = { PasswordHashFunc, PasswordVerifyFunc };