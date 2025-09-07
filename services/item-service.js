import { v4 } from "uuid";
import { Img } from "../models/Img.js";
import { unlink } from "fs";
import path from "path";
import { Item } from "../models/Item.js";

// export const nftImageFolder = "/uploads";

class ItemService {
   changePlaces = async (productLine_id) => {
      let place = 1;
      const itemsToChangePlace = await Item.findAll({
         where: {
            productLine_id,
         },
         order: [["place", "ASC"]],
      });
      for (let item of itemsToChangePlace) {
         await Item.update(
            {
               place: place,
            },
            { where: { id: item.id } }
         );
         place++;
      }
   };
}

export default new ItemService();
