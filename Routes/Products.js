const express = require("express");
const router = express.Router();

router.get("/api/products", (req, res) => {
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies.hello);

    if(req.signedCookies.hello && req.signedCookies.hello === "world") {
        return res.send([{id: 123, name: "Chicken Breast", price: 12.99}])
    }
    return res.status(401).send({msg: "Sorry, you need to send the right cookies."})
})

module.exports = router;