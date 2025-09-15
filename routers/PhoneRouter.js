import { Router } from "express";
import autAdminMiddelware from "../middlewares/authAdmin-middleware.js";
import phoneController from "../controllers/phone-controller.js";

const PhoneRouter = new Router();

PhoneRouter.post("/", autAdminMiddelware, phoneController.setPhones);
PhoneRouter.get("/", phoneController.getPhones);

export default PhoneRouter;
