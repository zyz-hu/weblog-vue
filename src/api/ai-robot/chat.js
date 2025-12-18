import axios from "@/axios";

// 新建对话
export function newChat(message) {
    return axios.post("/robot/chat/new", { message }, { baseURL: "" });
}

// 查询历史消息分页列表
export function findChatMessagePageList(current, size, chatId) {
    return axios.post("/robot/chat/message/list", { current, size, chatId }, { baseURL: "" });
}

// 查询历史对话列表
export function findHistoryChatPageList(current, size) {
    return axios.post("/robot/chat/list", { current, size }, { baseURL: "" });
}

// 删除对话
export function deleteChat(uuid) {
    return axios.post("/robot/chat/delete", { uuid }, { baseURL: "" });
}

// 重命名对话
export function renameChat(id, summary) {
    return axios.post("/robot/chat/summary/rename", { id, summary }, { baseURL: "" });
}
