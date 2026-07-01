import { useEffect, useState } from "react";
import { Layout, Card, Form, Input, Button, DatePicker, Avatar, Typography, message, Row, Col } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Sidebar from "../Dashboard/components/Sidebar";
import { getCurrentEmployee, updateCurrentEmployee } from "../../api";

const { Header, Content } = Layout;
const { Title } = Typography;

function Profile() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getCurrentEmployee(token)
      .then((data) => {
        setEmployee(data);
        form.setFieldsValue({
          ...data,
          join_date: data.join_date ? dayjs(data.join_date) : null,
        });
      })
      .catch(() => {
        message.error("Session expired, please log in again");
        navigate("/login");
      });
  }, [navigate, form]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...values,
        join_date: values.join_date ? values.join_date.format("YYYY-MM-DD") : null,
      };
      const updated = await updateCurrentEmployee(token, payload);
      setEmployee(updated);
      localStorage.setItem("employee", JSON.stringify(updated));
      message.success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      message.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!employee) return null;

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Header className="flex items-center bg-white shadow px-6">
          <Title level={4} className="!mb-0 !text-blue-600">
            My Profile
          </Title>
        </Header>

        <Content className="p-8 bg-gray-100">
          <Card className="max-w-3xl mx-auto shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar size={64} icon={<UserOutlined />} className="bg-blue-600" />
                <div>
                  <Title level={3} className="!mb-0">
                    {employee.first_name} {employee.last_name}
                  </Title>
                  <p className="text-gray-500">{employee.position || "—"}</p>
                </div>
              </div>

              {!editing ? (
                <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              ) : null}
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              disabled={!editing}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    name="first_name"
                    rules={[{ required: true, message: "First name is required" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last Name"
                    name="last_name"
                    rules={[{ required: true, message: "Last name is required" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Email">
                <Input value={employee.email} disabled />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Phone" name="phone">
                    <Input placeholder="Not set" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Join Date" name="join_date">
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Department" name="department">
                    <Input placeholder="Not set" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Position" name="position">
                    <Input placeholder="Not set" />
                  </Form.Item>
                </Col>
              </Row>

              {editing && (
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => { setEditing(false); form.setFieldsValue({ ...employee, join_date: employee.join_date ? dayjs(employee.join_date) : null }); }}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                    Save Changes
                  </Button>
                </div>
              )}
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Profile;