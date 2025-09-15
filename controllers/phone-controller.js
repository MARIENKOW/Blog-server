import { Phone } from "../models/Phone.js";

class Controller {
    create = async (req, res) => {
        try {
            const { number } = req.body;

            if (!number)
                return res.status(400).json({ number: "number not found" });

            await Phone.create({
                number,
            });
            return res.status(200).json(true);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json("id is not found");
            const phoneData = await Phone.findOne({
                where: {
                    id,
                },
            });

            if (!phoneData) return res.status(404).json("phone is not found");

            await phoneData.destroy({ where: { id } });
            return res.status(200).json(true);
        } catch (e) {
            console.log(e);
            res.status(500).json(e?.message);
        }
    };
    update = async (req, res) => {
        try {
            const {number} = req.body;

            const { id } = req.params;

            if (!number || !id)
                return res.status(400).json({ number: "Incorrect values" });

            const phoneData = await Phone.findOne({
                where: {
                    id,
                },
            });

            if (!phoneData) return res.status(404).json("phone not found");

            await Phone.update({ number }, { where: { id: phoneData.id } });

            return res.status(200).json(true);
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
