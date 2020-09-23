const indexRouter = {};

const Routes = {
    employeeRouter: require("./employee.routes"),
    adminRouter: require("./admin.routes"),
    constancyRouter: require("./constancy.routes"),
    constancyProcessRouter: require("./constancyProcess.routes"),
    constancyDerivedRouter: require("./constancyDerived.routes"),
    postulantRouter: require("./postulant.routes"),
    recordRouter: require("./record.routes"),
    filterRouter: require("./filter.routes"),
    reportRouter: require("./report.routes"),
};

indexRouter.getRoutes = (app) => {
    app.use(`${process.env.APP_URL}/employees`, Routes.employeeRouter); // No tocar ejemplo
    app.use(`${process.env.APP_URL}`, Routes.adminRouter);
    app.use(`${process.env.APP_URL}/constancy`, Routes.constancyRouter);
    app.use(`${process.env.APP_URL}/constancy-inp`, Routes.constancyProcessRouter);
    app.use(`${process.env.APP_URL}/constancy-der`, Routes.constancyDerivedRouter);
    app.use(`${process.env.APP_URL}/postulant`, Routes.postulantRouter);
    app.use(`${process.env.APP_URL}/record`, Routes.recordRouter);
    app.use(`${process.env.APP_URL}/filter`, Routes.filterRouter);
    app.use(`${process.env.APP_URL}/report`, Routes.reportRouter);
};

module.exports = indexRouter;