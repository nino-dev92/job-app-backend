import allowedOrigins from "./allowedOrigins.js";

const corsOprtions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
  optionSuccessStatus: 200,
  credentials: true,
};

export default corsOprtions;
