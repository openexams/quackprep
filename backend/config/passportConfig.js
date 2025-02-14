import {
  checkApiKey,
  findUserIdByProviderId,
  findLocalUserByEmailPassword,
  findUserById,
  OAuthRegister,
  getUserByUsername,
  setLastLoginNow,
} from "#models/auth/index.js";
import { GOOGLE_OAUTH_CONFIG } from "./config.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import {
  MAX_EMAIL_LENGTH,
  MAX_FIRST_NAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
  MAX_USERNAME_LENGTH,
} from "../../constants.js";

passport.use(
  // TODO LOOK INTO MORE checkIfProviderIdExistsInUsers()
  new GoogleStrategy(GOOGLE_OAUTH_CONFIG, async function (
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    const google_id = profile.id;
    // THESE VALUES WILL ONLY BE USED IF THE USER IS NOT ALREADY REGISTERED
    let username = profile?.displayName?.slice(0, MAX_USERNAME_LENGTH);
    const pfp_url = profile?._json?.picture ?? null;
    const email = profile?._json.email?.slice(0, MAX_EMAIL_LENGTH);
    const first_name =
      profile?.name?.givenName?.slice(0, MAX_FIRST_NAME_LENGTH) ?? null;
    const last_name =
      profile?.name?.familyName?.slice(0, MAX_LAST_NAME_LENGTH) ?? null;
    //
    let curId;
    try {
      if (
        // user exists alr
        (curId = await findUserIdByProviderId("google", google_id)) !== false
      ) {
        const user = await findUserById(curId);
        dlog("LoggedIn user:", user); //dlog cannot take params yet
        return done(null, user);
      } else {
        // what if google username same as other user
        const doesUserAlrExistWithThisUsername = await getUserByUsername(
          username
        );
        if (doesUserAlrExistWithThisUsername) {
          // if this somehow generates another user with the same username, then just have it fail bro so fair
          username = `${username.slice(0, 20)}${Math.floor(
            Math.random() * 10000
          )}`;
        }
        // user not registered create a user.
        await OAuthRegister(
          first_name,
          last_name,
          username,
          email,
          pfp_url,
          "google",
          google_id
        );
        if (
          (curId = await findUserIdByProviderId("google", google_id)) !== false
        ) {
          const user = await findUserById(curId);
          //dlog("Registered user:", user);
          return done(null, user);
        }
      }
      return done("Failed to google login/register", false, {
        message: "Failed to google login/register",
      });
    } catch (err) {
      return done(err, false, {
        message: "Failed to google login/register",
      });
    }
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await findLocalUserByEmailPassword(email, password); // email is unique
      if (user === -1) {
        dlog("Incorrect Email");
        return done(null, false, { message: "Incorrect email." });
      } else if (user === -2) {
        dlog("Incorrect Password");
        return done(null, false, { message: "Incorrect password." });
      }
      dlog("Successful Login!");
      return done(null, user);
    }
  )
);

passport.use(
  new BearerStrategy(async function (token, done) {
    try {
      const result = await checkApiKey(token);

      if (!result) {
        return done(null, false, { message: "Invalid API key" });
      }

      const user = { id: result.id };
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  setLastLoginNow(user.id);
  done(null, user.id); // user.id is what it will store in req.user
});

passport.deserializeUser(async (id, done) => {
  try {
    const { id: userId } = await findUserById(id);
    if (userId === -1) {
      return done("Could not find user while deserializing", false);
    }
    done(null, userId);
  } catch (error) {
    console.log("Error in deserialization", error);
    done(error, false);
  }
});

export default passport;
