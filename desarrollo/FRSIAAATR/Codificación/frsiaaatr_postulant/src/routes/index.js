const indexRouter = {};

const Routes = {
  employeeRouter: require("./employee.routes"),
  postulantRouter: require("./postulant.routes"),
};

indexRouter.getRoutes = (app) => {
  app.use(`${process.env.APP_URL}/employees`, Routes.employeeRouter); // No tocar ejemplo
  app.use(`${process.env.APP_URL}`, Routes.postulantRouter);
};

module.exports = indexRouter;
