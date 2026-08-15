const API_URL = 'http://localhost:5000/api/tasks';
const AUTH_URL = 'http://localhost:5000/api/auth';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const taskService = {
  // --- AUTHENTICATION ENDPOINTS ---
  register: async (username, email, password) => {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  login: async (identifier, password) => {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  // --- TASK ENDPOINTS ---
  getTasks: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

    const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL;
    
    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to retrieve secure operations data');
    return await response.json();
  },

  createTask: async (taskData) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    if (!response.ok) throw new Error('Failed to create secure task');
    return await response.json();
  },

  updateTaskStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update status');
    return await response.json();
  },

  deleteTask: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete secure task');
    return await response.json();
  },

  // --- SUBTASK ENDPOINTS ---
  getSubtasks: async (taskId) => {
    const response = await fetch(`http://localhost:5000/api/subtasks/task/${taskId}`, { 
      headers: getAuthHeaders() 
    });
    if (!response.ok) throw new Error('Failed to load subtask metrics.');
    return await response.json();
  },

  createSubtask: async (taskId, title) => {
    const response = await fetch(`http://localhost:5000/api/subtasks/task/${taskId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title })
    });
    if (!response.ok) throw new Error('Failed to append subtask to configuration.');
    return await response.json();
  },

  updateSubtaskProgress: async (subtaskId, isCompleted) => {
    const response = await fetch(`http://localhost:5000/api/subtasks/${subtaskId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isCompleted })
    });
    if (!response.ok) throw new Error('Failed to synchronize checklist state.');
    return await response.json();
  },

  deleteSubtask: async (subtaskId) => {
    const response = await fetch(`http://localhost:5000/api/subtasks/${subtaskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to strip subtask from data registry.');
    return await response.json();
  }
};
getHeatmapData: async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/tasks/analytics/heatmap`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch heatmap data');
  return response.json();
}