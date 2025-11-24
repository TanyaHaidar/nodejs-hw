import { Router } from "express";
import { uploadAvatar } from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.patch("/users/avatar", authenticate, upload.single("avatar"), uploadAvatar);

export default router;
