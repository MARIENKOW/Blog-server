import { v4 } from "uuid";
import { Video } from "../models/Video.js";
import { unlink, existsSync, mkdirSync } from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import imgService from "./img-service.js";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

class VideoService {
    save = async (video) => {
        if (!video) throw new Error("video is not found");

        const videoName = v4() + video.name;

        const videoPath = await this.moveFile(video, videoName);

        try {
            const imgBuffer = await new Promise((resolve, reject) => {
                const buffers = [];

                ffmpeg(videoPath + "/" + videoName)
                    .frames(1)
                    .format("image2")
                    .on("error", (err) => reject(err))
                    .on("end", () => {
                        resolve(Buffer.concat(buffers));
                    })
                    .pipe()
                    .on("data", (chunk) => buffers.push(chunk));
            });

            const { img_id, path: poster } = await imgService.save(imgBuffer);

            try {
                const path = process.env.VIDEO_FOLDER + "/" + videoName;
                const { id: video_id } = await Video.create({
                    name: videoName,
                    path,
                    img_id,
                });
                return { video_id, videoName, path, poster };
            } catch (error) {
                await imgService.delete(img_id);
                throw error;
            }
        } catch (error) {
            await this.unlinkFile(videoName);
            throw error;
        }
    };
    async moveFile(video, videoName) {
        return new Promise((res, rej) => {
            const uploadPath = path.resolve() + process.env.VIDEO_FOLDER;
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath, { recursive: true });
            }
            video.mv(uploadPath + "/" + videoName, function (err) {
                if (err) return rej(err);
                res(uploadPath);
            });
        });
    }
    async unlinkFile(videoName) {
        return new Promise((res, rej) => {
            const uploadPath = path.resolve() + process.env.VIDEO_FOLDER;
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath, { recursive: true });
            }
            unlink(uploadPath + "/" + videoName, (err) => {
                if (err) return rej(err);
                res(true);
            });
        });
    }

    async delete(video_id) {
        if (!video_id) throw new Error("video_id is not found");

        const video = await Video.findOne({
            where: { id: video_id },
        });

        const { name: videoName, id } = video;

        await this.unlinkFile(videoName);

        return video.destroy({ where: { id: video_id } });
    }
}

export default new VideoService();
