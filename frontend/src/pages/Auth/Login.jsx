import { Form, Input, Button, Card, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { loginEmployee } from "../../api";

const { Title } = Typography;

function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const data = await loginEmployee(values);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("employee", JSON.stringify(data.employee));
      message.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm shadow-md">
        <Title level={3} className="text-center mb-6">HRMS Login</Title>

        <Form layout="vertical" onFinish={onFinish}>
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
              Login
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm text-gray-600">
          Not an employee yet?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Register here
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;