import express, { Application, urlencoded } from 'express';
import shopRouter from './routes/shop.route';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middlewares/errorHandler/errorHandler.js';
import morgan from 'morgan';

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
    this.app.use(morgan(':method :url :status :response-time ms'));
    this.setErrorHandler();
  }

  public getServer(): Application {
    return this.app;
  }

  private setErrorHandler(): void {
    this.app.use(errorHandler);
  }

  private setRoutes(): void {
    this.app.use('/', shopRouter);
  }

  private setMiddlewares(): void {
    this.app.use(express.json()); // JSON parsing middleware
    this.app.use(express.static(path.join(__dirName, '../public')));
    this.app.set('view engine', 'ejs');

    this.app.use(urlencoded({ extended: true }));
  }
}

export default new App().getServer();
