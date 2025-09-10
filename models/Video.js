import { sequelize } from "../services/DB.js";
import { DataTypes } from "@sequelize/core";

export const Video = sequelize.define(
    "Video",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return process.env.API_URL + this.getDataValue("path");
            },
        },
    },
    {
        tableName: "video",
        timestamps: false,
    }
);
