import api from './api';

export interface User {
    id: number;
    email: string;
    full_name?: string;
    is_active: boolean;
    is_admin: boolean;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface AuthResult {
    access_token: string;
    user: User;
}

export const login = async (email: string, password: string): Promise<AuthResult> => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    // Step 1: Get the access token
    const response = await api.post<AuthResponse>('/auth/login', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const { access_token } = response.data;

    // Step 2: Use the token to fetch the current user's info
    const userResponse = await api.get<User>('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    return { access_token, user: userResponse.data };
};

export const register = async (email: string, password: string, security_question: string, security_answer: string): Promise<AuthResult> => {
    // Step 1: Register the user
    await api.post('/auth/register', { email, password, security_question, security_answer });

    // Step 2: Log them in to get a token + user info
    return login(email, password);
};
