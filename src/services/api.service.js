import api from '../utils/axios.config';

const apiService = {
    login: async (dataLogin) => {
        try {
            const response = await api.post('/auth/login.php', dataLogin);
            if (response.data.status === 'success' && response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Gagal melakukan login');
        }
    },

    register: async (dataRegister) => {
        try {
            const response = await api.post('/auth/register.php', dataRegister);
            
            if (!response.data) {
                throw new Error('Tidak ada respons dari server');
            }
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message);
            }
            
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'Gagal melakukan registrasi'
            );
        }
    },

    logout: () => {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return { status: 'success', message: 'Berhasil logout' };
        } catch (error) {
            throw new Error('Gagal melakukan logout');
        }
    },

    getUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            throw new Error('Gagal mengambil data user');
        }
    },

    isLoggedIn: () => {
        return !!localStorage.getItem('token');
    }
};

export default apiService;