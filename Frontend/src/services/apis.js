const API_BASE_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('accessToken');

const fetchWithAuth = async (url, options = {}) => {

    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.error("❌ No access token found in localStorage.");
        throw new Error("No authentication token available.");
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`, // ✅ Ensure token is properly included
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    if (!response.ok) {
        console.error(`❌ API request failed! Status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};


// Area-related endpoints
export const fetchAreas = async () => {
    console.log("📡 Fetching areas from:", `${API_BASE_URL}/areas`); // 🔍 Debugging
    return fetchWithAuth(`${API_BASE_URL}/areas`);
};


// User-related endpoints
export const fetchUsers = async (area = "") => {
    const token = localStorage.getItem("accessToken");
    console.log("🛠️ Token retrieved from localStorage:", token);

    if (!token) {
        console.error("❌ No access token found in localStorage!");
        return; // Prevent API call if token is missing
    }

    try {
        const url = area
            ? `${API_BASE_URL}/users?area=${area}`
            : `${API_BASE_URL}/users`;


        console.log("🔗 Fetching Users from:", url);

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("📡 Sent Token in API Request:", `Bearer ${token}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; // Re-throw to handle in components
    }
};

export const fetchUserById = async (userId) => {
    return fetchWithAuth(`${API_BASE_URL}/users/${userId}`);
};




// Payment-related endpoints
export const fetchPayments = async (userId = "") => {
    let url = `${API_BASE_URL}/payments`;

    if (userId.trim()) {
        url = `${API_BASE_URL}/payment/${userId}`; // 👈 Use single-user route
    }

    const data = await fetchWithAuth(url);

    // Make sure it always returns an array for consistency
    return Array.isArray(data) ? data : [data];
};


// Subscription-related endpoints
export const fetchSubscriptions = async (userId = '') => {
    const url = userId
        ? `${API_BASE_URL}/subscriber-plans/user/${userId}`
        : `${API_BASE_URL}/subscriber-plans`;
    return fetchWithAuth(url);
};

// Activity-related endpoints
export const fetchUserActivity = async (filter = "all") => {
    let url = `${API_BASE_URL}/users`;

    if (filter === "active") {
        url += "/active";
    } else if (filter === "inactive") {
        url += "/inactive";
    }

    return fetchWithAuth(url); // assumes token is already handled
};
