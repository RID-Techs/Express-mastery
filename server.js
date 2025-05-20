const express = require("express");
const app = express();
require("dotenv").config();
const ConnectDB = require("./Config/_DB_Connect");
const allRoutes = require("./Routes/index");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
// require("./Strategies/local-strategy");
require("./Strategies/Auth_2.0");
const mockUsers = require("./Utils/MockData");
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT || 9000;

ConnectDB();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser("helloworld"));
app.use(session({
    secret: "secretKey12",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 60000 * 60},
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(allRoutes);
app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.sessionID);
    req.session.visited = true;
    res.cookie("hello", "world", {maxAge: 60000 * 60 * 2, signed: true})
    res.send({mes : "Hola"})
})

app.post("/api/auth", (req, res) => {
    const { body: {username, password} } = req;
    const findUser = mockUsers.find((user) => {
        return user.username === username;
    })

    if(!findUser) return res.status(401).send({msg: "Bad username !"});
    if(findUser.password !== password) return res.status(401).send({msg: "Bad password!"});

    req.session.user = findUser;
    return res.status(200).send(findUser);

})

app.get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        if(err) throw err;
        console.log(session);
    })
    return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({msg: "Not authenticated"});
})

app.post("/api/authpass", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) {
            return res.status(400).json({ ErrMsg: err });
        }
        if (!user) {
            return res.status(401).json({ msg: "Invalid username or password" });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(400).json({ ErrMsg: err });
            }
            return res.status(200).json(user);
        })
    })(req, res, next);
});

app.get("/api/authpass/status", async (req, res) => {
    try {
        console.log("Inside /auth/status endpoint");
        console.log(req.user);
        if(req.user) return res.status(200).send(req.user);
        return res.sendStatus(401);
    } catch (error) {
        console.log("ShowErr : ", error);
        return res.status(500).send({err: "Server Error !"})
    }
})

    app.get('/api/auth/example',
    passport.authenticate('oauth2', {
        scope: ["openid", "profile", "email"],
        state: true
    }));

    app.get('/api/auth/example/callback',
    (req, res, next) => {
        passport.authenticate('oauth2', (err, user, info) => {
            if (err) {
                console.error('Erreur d\'authentification :', err);
                return res.redirect('/login');
            }
            if (!user) {
                console.error('Utilisateur introuvable :', info);
                return res.redirect('/login');
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error('Erreur lors de la connexion :', err);
                    return res.redirect('/login');
                }
                return res.redirect('/');
            });
        })(req, res, next);
    }
);


app.post("/api/authpass/logout", (req, res) => {
    if(!req.user) return res.status(401).send({msg: "Not Authenticated"});
    req.logout((err) => {
        if(err) throw err;
        return res.sendStatus(200);
    })
})
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
})
