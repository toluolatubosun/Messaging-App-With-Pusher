import { toast } from "react-toastify";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PusherContext } from "../../_app";
import { useUser, withAuth } from "../../../utils";
import { InputField, Loading } from "../../../components";
import { inboxGetInboxWithUser, messageSendMessage, messageGetMessagesInInbox } from "../../../api";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const Chat: NextPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const pusher = useContext(PusherContext);

    const [inbox, setInbox] = React.useState<any>(null);

    const [message, setMessage] = React.useState<string>("");
    const [messages, setMessages] = React.useState<any[]>([]);

    const [isOnline, setIsOnline] = React.useState<boolean>(false);
    const [isTyping, setIsTyping] = React.useState<boolean>(false);
    const isTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [inboxOtherUser, setInboxOtherUser] = React.useState<any>(null);
    const [inboxOtherUserId, setInboxOtherUserId] = React.useState<string | null>(null);

    // Send message to the other user
    const sendMessage = () => {
        if (message === "") {
            toast.dismiss();
            toast.error("Message cannot be empty");
            return false;
        }
        mutateSendMessage({ text: message, inboxId: inbox._id, socketId: pusher.connection.socket_id ?? null });
        return true;
    };

    // Send message mutation
    const { mutate: mutateSendMessage, isLoading: isLoadingSendMessage } = useMutation(messageSendMessage, {
        onSuccess: (response: AxiosResponse) => {
            setMessage("");
            setMessages((prev) => [...prev, response.data.data]);
        },
        onError: (error: AxiosError) => {
            toast.dismiss();
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    // Messages container scroll to bottom when new message is received
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Send typing event to the other user
    const lastTypingTimeRef = useRef<number>(0);
    const handleTyping = (e: React.FormEvent<HTMLInputElement>) => {
        if (pusher && inbox) {
            // Send typing event to the other user
            // if the last typing event was sent more than 3 seconds ago, this is to limit the amount API calls
            const now = Date.now();
            if (now - lastTypingTimeRef.current > 3000) {
                pusher.connection.send_event(`client-typing`, { isTyping: true, user }, `presence-inbox-${inbox._id}`);
                lastTypingTimeRef.current = now;
            }
        }
    };

    // Get the inbox
    useQuery(["inbox", inboxOtherUserId], () => inboxGetInboxWithUser(inboxOtherUserId as string), {
        onSuccess: (response: AxiosResponse) => {
            setInbox(response.data.data);
            setInboxOtherUser(response.data.data.users.find((item: any) => user._id !== item._id));
        },
        onError: (error: AxiosError) => {
            toast.dismiss();
            toast.error(error.response ? error.response.data.message : error.message);
        },
        enabled: !!inboxOtherUserId && inbox === null
    });

    // Get the messages in the inbox
    useQuery(["messages", inbox?._id], () => messageGetMessagesInInbox(inbox?._id), {
        onSuccess: (response: AxiosResponse) => {
            setMessages(response.data.data);
        },
        onError: (error: AxiosError) => {
            toast.dismiss();
            toast.error(error.response ? error.response.data.message : error.message);
        },
        enabled: !!inbox?._id,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    });

    // Get the other user ID from the URL
    useEffect(() => {
        if (!router.isReady || !user) return;

        const { userId } = router.query;
        if (userId) {
            setInboxOtherUserId(userId as string);
        }
    }, [router.isReady, user]);

    // Subscribe to the inbox channel
    useEffect(() => {
        if (inbox) {
            if (pusher.connection.state === "disconnected") {
                pusher.connection.connect();
            }

            pusher.signin()

            const channel = pusher.subscribe(`presence-inbox-${inbox._id}`);

            channel.bind("pusher:subscription_error", (error: any) => {
                toast.dismiss();
                toast.error(error.status === 401 ? "You are not authorized to access this inbox" : "An error occurred while subscribing to the inbox real-time updates");
            });

            channel.bind("pusher:subscription_succeeded", function () {
                console.log(`::> WebSocket channel subscription succeeded => Inbox ID: ${inbox._id}`);

                // check if the other user is online
                const members = (channel as any).members.members;
                if (members) {
                    const otherUser = Object.keys(members).find((item: any) => item !== user._id);
                    setIsOnline(otherUser !== undefined);
                }

                channel.bind("pusher:member_added", (member: any) => {
                    console.log("::> Member added event received");
                    const isOtherUser = member.id !== user._id;
                    setIsOnline(isOtherUser);
                });

                channel.bind("pusher:member_removed", (member: any) => {
                    console.log("::> Member removed event received");
                    const isOtherUser = member.id !== user._id;
                    setIsOnline(isOtherUser && false);
                });

                channel.bind("new-message", (data: any) => {
                    console.log("::> New message event received");
                    setMessages((prev) => [...prev, data]);
                });

                channel.bind("client-typing", (data: any) => {
                    console.log("::> Typing event received");
                    scrollToBottom();
                    setIsTyping(true);

                    // if the other user is typing, set isTyping to false after 5 seconds
                    if (isTypingTimeoutRef.current) clearTimeout(isTypingTimeoutRef.current);
                    isTypingTimeoutRef.current = setTimeout(() => {
                        setIsTyping(false);
                        isTypingTimeoutRef.current = null;
                    }, 5000);
                });
            });
        }

        return () => {
            if (inbox) {
                pusher.unsubscribe(`presence-inbox-${inbox._id}`);
            }
        };
    }, [inbox]);

    return (
        <>
            <div className="h-full pt-12">
                <h1 className="text-5xl text-center font-Sora font-bold tracking-wider text-primary">Chat Page</h1>

                {inbox === null || inboxOtherUser === null ? (
                    <Loading isParent={true} />
                ) : (
                    <div className="h-full px-20 lg:px-50 mt-16">
                        <div className="text-white font-Sora text-4xl font-semibold tracking wider text-left bg-primary py-3 px-4">
                            <h1>{inboxOtherUser.name}</h1>
                            <p className="text-lg font-medium tracking-wide mt-3">
                                ~ <span className={`${isOnline ? "text-green-600" : "text-red-600"}`}>{isOnline ? "Online" : "Offline"}</span>
                            </p>
                        </div>

                        <div ref={containerRef} className={`h-3/5 bg-white overflow-y-scroll ${isTyping ? "mt-2 rounded-t-md" : "my-2 rounded-md"}`}>
                            <div className="px-3 py-2">
                                {messages.map((item: any, index: number) => (
                                    <div key={index} className={`flex flex-col ${item.sender._id === user._id ? "items-end" : "items-start"} my-2`}>
                                        <div className="bg-primary p-3 rounded text-white">
                                            <p className="text-xl font-semibold mb-2">{item.text}</p>
                                            <p className="text-sm font-Sora">~ {item.sender.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isTyping && (
                            <div className="bg-primary/50 text-white p-2 mb-2">
                                <h1 className="font-Sora">Typing...</h1>
                            </div>
                        )}

                        <InputField
                            type="text"
                            name="message"
                            value={message}
                            required={true}
                            onInput={handleTyping}
                            placeholder="Type your message here"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                        />
                        <div>
                            <button
                                onClick={sendMessage}
                                disabled={isLoadingSendMessage}
                                className="w-full flex justify-center py-4 px-4 rounded shadow-sm text-md font-semibold text-white bg-primary hover:bg-secondary mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default withAuth(Chat);
