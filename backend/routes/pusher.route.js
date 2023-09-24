const router = require("express").Router();

const { role } = require("../config");
const PusherUtil = require("../utils/pusher");
const Inbox = require("../models/inbox.model");
const CustomError = require("../utils/custom-error");
const auth = require("../middlewares/auth.middleware");

router.post("/auth", auth(role.USER), async (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;

    const channelNameParts = channel.split("-");
    const inboxId = channelNameParts[channelNameParts.length - 1];
    
    const inbox = await Inbox.findOne({ _id: inboxId, users: req.$user.id });
    if (!inbox) throw new CustomError("Inbox does not exist or user does not exist in inbox", 401);

    const userObject = req.$user.toObject();
    const userObjectFormatted = {
        user_id: userObject._id.toString(),
        user_info: { ...userObject }
    };

    const authResponse = PusherUtil.authorizeChannel(socketId, channel, userObjectFormatted);
    
    res.status(200).json(authResponse);
});

router.post("/auth-user", auth(role.USER), async (req, res) => {
    const userObject = req.$user.toObject();
    const userObjectFormatted = {
        id: userObject._id.toString(),
        user_info: { ...userObject }
    };

    const userAuthResponse = PusherUtil.authenticateUser(req.body.socket_id, userObjectFormatted);

    res.status(200).json(userAuthResponse);
});

module.exports = router;