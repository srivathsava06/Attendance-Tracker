window.API = {
  BASE_URL: 'http://localhost:5000/api',
  getToken: () => localStorage.getItem('token'),
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  isLoggedIn: () => !!localStorage.getItem('token'),
  logout: () => {
    localStorage.clear();
    window.location.href = 'attendtrack_login_desktop.html.html';
  },
  checkAuth: (allowedRoles = []) => {
    if (!window.API.isLoggedIn()) {
      window.location.href = 'attendtrack_login_desktop.html.html';
      return;
    }
    const user = window.API.getUser();
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      window.location.href = 'attendtrack_login_desktop.html.html';
    }
  },
  call: async (endpoint, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = window.API.getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(window.API.BASE_URL + endpoint, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },
  auth: {
    login: async (email, password, role) => {
      const data = await window.API.call('/auth/login', 'POST', {
        email,
        password,
        role,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    },
    register: (name, email, password, role, studentId, department, teacherId, teacherSubject) =>
      window.API.call('/auth/register', 'POST', { name, email, password, role, studentId, department, teacherId, teacherSubject }),
    adminRegister: (name, email, password, role, studentId, department, teacherId, teacherSubject) => {
      // Register a user without overwriting the current admin's session
      return window.API.call('/auth/register', 'POST', { name, email, password, role, studentId, department, teacherId, teacherSubject });
    },
    getMe: () => window.API.call('/auth/me'),
  },
  subjects: {
    getAll: () => window.API.call('/subjects'),
    create: (data) => window.API.call('/subjects', 'POST', data),
    delete: (id) => window.API.call('/subjects/' + id, 'DELETE'),
    enroll: (subjectId, studentId) =>
      window.API.call('/subjects/' + subjectId + '/enroll', 'POST', {
        studentId,
      }),
  },
  attendance: {
    mark: (subjectId, records) =>
      window.API.call('/attendance/mark', 'POST', { subjectId, records }),
    recordByBranch: (branch, records) =>
      window.API.call('/attendance/record-by-branch', 'POST', { branch, records }),
    getBySubject: (subjectId) => window.API.call('/attendance/' + subjectId),
    getByRange: (subjectId, from, to) =>
      window.API.call(
        '/attendance/range?subjectId=' + subjectId + '&from=' + from + '&to=' + to
      ),
    getMyAttendance: () => window.API.call('/attendance/me'),
  },
  users: {
    getAll: (role = '') => window.API.call('/users' + (role ? '?role=' + role : '')),
    update: (id, data) => window.API.call('/users/' + id, 'PUT', data),
    delete: (id) => window.API.call('/users/' + id, 'DELETE'),
  },
};
