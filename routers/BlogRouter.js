import { Router } from "express";
import autAdminMiddelware from "../middlewares/authAdmin-middleware.js";
import BlogController from "../controllers/blog-controller.js";
import { v4 } from "uuid";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads/nft/");
    },
    filename: function (req, file, callback) {
        req.fileName = v4() + file.originalname;
        callback(null, req.fileName);
    },
});

const upload = multer({ storage }).single("img");

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

BlogRouter.get("/:id", BlogController.getById);
BlogRouter.delete("/:id", autAdminMiddelware, BlogController.delete);
BlogRouter.put("/:id", autAdminMiddelware, BlogController.update);

export default BlogRouter;
