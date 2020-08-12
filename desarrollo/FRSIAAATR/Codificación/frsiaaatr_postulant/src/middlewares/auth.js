module.exports = {
    checkToken: (req, res, next) => {
        if (!req.session.token) {
            return res.redirect("/login");
        }
        next();
    }
};
