import { Blog } from "../models/Blog.js";
import imgService from "../services/img-service.js";
import { Img } from "../models/Img.js";
import config from "../config.js";
import dayjs from "dayjs";
import videoService from "../services/video-service.js";
import { Video } from "../models/Video.js";

const { BLOG_COUNT } = config;

class Controller {
    create = async (req, res) => {
        try {
            const video = req?.files?.video;

            if (!video)
                return res
                    .status(400)
                    .json({ "root.server": "Incorrect values" });

            const { video_id, path } = await videoService.save(video);
            const info = {
                path: process.env.API_URL + path,
                id: video_id,
            };
            return res.status(200).json(info);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json("id is not found");
            const blogData = await Video.findOne({
                where: {
                    id,
                },
            });

            if (!blogData) return res.status(404).json("video is not found");

            const { id: video_id } = blogData;

            await videoService.delete(video_id); //!   maybe delete

            return res.status(200).json(true);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
}
export default new Controller();
