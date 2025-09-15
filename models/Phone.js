import { sequelize } from "../services/DB.js";
import { DataTypes } from "@sequelize/core";

export const Phone = sequelize.define(
    "Phone",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "phone",
        timestamps: false,
    }
);
