import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCurrentPlayerOffset } from '../store/redux/gameReducer';

// 创建一个axios实例
const apiClientRuningService = axios.create({
    baseURL: 'http://localhost:8097',
    timeout: 10000,
});
const apiClientRecordingService = axios.create({
    baseURL: 'http://localhost:8098',
    timeout: 10000,
});

// 请求拦截器
apiClientRuningService.interceptors.request.use(config => {
    // 可以在这里添加认证令牌等信息
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
apiClientRuningService.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
});



export const fetchGameState = async (roomId) => {
    try {
        const response = await apiClientRuningService.get(`/api/game/${roomId}/fullstate`);
        console.log("get the rest data success!",response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch game state:", error);
        throw error;
    }
};


// 新增获取房间数据的函数
export const fetchRooms = async () => {
    try {
        const response = await apiClientRuningService.get('/api/rooms');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch rooms:", error);
        throw error;
    }
};
export const fetchRoomPlayersByRoomId = async (roomId) => {
    try {
        const response = await apiClientRuningService.get(`/api/rooms/${roomId}/players`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch recordings for user ${roomId}:`, error);
        throw error;
    }
};
export const addPlayerToRoom = async (roomId, player) => {
    try {
        const response = await apiClientRuningService.post(`/api/rooms/${roomId}/players`,player);
        return response.data;
    } catch (error) {
        console.error(`Failed to add player ${player} to room ${roomId}:`, error);
        throw error;
    }
};

export const removePlayerFromRoom = async (roomId, playerId) => {
    // alert("roomid:"+roomId+"pld:"+playerId)
    try {
        console.log("begin to send rest data:"+`/api/rooms/${roomId}/players/${playerId}`);
        const response = await apiClientRuningService.delete(`/api/rooms/${roomId}/players/${playerId}`);
        console.log("remove back data:"+response.data);

        return response.data;
    } catch (error) {
        console.error(`Failed to remove player ${playerId} from room ${roomId}:`, error);
        throw error;
    }
};

// 新增记录游戏动作的函数
export const recordGameActions = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClientRecordingService.post('/api/recordings/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to upload recording file:", error);
        throw error;
    }
};
// 新增获取录制文件内容的函数
export const fetchRecordingFileContent = async (userId) => {
    try {
        const response = await apiClientRecordingService.get(`/api/recordings/content/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch recording file content:", error);
        throw error;
    }
};
// 新增获取指定用户所有recording ID的函数
export const fetchRecordingsByUserId = async (userId) => {
    try {
        const response = await apiClientRecordingService.get(`/api/recordings/list/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch recordings for user ${userId}:`, error);
        throw error;
    }
};

