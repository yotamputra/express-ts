import express from "express";
import { auth } from "../middleware/auth";
import { UserController } from "../controller/user-controller";
import { ContactController } from "../controller/contact-controller";
import { AddressController } from "../controller/address-controller";

export const apiRouter = express.Router();

apiRouter.use(auth);

// User
apiRouter.get("/api/users/current", UserController.getUser);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

// Contact
apiRouter.post("/api/contacts", ContactController.create);
apiRouter.get("/api/contacts/:contactId(\\d+)", ContactController.get); // Regex for number
apiRouter.put("/api/contacts/:contactId(\\d+)", ContactController.update);
apiRouter.delete("/api/contacts/:contactId(\\d+)", ContactController.remove);
apiRouter.get("/api/contacts", ContactController.search);

// Address
apiRouter.post(
  "/api/contacts/:contactId(\\d+)/addresses",
  AddressController.create
);
apiRouter.get(
  "/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)",
  AddressController.get
);
