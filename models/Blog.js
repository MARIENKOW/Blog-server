import { sequelize } from "../services/DB.js";
import { DataTypes } from "@sequelize/core";

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
            allowNull: false,
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
        timestamps: false,
    }
);
