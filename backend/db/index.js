import mongoose from 'mongoose';
import {ENV} from '../constant/index.js'
import chalk from 'chalk';

const url = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@mariyamcluster.0ntunst.mongodb.net/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=mariyamCluster`;

const connectToDB=async()=>{

    mongoose.connection.on("open", () => {
      console.log(chalk.white.bold.bgGreen("MongoDB connected"));
    });
    mongoose.connection.on("error", () => {
      console.error(chalk.bold.bgRed("Error in connecting MongoDB"));
    });
}

mongoose.connect(url)
export default connectToDB;