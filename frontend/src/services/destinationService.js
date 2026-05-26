import api from './api';

export const destinationService = {
  getAll:  ()         => api.get('/destinations').then((r) => r.data),
  create:  (data)     => api.post('/destinations', data).then((r) => r.data),
  update:  (id, data) => api.put(`/destinations/${id}`, data).then((r) => r.data),
  remove:  (id)       => api.delete(`/destinations/${id}`).then((r) => r.data),
};
