const indexRouter = {};

const Routes = {
  employeeRouter: require("./employee.routes"),
  postulantRouter: require("./postulant.routes"),
  processRouter: require("./process.routes"),
};

indexRouter.getRoutes = (app) => {
  app.use(`${process.env.APP_URL}/employees`, Routes.employeeRouter); // No tocar ejemplo
  app.use(`${process.env.APP_URL}`, Routes.postulantRouter); // No tocar ejemplo
  app.use(`${process.env.APP_URL}/documents`, Routes.processRouter); // No tocar ejemplo
};

module.exports = indexRouter;
