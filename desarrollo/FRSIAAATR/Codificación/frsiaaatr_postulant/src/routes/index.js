const indexRouter = {};

const Routes = {
  employeeRouter: require("./employee.routes"),
};

indexRouter.getRoutes = (app) => {
  app.use(`${process.env.APP_URL}/employees`, Routes.employeeRouter); // No tocar ejemplo
};

module.exports = indexRouter;
