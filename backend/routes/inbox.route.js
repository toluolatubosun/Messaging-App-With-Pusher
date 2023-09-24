const router = require("express").Router();

const { role } = require("../config");
const response = require("../utils/response");
const Inbox = require("../models/inbox.model");
const CustomError = require("../utils/custom-error");
const auth = require("../middlewares/auth.middleware");

router.post("/get-inbox-with-user", auth(role.USER), async (req, res) => {
    if (!req.body.userId) throw new CustomError("other user is required", 400);

    const inbox = await Inbox.findOne({ users: { $all: [req.$user.id, req.body.userId] } });
    if (inbox) {
        res.status(200).json(response("Inbox found", inbox, true)); 
    } else {
        const newInbox = await new Inbox({ users: [req.$user.id, req.body.userId] }).save();
        res.status(200).json(response("Inbox created", newInbox, true));
    }
});

module.exports = router;