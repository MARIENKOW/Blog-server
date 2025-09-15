import { Router } from "express";
import autAdminMiddelware from "../middlewares/authAdmin-middleware.js";
import phoneController from "../controllers/phone-controller.js";

const PhoneRouter = new Router();

PhoneRouter.post("/", autAdminMiddelware, phoneController.create);
PhoneRouter.put("/:id", autAdminMiddelware, phoneController.update);
PhoneRouter.delete("/:id", autAdminMiddelware, phoneController.delete);
PhoneRouter.get("/", phoneController.getPhones);

export default PhoneRouter;
