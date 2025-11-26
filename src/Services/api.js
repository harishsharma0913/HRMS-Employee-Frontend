const BASE_URL = "http://localhost:5000";

// 🔐 Get token directly from localStorage
const getToken = () => {
  return localStorage.getItem("token") || "";
};

// 🚫 Handle 401 and global errors
const handleResponse = async (res) => {
  const data = await res.json();

  if (res.status === 401) {
    // Token invalid or expired
    console.warn("Unauthorized. Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    window.location.href = "/"; // redirect to login
  }

  return data;
};

// 🌐 API utility object
const api = {
  // GET request
  get: async (url, config = {}) => {
  const query = config.params
    ? "?" + new URLSearchParams(config.params).toString()
    : "";

  const res = await fetch(`${BASE_URL}${url}${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse(res);
},


  // POST request
  post: async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  // POST FormData (for file uploads)
postFormData: async (url, formData) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData
  });
  return handleResponse(res);
},


  // PATCH request
patch: async (url, body) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(body)
  });
  return handleResponse(res);
},

  // DELETE request
  delete: async (url) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return handleResponse(res);
  }
};

export default api;
