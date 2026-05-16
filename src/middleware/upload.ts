// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (_req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

// export default upload;

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job-board-cvs",
    resource_type: "raw", // 👈 important for PDFs
  } as any,
});

const upload = multer({ storage });

export default upload;
