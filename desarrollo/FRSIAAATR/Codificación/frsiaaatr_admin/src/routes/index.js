const indexRouter = {};

const Routes = {
  employeeRouter: require("./employee.routes"),
  adminRouter: require("./admin.routes"),
  postulantRouter: require("./postulant.routes"),
};

indexRouter.getRoutes = (app) => {
  app.use(`${process.env.APP_URL}/employees`, Routes.employeeRouter); // No tocar ejemplo
  app.use(`${process.env.APP_URL}`, Routes.adminRouter);
  app.use(`${process.env.APP_URL}/postulants`, Routes.postulantRouter);
};

module.exports = indexRouter;
