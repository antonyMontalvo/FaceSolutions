const indexRouter = {};

const Routes = {
  employeeRouter: require("./employee.routes"),
<<<<<<< HEAD
  postulantRouter: require("./postulant.routes"),
=======
  postulantRouter: require("./postulant.route"),
>>>>>>> 8e29c51194a8209341e1129bea6fa0951c6c2147
};

indexRouter.getRoutes = (app) => {
  app.use(`${process.env.APP_URL}/employees`, Routes.employeeRouter); // No tocar ejemplo
<<<<<<< HEAD
  app.use(`${process.env.APP_URL}/`, Routes.postulantRouter);
=======
  app.use(`${process.env.APP_URL}`, Routes.postulantRouter); // No tocar ejemplo
>>>>>>> 8e29c51194a8209341e1129bea6fa0951c6c2147
};

module.exports = indexRouter;
