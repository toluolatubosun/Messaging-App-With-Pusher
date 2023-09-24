const router = require("express").Router();

const { role } = require("../config");
const response = require("../utils/response");
const Inbox = require("../models/inbox.model");
const Message = require("../models/message.model");
const CustomError = require("../utils/custom-error");
const auth = require("../middlewares/auth.middleware");
const PusherUtil = require("../utils/pusher");

router.post("/send-message", auth(role.USER), async (req, res) => {
    if (!req.body.text) throw new CustomError("text is required", 400);
    if (!req.body.inboxId) throw new CustomError("inboxId is required", 400);

    const inbox = await Inbox.findOne({ _id: req.body.inboxId });
    if (!inbox) throw new CustomError("Inbox does not exist", 400);

    const userInInbox = inbox.users.find((user) => user.id === req.$user.id);
    if (!userInInbox) throw new CustomError("User does not exist in inbox", 400);
    
    const message = await new Message({
        text: req.body.text,
        sender: req.$user.id,
        inbox: req.body.inboxId,
    }).save();

    const params = {}
    if (req.body.socketId) params.socket_id = req.body.socketId;

    await PusherUtil.trigger(`presence-inbox-${req.body.inboxId}`, "new-message", message, params);

    res.status(200).json(response("Message sent", message, true));
});

router.get("/get-messages-in-inbox/:inboxId", auth(role.USER), async (req, res) => {
    if (!req.params.inboxId) throw new CustomError("inboxId is required", 400);

    const inbox = await Inbox.findOne({ _id: req.params.inboxId });
    if (!inbox) throw new CustomError("Inbox does not exist", 400);

    const userInInbox = inbox.users.find((user) => user.id === req.$user.id);
    if (!userInInbox) throw new CustomError("User does not exist in inbox", 400);

    const messages = await Message.find({ inbox: req.params.inboxId });

    res.status(200).json(response("Messages found", messages, true));
});

module.exports = router;