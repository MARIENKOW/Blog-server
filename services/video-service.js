import { v4 } from "uuid";
import { Video } from "../models/Video.js";
import { unlink, existsSync, mkdirSync } from "fs";
import path from "path";

class VideoService {
    save = async (video) => {
        if (!video) throw new Error("video is not found");

        const videoName = v4() + video.name;

        await this.moveFile(video, videoName);

        try {
            const path = process.env.VIDEO_FOLDER + "/" + videoName;
            const { id: video_id } = await Video.create({
                name: videoName,
                path,
            });
            return { video_id, videoName, path };
        } catch (error) {
            await this.unlinkFile(videoName);
            throw error;
        }
    };
    async moveFile(video, videoName) {
        return new Promise((res, rej) => {
            const uploadPath = path.resolve() + "/" + process.env.VIDEO_FOLDER;
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath, { recursive: true });
            }
            video.mv(uploadPath + "/" + videoName, function (err) {
                if (err) return rej(err);
                res(true);
            });
        });
    }
    async unlinkFile(videoName) {
        return new Promise((res, rej) => {
            unlink(
                path.resolve() + process.env.VIDEO_FOLDER + "/" + videoName,
                (err) => {
                    if (err) return rej(err);
                    res(true);
                }
            );
        });
    }

    async delete(video_id) {
        if (!video_id) throw new Error("video_id is not found");

        const { name: videoName, id } = await Video.findOne({
            where: { id: video_id },
        });

        await Video.destroy({ where: { id: video_id } });

        return this.unlinkFile(videoName);
    }
}

export default new VideoService();
