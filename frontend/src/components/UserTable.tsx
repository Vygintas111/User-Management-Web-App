import React, { useState, useEffect } from "react";
import { Table, Form, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

// http://localhost:5000
// http://test4app.codespark.lt

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://test4app.codespark.lt";
console.log("(UserTable) Sending request to:", backendUrl);

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  last_login_time: string;
}

type SortConfig = {
  key: keyof User;
  direction: "asc" | "desc";
};

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "email",
    direction: "asc",
  });
  const navigate = useNavigate();

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://test4app.codespark.lt";
  console.log("(UserTable) Sending request to:", backendUrl);

  const fetchUsers = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("You must be logged in to view this page");
        navigate("/login");
        return;
      }

      const apiUrl = `${backendUrl}/api/users`;

      const response = await fetch(apiUrl, {
        headers: {
          "user-id": userId,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        toast.error(data.error || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Failed to fetch users: ", error);
      toast.error("Failed to fetch users: ");
    }
  };

  const handleSort = (key: keyof User) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig) return users;

    return [...users].sort((a, b) => {
      const key = sortConfig.key;
      if (a[key] < b[key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedUsers(users.map((user: any) => user.id));
    else setSelectedUsers([]);
  };

  const handleAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.warning("No users selected");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("You must be logged in to perform this action");
        navigate("/login");
        return;
      }

      const apiUrl = `${backendUrl}/api/users/action`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({ action, userIds: selectedUsers }),
      });

      if (response.status === 403) {
        toast.error("Your account is blocked. Redirecting to login...");
        localStorage.removeItem("userId");
        navigate("/login");
        return;
      }

      if (response.status === 401) {
        toast.error("Unauthorized. Redirecting to login...");
        localStorage.removeItem("userId");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Action failed");
        return;
      }

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setSelectedUsers([]);
      }

      if (data.redirectToLogin) {
        toast.info("Your account has been deleted. Redirecting to login...");
        localStorage.removeItem("userId");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }
      fetchUsers();
    } catch (error) {
      console.error("Action failed: ", error);
      toast.error("An error occured during the action");
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{
        width: "95%",
        marginTop: "2rem",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center w-100 mb-2 p-2 rounded-3 bg-light">
        <div className="d-flex gap-1">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Block selected users</Tooltip>}
          >
            <Button
              onClick={() => handleAction("block")}
              className="me-2 custom-outline-primary"
              variant="outline-primary"
            >
              <i className="bi bi-lock me-1"></i>
              Block
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Unblock selected users</Tooltip>}
          >
            <Button
              onClick={() => handleAction("unblock")}
              className="me-2 custom-outline-primary"
              variant="outline-primary"
            >
              <i className="bi bi-unlock"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Delete selected users</Tooltip>}
          >
            <Button
              onClick={() => handleAction("delete")}
              className="me-2 custom-outline-primary"
              variant="outline-primary"
            >
              <i className="bi bi-person-dash"></i>
            </Button>
          </OverlayTrigger>
        </div>
        <Button
          className="custom-outline-danger"
          variant="outline-danger"
          onClick={() => {
            localStorage.removeItem("userId");
            navigate("/login");
          }}
        >
          Sign Out
        </Button>
      </div>
      <Table className="bg-white" style={{ width: "100%" }}>
        <thead className="table-light">
          <tr className="border-bottom">
            <th>
              <Form.Check type="checkbox" onChange={handleSelectAll} />
            </th>
            <th>Name</th>
            <th
              onClick={() => handleSort("email")}
              style={{ cursor: "pointer" }}
            >
              Email{" "}
              <i
                className={`bi bi-arrow-${
                  sortConfig?.direction === "asc" ? "up" : "down"
                }`}
              ></i>
            </th>
            <th>Last Login</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user: any) => (
            <tr key={user.id} className="border-bottom">
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => {
                    if (selectedUsers.includes(user.id)) {
                      setSelectedUsers(
                        selectedUsers.filter((id) => id !== user.id)
                      );
                    } else {
                      setSelectedUsers([...selectedUsers, user.id]);
                    }
                  }}
                />
              </td>
              <th>{user.name}</th>
              <th>{user.email}</th>
              <th>
                {new Date(user.last_login_time).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </th>
              <th>{user.status}</th>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer />
    </div>
  );
};

export default UserTable;
