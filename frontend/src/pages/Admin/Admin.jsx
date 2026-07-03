import { useEffect, useState } from "react";
import { Layout, Card, Tabs, Table, Tag, Button, Popconfirm, Typography, message, Avatar } from "antd";
import { UserOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Dashboard/components/Sidebar";
import { getAllLeavesAdmin, updateLeaveStatus, getAllEmployees, deleteEmployee, getCurrentEmployee } from "../../api";

const { Header, Content } = Layout;
const { Title } = Typography;

const statusColors = { pending: "gold", approved: "green", rejected: "red" };

function Admin() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [me, setMe] = useState(null);

  const loadData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getCurrentEmployee(token)
      .then((data) => {
        if (data.role !== "admin") {
          message.error("Admin access required");
          navigate("/dashboard");
          return;
        }
        setMe(data);
        getAllLeavesAdmin(token).then(setLeaves).catch(() => message.error("Failed to load leave requests"));
        getAllEmployees(token).then(setEmployees).catch(() => message.error("Failed to load employees"));
      })
      .catch(() => navigate("/login"));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLeaveAction = async (leaveId, status) => {
    try {
      const token = localStorage.getItem("token");
      await updateLeaveStatus(token, leaveId, status);
      message.success(`Leave ${status}`);
      loadData();
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteEmployee(token, id);
      message.success("Employee removed");
      loadData();
    } catch (err) {
      message.error(err.message);
    }
  };

  const leaveColumns = [
    { title: "Employee", dataIndex: "employee_name", key: "employee_name" },
    { title: "Type", dataIndex: "leave_type", key: "leave_type" },
    { title: "Start", dataIndex: "start_date", key: "start_date" },
    { title: "End", dataIndex: "end_date", key: "end_date" },
    { title: "Reason", dataIndex: "reason", key: "reason", render: (v) => v || "—" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "pending" ? (
          <div className="flex gap-2">
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleLeaveAction(record.id, "approved")}
            >
              Approve
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleLeaveAction(record.id, "rejected")}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-gray-400">No actions</span>
        ),
    },
  ];

  const employeeColumns = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<UserOutlined />} className="bg-blue-600" />
          <span>{record.first_name} {record.last_name}</span>
        </div>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Department", dataIndex: "department", key: "department", render: (v) => v || "—" },
    { title: "Position", dataIndex: "position", key: "position", render: (v) => v || "—" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={role === "admin" ? "purple" : "blue"}>{role}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.id === me?.id ? (
          <span className="text-gray-400">You</span>
        ) : (
          <Popconfirm
            title="Remove this employee?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteEmployee(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Remove
            </Button>
          </Popconfirm>
        ),
    },
  ];

  if (!me) return null;

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Header className="flex items-center bg-white shadow px-6">
          <Title level={4} className="!mb-0 !text-blue-600">
            Admin Panel
          </Title>
        </Header>

        <Content className="p-8 bg-gray-100">
          <Card className="shadow-sm">
            <Tabs
              defaultActiveKey="leaves"
              items={[
                {
                  key: "leaves",
                  label: "Leave Approvals",
                  children: (
                    <Table
                      dataSource={leaves}
                      columns={leaveColumns}
                      rowKey="id"
                      pagination={{ pageSize: 8 }}
                    />
                  ),
                },
                {
                  key: "employees",
                  label: "Manage Employees",
                  children: (
                    <Table
                      dataSource={employees}
                      columns={employeeColumns}
                      rowKey="id"
                      pagination={{ pageSize: 8 }}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;