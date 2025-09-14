import { Op } from "sequelize";
import { Blog } from "../models/Blog.js";
import imgService from "../services/img-service.js";
import { Img } from "../models/Img.js";
import config from "../config.js";
import dayjs from "dayjs";
import { Video } from "../models/Video.js";

const { BLOG_COUNT } = config;

class Controller {
    create = async (req, res) => {
        try {
            const { title, body, date } = req.body;
            const videos_id = req.body["videos_id[]"];

            const img = req?.files?.img;

            if (!title || !img || !body || !date)
                return res
                    .status(400)
                    .json({ "root.server": "Incorrect values" });

            const { img_id } = await imgService.save(img);

            try {
                const blog = await Blog.create({
                    title,
                    img_id,
                    body,
                    date,
                });
                const { id } = blog;
                try {
                    const videos = await Video.findAll({
                        where: { id: videos_id },
                    });

                    await blog.setVideos(videos);
                } catch (error) {
                    console.log(error);
                }
                return res.status(200).json(id);
            } catch (error) {
                await imgService.delete(img_id);
                throw error;
            }
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    getAll = async (req, res) => {
        let { page } = req?.query;
        const offset = ((page || 1) - 1) * BLOG_COUNT;
        try {
            const blogData = await Blog.findAll({
                include: [
                    {
                        model: Img,
                        as: "img",
                        required: true,
                    },
                ],
                order: [
                    ["is_main", "DESC"],
                    ["date", "DESC"],
                    ["id", "DESC"],
                ],
                offset,
                limit: BLOG_COUNT,
            });
            const countItems = await Blog.count();
            const currentPage = page || 1;
            const countPages = Math.ceil(countItems / BLOG_COUNT);
            const isLastPage = currentPage == countPages;
            const info = {
                currentPage,
                countPages,
                countItems,
                isLastPage,
                itemsOnCurrentPage: isLastPage
                    ? countItems - BLOG_COUNT * (countPages - 1)
                    : BLOG_COUNT,
            };
            return res.status(200).json({ data: blogData, info });
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    getMain = async (req, res) => {
        try {
            const blogData = await Blog.findOne({
                include: [
                    {
                        model: Img,
                        as: "img",
                        required: true,
                    },
                ],
                order: [
                    ["is_main", "DESC"],
                    ["date", "DESC"],
                    ["id", "DESC"],
                ],
            });

            return res.status(200).json(blogData);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    getImportant = async (req, res) => {
        const { page } = req?.params;
        try {
            let blogImportantData = await Blog.findAll({
                where: { is_important: true },
                attributes: { exclude: ["body"] },
                include: [
                    {
                        model: Img,
                        as: "img",
                        required: true,
                    },
                ],
                order: [
                    ["date", "DESC"],
                    ["id", "DESC"],
                ],
            });
            if (blogImportantData.length === 0) {
                blogImportantData = await Blog.findAll({
                    attributes: { exclude: ["body"] },
                    include: [
                        {
                            model: Img,
                            as: "img",
                            required: true,
                        },
                    ],
                    limit: 10,
                    order: [
                        ["date", "DESC"],
                        ["id", "DESC"],
                    ],
                });
            }

            return res.status(200).json(blogImportantData);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    getShort = async (req, res) => {
        try {
            const blogData = await Blog.findAll({
                attributes: { exclude: ["body"] },
                // include: [
                //     {
                //         model: Img,
                //         as: "img",
                //         required: true,
                //     },
                // ],
                limit: 10,
                order: [
                    ["date", "DESC"],
                    ["id", "DESC"],
                ],
            });

            return res.status(200).json(blogData);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json("id is not found");
            const blogData = await Blog.findOne({
                where: {
                    id,
                },
                include: [
                    {
                        model: Img,
                        as: "img",
                        required: true,
                    },
                    {
                        model: Video,
                        as: "videos", // 👈 важно, alias должен совпадать с ассоциацией
                        attributes: ["id"], // только id
                        through: { attributes: [] },
                    },
                ],
            });
            if (!blogData) return res.status(404).json("Not found blog");
            return res.status(200).json({
                ...blogData.toJSON(),
                videos_id: blogData.videos.map((e) => e.id),
            });
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json("id is not found");
            const blogData = await Blog.findOne({
                where: {
                    id,
                },
                include: [
                    {
                        model: Img,
                        as: "img",
                        required: true,
                    },
                ],
            });

            if (!blogData) return res.status(404).json("blog is not found");

            const { img_id, id: blog_id } = blogData;

            await blogData.destroy({ where: { id: blog_id } });

            // try {
            //     await imgService.delete(img_id); //!   maybe delete
            // } catch (error) {
            //     console.log(error);
            // }

            return res.status(200).json(true);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    update = async (req, res) => {
        try {
            const data = req.body;
            const videos_id = req.body["videos_id[]"];

            const { id } = req.params;

            const img = req?.files?.img;

            if (!data || !id)
                return res
                    .status(400)
                    .json({ "root.server": "Incorrect values" });

            const blogData = await Blog.findOne({
                where: {
                    id,
                },
                include: [
                    {
                        model: Img,
                        as: "img",
                        required: true,
                    },
                ],
            });

            if (!blogData) return res.status(404).json("blog not found");

            if (img) {
                const imageData = await imgService.save(img);
                data.img_id = imageData.img_id;
            }

            function toBoolean(value) {
                if (value === "true") return true;
                if (value === "false") return false;
                return Boolean(value); // на случай других типов
            }

            try {
                const updateUserData = await Blog.update(
                    {
                        ...data,
                        // is_main: toBoolean(data?.is_main),
                        // is_important: toBoolean(data?.is_main),
                        date: dayjs(data.date).format("YYYY-MM-DD"),
                    },
                    { where: { id: blogData.id } }
                );

                try {
                    if (videos_id && videos_id?.length > 0) {
                        const videos = await Video.findAll({
                            where: { id: videos_id },
                        });

                        await blogData.setVideos(videos);
                    }
                } catch (error) {
                    console.log(error);
                }
            } catch (error) {
                if (img) {
                    await imgService.delete(data.img_id);
                }
                throw error;
            }
            try {
                if (img) {
                    await imgService.delete(blogData.img_id);
                }
            } catch (error) {}
            return res.status(200).json(blogData.id);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    setImportant = async (req, res) => {
        try {
            const { is_important } = req.body;

            const { id } = req.params;

            if (!id)
                return res
                    .status(400)
                    .json({ "root.server": "Incorrect values" });

            function toBoolean(value) {
                if (value === "true") return true;
                if (value === "false") return false;
                return Boolean(value); // на случай других типов
            }
            await Blog.update(
                {
                    is_important: toBoolean(is_important),
                },
                { where: { id } }
            );
            return res.status(200).json(true);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    setMain = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id)
                return res
                    .status(400)
                    .json({ "root.server": "Incorrect values" });

            await Blog.update(
                {
                    is_main: false,
                },
                { where: { is_main: true } }
            );
            await Blog.update(
                {
                    is_main: true,
                },
                { where: { id } }
            );
            return res.status(200).json(true);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    deleteMain = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id)
                return res
                    .status(400)
                    .json({ "root.server": "Incorrect values" });

            await Blog.update(
                {
                    is_main: false,
                },
                { where: { id, is_main: true } }
            );
            return res.status(200).json(true);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
}
export default new Controller();
