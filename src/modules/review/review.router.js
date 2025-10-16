import { Router } from "express";
import { authService } from "../../middleware/auth.js";
import { allReviewRoles } from "./review.apiRoles.js";
import * as reviewController from "./controller/review.controller.js";
import * as reviewValidators from "./review.validators.js";
import { validationService } from "../../middleware/validation.js";

const router = Router();

router.post(
    "/",
    authService(allReviewRoles.addReview),
    validationService(reviewValidators.addReview),
    reviewController.addReview
);

export default router;
