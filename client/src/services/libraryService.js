import api from './api';

export const fetchDashboardStats = async () => (await api.get('/dashboard/stats')).data;
export const fetchBooks = async (params = {}) => (await api.get('/books', { params })).data;
export const createBook = async (payload, isFormData = false) =>
  (await api.post('/books', payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {})).data;
export const updateBook = async (id, payload, isFormData = false) =>
  (await api.put(`/books/${id}`, payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {})).data;
export const deleteBook = async (id) => (await api.delete(`/books/${id}`)).data;
export const fetchMembers = async (params = {}) => (await api.get('/members', { params })).data;
export const createMember = async (payload) => (await api.post('/members', payload)).data;
export const updateMember = async (id, payload) => (await api.put(`/members/${id}`, payload)).data;
export const deleteMember = async (id) => (await api.delete(`/members/${id}`)).data;
export const fetchBorrowRecords = async (params = {}) => (await api.get('/borrows', { params })).data;
export const issueBook = async (payload) => (await api.post('/borrows/issue', payload)).data;
export const returnBook = async (id, payload) => (await api.put(`/borrows/return/${id}`, payload)).data;
export const fetchReservations = async (params = {}) => (await api.get('/reservations', { params })).data;
export const updateReservation = async (id, payload) => (await api.put(`/reservations/${id}`, payload)).data;
export const createReservation = async (payload) => (await api.post('/reservations', payload)).data;
export const fetchFines = async (params = {}) => (await api.get('/fines', { params })).data;
export const updateFine = async (id, payload) => (await api.put(`/fines/${id}`, payload)).data;
export const fetchNotifications = async () => (await api.get('/notifications')).data;
export const markNotificationAsRead = async (id) => (await api.put(`/notifications/${id}/read`)).data;
export const fetchReports = async (params = {}) => (await api.get('/reports/analytics', { params })).data;
export const exportPdfReport = async (type) => (await api.get(`/reports/pdf/${type}`, { responseType: 'blob' })).data;
export const exportExcelReport = async (type) => (await api.get(`/reports/excel/${type}`, { responseType: 'blob' })).data;
export const fetchMyBorrowings = async () => (await api.get('/borrows/my/history')).data;
export const fetchMyRecommendations = async () => (await api.get('/members/me/recommendations')).data;
