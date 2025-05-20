const passport = require("passport");
const { Strategy } = require("passport-oauth2");

passport.serializeUser((user, done) => {
    console.log("Inside Serialized User");
    console.log(user);
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(
    new Strategy({
        authorizationURL: "https://accounts.google.com/o/oauth2/auth?access_type=offline&prompt=consent",
        tokenURL: "https://oauth2.googleapis.com/token",
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:9003/api/auth/example/callback",
        scope: ["openid", "profile", "email"],
    },
async function(accessToken, refreshToken, params, done) {

    try {
        const fetchUser = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const profile = fetchUser.data;
        console.log(profile);
        
        const user = { googleId: profile.id, displayname: profile.displayname }
        console.log("accessToken: ", accessToken);
        console.log("refreshToken: ", refreshToken);
        console.log("profile: ", profile);
        done(null, user);
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        done(error, null);
    }

})
)

module.exports = passport;