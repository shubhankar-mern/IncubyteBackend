const express = require("express");
const { employeeController } = require("../controllers");

const router = express.Router();

router.get("/", employeeController.getAll);
router.get("/:id", employeeController.getById);
router.post("/", employeeController.create);
router.put("/:id", employeeController.update);
router.patch("/:id", employeeController.update);
router.delete("/:id", employeeController.delete);

module.exports = router;