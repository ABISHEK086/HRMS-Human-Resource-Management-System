import { useEffect, useState } from "react";
import { Layout, Card, List, Typography, Form, Input, Button, message, Popconfirm, Empty } from "antd";
import { NotificationOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Sidebar from "../Dashboard/components/Sidebar";
import { getAnnouncements, createAnnouncement, deleteAnnouncement, getCurrentEmployee } from "../../api";

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function Inbox() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [me, setMe] = useState(null);
  const [posting, setPosting] = useState(false);
  const [form] = Form.useForm();

  const loadData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getCurrentEmployee(token).then(setMe).catch(() => navigate("/login"));
    getAnnouncements(token)
      .then(setAnnouncements)
      .catch(() => message.error("Failed to load announcements"));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePost = async (values) => {
    setPosting(true);
    try {
      const token = localStorage.getItem("token");
      await createAnnouncement(token, values);
      message.success("Announcement posted");
      form.resetFields();
      loadData();
    } catch (err) {
      message.error(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteAnnouncement(token, id);
      message.success("Announcement deleted");
      loadData();
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Header className="flex items-center bg-white shadow px-6">
          <Title level={4} className="!mb-0 !text-blue-600">
            Inbox
          </Title>
        </Header>

        <Content className="p-8 bg-gray-100">
          {me?.role === "admin" && (
            <Card title="Post an Announcement" className="mb-6 shadow-sm max-w-2xl">
              <Form form={form} layout="vertical" onFinish={handlePost}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: "Title is required" }]}
                >
                  <Input placeholder="e.g. Office closed on Friday" />
                </Form.Item>
                <Form.Item
                  label="Message"
                  name="message"
                  rules={[{ required: true, message: "Message is required" }]}
                >
                  <Input.TextArea rows={3} placeholder="Announcement details..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={posting}>
                    Post Announcement
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          <Card
            title={
              <span>
                <NotificationOutlined className="mr-2 text-blue-500" />
                Announcements
              </span>
            }
            className="shadow-sm max-w-2xl"
          >
            {announcements.length === 0 ? (
              <Empty description="No announcements yet" />
            ) : (
              <List
                itemLayout="vertical"
                dataSource={announcements}
                renderItem={(item) => (
                  <List.Item
                    actions={
                      me?.role === "admin"
                        ? [
                            <Popconfirm
                              key="delete"
                              title="Delete this announcement?"
                              onConfirm={() => handleDelete(item.id)}
                              okText="Delete"
                              okButtonProps={{ danger: true }}
                            >
                              <Button size="small" danger icon={<DeleteOutlined />}>
                                Delete
                              </Button>
                            </Popconfirm>,
                          ]
                        : []
                    }
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={
                        <Text type="secondary">
                          {item.posted_by_name} · {dayjs(item.created_at).format("MMM D, YYYY hh:mm A")}
                        </Text>
                      }
                    />
                    <Paragraph className="!mb-0 whitespace-pre-line">{item.message}</Paragraph>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Inbox;