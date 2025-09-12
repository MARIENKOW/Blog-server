import { sequelize } from "../services/DB.js";
import { DataTypes } from "@sequelize/core";
import imgService from "../services/img-service.js";
import videoService from "../services/video-service.js";

export const Blog = sequelize.define(
    "Blog",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        img_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            columnName: "img_id",
        },
        is_main: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_important: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        tableName: "blog",
        timestamps: true,
        hooks: {
            async beforeDestroy(blog, options) {
                const videos = await blog.getVideos({
                    attributes: ["id"],
                    joinTableAttributes: [],
                });

                console.log(videos);

                options.videos_id = videos.map((v) => v.id);
            },
            async afterDestroy(post, options) {
                try {
                    if (post?.img?.id) {
                        await imgService.delete(post.img.id);
                    }
                    console.log(options.videos_id);
                    for (const video_id of options.videos_id) {
                        await videoService.delete(video_id);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
        },
    }
);

Blog.associate = (models) => {
    Blog.belongsTo(models.Img, {
        foreignKey: {
            name: "img_id",
            allowNull: true,
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        },
    });
    Blog.belongsToMany(models.Video, {
        through: { model: "BlogVideos", timestamps: false },
        foreignKey: "blog_id",
        otherKey: "video_id",
        as: "videos",
    });
};

// Blog.hasOne(Img, { foreignKey: "blog_id", as: "img" });
