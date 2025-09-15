import { Phone } from "../models/Phone.js";

class Controller {
    setPhones = async (req, res) => {
        try {
            const phones = req.body["phone"];

            if (!phones || phones?.length === 0)
                return res
                    .status(400)
                    .json({ "root.server": "Incorrect values" });

            await Phone.destroy({
                where: {},
                truncate: true,
            });

            await Phone.bulkCreate(phones.map((number) => ({ number })));

            const videos = await Phone.findAll();

            return res.status(200).json(videos);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    getPhones = async (req, res) => {
        try {
            const videos = await Phone.findAll();

            return res.status(200).json(videos);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
}
export default new Controller();
