import { useEffect, useState } from "react";
import { Layout, Card, Form, Select, DatePicker, Input, Button, Table, Tag, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Dashboard/components/Sidebar";
import { applyLeave, getMyLeaves } from "../../api";

const { Header, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const statusColors = {
  pending: "gold",
  approved: "green",
  rejected: "red",
};

function Leave() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const loadLeaves = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getMyLeaves(token)
      .then(setLeaves)
      .catch(() => message.error("Failed to load leave history"));
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [start, end] = values.dates;
      await applyLeave(token, {
        leave_type: values.leave_type,
        start_date: start.format("YYYY-MM-DD"),
        end_date: end.format("YYYY-MM-DD"),
        reason: values.reason,
      });
      message.success("Leave request submitted");
      form.resetFields();
      loadLeaves();
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Type", dataIndex: "leave_type", key: "leave_type" },
    { title: "Start Date", dataIndex: "start_date", key: "start_date" },
    { title: "End Date", dataIndex: "end_date", key: "end_date" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Header className="flex items-center bg-white shadow px-6">
          <Title level={4} className="!mb-0 !text-blue-600">
            Leave Management
          </Title>
        </Header>

        <Content className="p-8 bg-gray-100">
          <Card title="Apply for Leave" className="mb-6 shadow-sm max-w-2xl">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Leave Type"
                name="leave_type"
                rules={[{ required: true, message: "Please select a leave type" }]}
              >
                <Select placeholder="Select leave type">
                  <Select.Option value="Sick Leave">Sick Leave</Select.Option>
                  <Select.Option value="Casual Leave">Casual Leave</Select.Option>
                  <Select.Option value="Earned Leave">Earned Leave</Select.Option>
                  <Select.Option value="Unpaid Leave">Unpaid Leave</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Dates"
                name="dates"
                rules={[{ required: true, message: "Please select leave dates" }]}
              >
                <RangePicker className="w-full" />
              </Form.Item>

              <Form.Item label="Reason" name="reason">
                <Input.TextArea rows={3} placeholder="Optional" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit Request
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="My Leave History" className="shadow-sm">
            <Table
              dataSource={leaves}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Leave;