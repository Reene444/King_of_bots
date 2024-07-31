import axios from 'axios';

// 创建一个axios实例
const apiClient = axios.create({
    baseURL: 'http://localhost:8097',
    timeout: 10000,
});

// 请求拦截器
apiClient.interceptors.request.use(config => {
    // 可以在这里添加认证令牌等信息
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
apiClient.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
});

export const fetchGameState = async (roomId) => {
    try {
        const response = await apiClient.get(`/api/game/${roomId}/fullstate`);
        console.log("get the rest data success!",response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch game state:", error);
        throw error;
    }
};

// 其他请求函数...
