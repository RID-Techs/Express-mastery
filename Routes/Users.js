const express = require("express");
const router = express.Router();
const UserModel = require("../Models/users");
const { query, validationResult, matchedData, checkSchema } = require("express-validator");
const DataValidationObj = require("../Utils/DataValidation");
const { PasswordHashFunc } = require("../Utils/HashingPassword");

router.post("/api/users", checkSchema(DataValidationObj), async(req, res) => {
    try {
        const result = validationResult(req);
        if(!result.isEmpty()){
            const Errors = result.array();
            if(Errors[0].path === "username" || Errors[0].path === "displayname" || Errors[0].path === "password") {
                return res.status(400).json({msg: Errors[0].msg})
            }
        }
        const data = matchedData(req);
        console.log(data);
        data.password = await PasswordHashFunc(data.password);
        console.log(data);
        
        // const { body: {username, displayname, password} } = req;
        const RegisterUser = new UserModel(data);
        const newUser = await RegisterUser.save();
        return res.status(201).json({msg: "User Created with success !", newUser})
    } catch (error) {
        console.log("SignUpErrorMsg :", error.message);
        return res.status(500).json({msg: "Someting went wrong !"})
    }
})


router.get("/api/users", query("filter").isString().notEmpty().withMessage("Must not be empty").isLength({min: 3, max: 5}).withMessage("Must be at least 3-10 characters !"), (req, res) => {
    console.log(req.sessionID);

    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if(err) {
            console.log(err);
            throw err;
        }
        console.log("Inside session store Get");
        console.log(sessionData);
        return;
    })

    const result = validationResult(req)
    console.log(result);

    const { query: {filter, value} } = req;
    if(!filter && !value) return res.send("hello");

    // if(filter && value) {
    //     return res.send(
    //         mockUsers.filter((user) => user[filter].includes(value))
    //     )
    // }
    return res.send("hola");

})















// const mockUsers = require("../Utils/MockData");
/*
router.get("/api/users", query("filter").isString().notEmpty().withMessage("Must not be empty").isLength({min: 3, max: 5}).withMessage("Must be at least 3-10 characters !"), (req, res) => {
    console.log(req.sessionID);

    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if(err) {
            console.log(err);
            throw err;
        }
        console.log(sessionData);   
    })

    const result = validationResult(req)
    console.log(result);
    

    const { query: {filter, value} } = req;
    if(!filter && !value) return res.send(mockUsers);

    if(filter && value) {
        return res.send(
            mockUsers.filter((user) => user[filter].includes(value))
        )
    }
    return res.send(mockUsers);

})
router.get("/api/users/:id", (req, res) => {
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);
    if(isNaN(parsedId)) return res.status(400).send({msg: "Bad Request, Invalid ID"})
    const findUser = mockUsers.find((user) => user.id === parsedId);
    if(!findUser) return res.status(404).send({msg: "User not found"})
    return res.status(200).send(findUser)
    
})

// [body("username").notEmpty().withMessage("Username cannot be empty").isLength({min: 4, max: 7}).withMessage("Must be between 4-7 please !").isString().withMessage("Mus be a string !"), body("pseudo").notEmpty().withMessage("Pseudo must not be empty !")]

router.post("/api/users", checkSchema(DataValidationObj), (req, res) => {

    console.log(req.body);
    console.log(body);

    const result = validationResult(req);

    console.log(result);

    if(!result.isEmpty()){
        return res.status(400).json({errors: result.array()});
    }

    const data = matchedData(req);
    console.log("Data : " + data);
    console.log(data);
    
    const {body : {username, pseudo}} = req;
    const newUser = {id: mockUsers[mockUsers.length -1].id + 1, username, pseudo}
    mockUsers.push(newUser);
    return res.status(200).send(newUser);
})

router.put("/api/users/:id", (req, res) => {
    const {body, params: { id} } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.status(400).send({msg: "Bad Request, Invalid ID"})
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return res.status(404).send({msg: "User not found"});

    mockUsers[findUserIndex] = { id: parsedId, ...body };
    return res.status(200).send(mockUsers[findUserIndex]);
})

router.patch("/api/users/:id", (req, res) => {
    const {body, params: { id} } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.status(400).send({msg: "Bad Request, Invalid ID"})
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return res.status(404).send({msg: "User not found"});

    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return res.status(200).send(mockUsers[findUserIndex]);
})

router.delete("/api/users/:id", (req, res) => {
    const {params: { id} } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.status(400).send({msg: "Bad Request, Invalid ID"})
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return res.status(404).send({msg: "User not found"});

    mockUsers.splice(findUserIndex, 1);
    return res.status(200).send({msg: "User Deleted successfully"});
})
*/

module.exports = router