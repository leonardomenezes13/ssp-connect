import api from './api';

export const authService = {
  login: (name, password) =>
    api.post('/auth/login', { name, password }).then((r) => r.data),
};
