const passport = require("passport");
const { Strategy } = require("passport-local");
const mongoose = require("mongoose");
const UserModel = require("../Models/users");
const { PasswordVerifyFunc } = require("../Utils/HashingPassword");
// const mockUsers = require("../Utils/MockData");
passport.serializeUser(async (user, done) => {
    console.log("Inside Serialized User");
    console.log(user);
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    console.log("Inside Deserialized User");
    console.log(id);
    try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new Error('Invalid id');
        }
        const findUser = await UserModel.findById(id);
        if(!findUser) throw new Error('user not found !');
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }
})

    passport.use(
    new Strategy(async (username, password, done) => {
        // console.log(`Username: ${username} # password: ${password}`);
        try {
            const findUser = await UserModel.findOne({username});
            if(!findUser) return done("User not found", null);
            const isValid = await PasswordVerifyFunc(findUser.password, password);
            if(!isValid) return done("Password mismatch", null);
            done(null, findUser);
        } catch (error) {
            return done("Server error occurred", null);
        }
    })
)

module.exports = passport;