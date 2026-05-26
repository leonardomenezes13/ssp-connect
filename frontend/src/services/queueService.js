import api from './api';

export const queueService = {
  getQueue:      ()         => api.get('/queue').then((r) => r.data),
  getMyPosition: (ticketId) => api.get(`/queue/my-position/${ticketId}`).then((r) => r.data),
};
