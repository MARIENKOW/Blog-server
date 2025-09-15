import { Router } from "express";
import autAdminMiddelware from "../middlewares/authAdmin-middleware.js";
import BlogController from "../controllers/blog-controller.js";

const BlogRouter = new Router();

BlogRouter.post("/", autAdminMiddelware, BlogController.create);
BlogRouter.get("/", BlogController.getAll);
BlogRouter.get("/main", BlogController.getMain);
BlogRouter.delete("/main/:id", autAdminMiddelware, BlogController.deleteMain);
BlogRouter.put("/main/:id", autAdminMiddelware, BlogController.setMain);
BlogRouter.get("/short", BlogController.getShort);
BlogRouter.get("/important", BlogController.getImportant);
BlogRouter.put(
    "/important/:id",
    autAdminMiddelware,
    BlogController.setImportant
);
BlogRouter.put("/short/:id", autAdminMiddelware, BlogController.setShort);

BlogRouter.get("/:id", BlogController.getById);
BlogRouter.delete("/:id", autAdminMiddelware, BlogController.delete);
BlogRouter.put("/:id", autAdminMiddelware, BlogController.update);

export default BlogRouter;
