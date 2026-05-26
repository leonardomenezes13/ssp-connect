import api from './api';

export const ticketService = {
  getAll:       (params = {}) => api.get('/tickets', { params }).then((r) => r.data),
  getById:      (id)          => api.get(`/tickets/${id}`).then((r) => r.data),
  create:       (data)        => api.post('/tickets', data).then((r) => r.data),
  updateStatus: (id, status)  => api.put(`/tickets/${id}/status`, { status }).then((r) => r.data),
  remove:       (id)          => api.delete(`/tickets/${id}`).then((r) => r.data),
};
