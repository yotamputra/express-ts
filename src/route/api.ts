import express from "express";
import { auth } from "../middleware/auth";
import { UserController } from "../controller/user-controller";
import { ContactController } from "../controller/contact-controller";

export const apiRouter = express.Router();

apiRouter.use(auth);

// User
apiRouter.get("/api/users/current", UserController.getUser);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

//Contact
apiRouter.post("/api/contacts", ContactController.create);
