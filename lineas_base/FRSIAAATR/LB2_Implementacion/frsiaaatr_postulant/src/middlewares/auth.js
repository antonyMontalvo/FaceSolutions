module.exports = {
    checkToken: (req, res, next) => {
        if (!req.session.token || req.session.token == null) {
            return res.redirect("/login");
        }
        next();
    }
};
