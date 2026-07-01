import { Form, Input, Button, Card, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerEmployee } from "../../api";

const { Title } = Typography;

function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await registerEmployee(values);
      message.success("Registration successful. Please log in.");
      navigate("/login");
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm shadow-md">
        <Title level={3} className="text-center mb-6">Employee Registration</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login here
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;