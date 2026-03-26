const express = require("express");
const router = express.Router();
const { getProblems, addProblem, getProblem, updateProblem, deleteProblem } = require("../controllers/dsaController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All DSA routes require login

router.route("/").get(getProblems).post(addProblem);
router.route("/:id").get(getProblem).put(updateProblem).delete(deleteProblem);

module.exports = router;
