const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const eventQueries = require("../db/queries.events.js");
module.exports = {

    signUp(req, res, next) {
        res.render("users/sign_up");
    },

    create(req, res, next) {
        //#1
        let newUser = {
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };


        userQueries.createUser(newUser, (err, user) => {
            if (err) {
                req.flash("error", err);
                res.redirect("/users/sign_up");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })
            }
        });
    },

    signInForm(req, res, next) {
        res.render("users/sign_in");
    },

    signIn(req, res, next) {
        passport.authenticate("local")(req, res, function () {
            if (!req.user) {
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/sign_in");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            }
        })
    },

    signOut(req, res, next) {
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },

    show(req, res, next) {
        userQueries.getUser(req.user.id, (err, user) => {
            if (err || user === undefined) {
                req.flash("notice", "No user found with that ID");
                res.redirect("/");
            } else {
                res.render("users/profile", { user });
            }
        });
    },

    upgrade(req, res, next) {

        const token = req.body.stripeToken; // Using Express
        const charge = stripe.charges.create({
            amount: 100,
            currency: 'usd',
            description: 'upgrade to premium',
            source: token,
            statement_descriptor: 'e-invitation upgrade'
        });

        userQueries.upgrade(req.params.id, (err, user) => {
            if (err && err.type === "StripeCardError") {
                req.flash("notice", "Your payment was unsuccessful");
                res.redirect("/users/profile");
            } else {
                req.flash("notice", "Your payment was successful, you are a Premium Member!");
                res.redirect(`/users/${req.params.id}`);

            }
        });
    },


    downgrade(req, res, next) {
        eventQueries.privateToPublic(req.user.dataValues.id);
        userQueries.downgrade(req.params.id, (err, user) => {
            if (err || user === null) {
                req.flash("notice", "You are no longer a premium user.");
                res.redirect("/");
            } else {
                req.flash("notice", "Your account has been reverted back to standard");
                res.redirect(`/users/${req.params.id}`);
            }
        });

    }


}