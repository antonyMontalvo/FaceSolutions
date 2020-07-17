const indexRouter = {};

const Routes = {
  employeeRouter: require("./employee.routes"),
  adminRouter: require("./admin.routes"),
  statisticsRouter: require("./statistics.routes"),
};

indexRouter.getRoutes = (app) => {
  app.use(process.env.APP_URL + "/", Routes.employeeRouter);
  app.use(process.env.APP_URL + "/admin", Routes.adminRouter);
  app.use(process.env.APP_URL + "/estadisticas", Routes.statisticsRouter);
};

module.exports = indexRouter;
