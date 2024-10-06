import {
  checkApiKey,
  checkIfProviderIdExistsInUsers,
  findLocalUserByEmailPassword,
  findUserById,
  OAuthRegister,
} from "#models/auth/index.js";
import { GOOGLE_OAUTH_CONFIG } from "./config.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as BearerStrategy } from "passport-http-bearer";

passport.use(
  new GoogleStrategy(GOOGLE_OAUTH_CONFIG, async function (
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    // login and if cant login then register & login; // should wrap in try catch
    const google_id = profile.id;
    const username = profile.displayName;
    const pfp_url = profile._json.picture ?? null;
    const email = profile._json.email;
    const first_name = profile.name.givenName ?? null;
    const last_name = profile.name.familyName ?? null;

    let curId;
    if (
      // user exists alr
      (curId = await checkIfProviderIdExistsInUsers("google", google_id)) !==
      false
    ) {
      const user = await findUserById(curId);
      dlog("LoggedIn user:", user); //dlog cannot take params yet
      return done(null, user);
    } else {
      const rowId = await OAuthRegister(
        first_name,
        last_name,
        username,
        email,
        pfp_url,
        "google",
        google_id
      );
      if (
        (curId = await checkIfProviderIdExistsInUsers("google", google_id)) !==
        false
      ) {
        const user = await findUserById(curId);
        //dlog("Registered user:", user);
        return done(null, user);
      }
    }
    return done("Failed to google login/register", false, {
      message: "Failed to google login/register",
    });
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await findLocalUserByEmailPassword(email, password);
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
  done(null, user.id);
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
