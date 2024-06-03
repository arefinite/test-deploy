import multer from "multer";
import path from "node:path";

//multer
export const upload = multer({
  dest: path.resolve(__dirname, '../../../public/data/uploads'),
  limits: { fileSize: 10e7 }, // 10mb
})