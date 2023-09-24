import $http from "./xhr";

export const authLogin = async (data: any) => await $http.post("/api/auth/login", data);
export const authRegister = async (data: any) => await $http.post("/api/auth/register", data);

export const userGetMe = async () => await $http.get(`/api/user/me`);
export const usersFindUsers = async (data: any) => await $http.get("/api/user/find-users", data);

export const inboxGetInboxWithUser = async (userId: string) => await $http.post(`/api/inbox/get-inbox-with-user`, { userId });

export const messageSendMessage = async (data: any) => await $http.post("/api/message/send-message", data);
export const messageGetMessagesInInbox = async (inboxId: string) => await $http.get(`/api/message/get-messages-in-inbox/${inboxId}`);
