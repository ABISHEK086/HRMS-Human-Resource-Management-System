const BASE_URL = "http://127.0.0.1:8000";

export async function registerEmployee(data) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Registration failed");
  }
  return res.json();
}

export async function loginEmployee(data) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }
  return res.json();
}

export async function getCurrentEmployee(token) {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function updateCurrentEmployee(token, data) {
  const res = await fetch(`${BASE_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Update failed");
  }
  return res.json();
}

export async function applyLeave(token, data) {
  const res = await fetch(`${BASE_URL}/leaves`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to apply for leave");
  }
  return res.json();
}

export async function getMyLeaves(token) {
  const res = await fetch(`${BASE_URL}/leaves`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch leaves");
  return res.json();
}

export async function checkIn(token) {
  const res = await fetch(`${BASE_URL}/attendance/check-in`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Check-in failed");
  }
  return res.json();
}

export async function checkOut(token) {
  const res = await fetch(`${BASE_URL}/attendance/check-out`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Check-out failed");
  }
  return res.json();
}

export async function getMyAttendance(token) {
  const res = await fetch(`${BASE_URL}/attendance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch attendance");
  return res.json();
}

export async function getTodayAttendance(token) {
  const res = await fetch(`${BASE_URL}/attendance/today`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch today's attendance");
  return res.json();
}

export async function getAllEmployees(token) {
  const res = await fetch(`${BASE_URL}/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}

export async function getEmployeeById(token, id) {
  const res = await fetch(`${BASE_URL}/employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch employee");
  return res.json();
}

export async function getAllLeavesAdmin(token) {
  const res = await fetch(`${BASE_URL}/admin/leaves`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch leave requests");
  return res.json();
}

export async function updateLeaveStatus(token, leaveId, status) {
  const res = await fetch(`${BASE_URL}/admin/leaves/${leaveId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to update leave status");
  }
  return res.json();
}

export async function deleteEmployee(token, employeeId) {
  const res = await fetch(`${BASE_URL}/admin/employees/${employeeId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to delete employee");
  }
  return res.json();
}

export async function getAnnouncements(token) {
  const res = await fetch(`${BASE_URL}/announcements`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch announcements");
  return res.json();
}

export async function createAnnouncement(token, data) {
  const res = await fetch(`${BASE_URL}/admin/announcements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to post announcement");
  }
  return res.json();
}

export async function deleteAnnouncement(token, id) {
  const res = await fetch(`${BASE_URL}/admin/announcements/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to delete announcement");
  }
  return res.json();
}