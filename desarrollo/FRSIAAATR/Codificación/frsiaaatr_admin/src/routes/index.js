const indexRouter = {};

const Routes = {
    employeeRouter: require("./employee.routes"),
    adminRouter: require("./admin.routes"),
    constancyRouter: require("./constancy.routes"),
    requirementRouter: require("./requirement.routes"),
    postulantRouter: require("./postulant.routes"),
};

indexRouter.getRoutes = (app) => {
    app.use(`${process.env.APP_URL}/employees`, Routes.employeeRouter); // No tocar ejemplo
    app.use(`${process.env.APP_URL}`, Routes.adminRouter);
    app.use(`${process.env.APP_URL}/constancy`, Routes.constancyRouter);
    app.use(`${process.env.APP_URL}/requirements`, Routes.requirementRouter);
    app.use(`${process.env.APP_URL}/postulant`, Routes.postulantRouter);
};

module.exports = indexRouter;