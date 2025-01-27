import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// http://localhost:5000
// http://test4app.codespark.lt
const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://test4app.codespark.lt";
const apiUrl = `${backendUrl}/api/auth/login`;

console.log("Backend URL (LoginForm before handleSubmit):", backendUrl); // Log the backend API
console.log("API Endpoint (LoginForm before handleSubmit):", apiUrl); // Log the full API endpoint

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // http://localhost:5000
    // http://test4app.codespark.lt
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://test4app.codespark.lt";
    const apiUrl = `${backendUrl}/api/auth/login`;

    console.log("Backend URL (LoginForm before handleSubmit):", backendUrl);
    console.log("API Endpoint (LoginForm before handleSubmit):", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        localStorage.setItem("userId", data.user.id);
        navigate("/dashboard");
      } else {
        toast.error(data.error || "An unexpected eror occurred");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  return (
    <Container fluid className="vh-100 p-0 d-flex">
      <Row className="g-0 flex-grow-1">
        <Col md={7} className="p-0 d-none d-md-block">
          <img
            src="/mountains.jpg"
            alt="Login Background"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </Col>

        <Col
          md={5}
          className="p-0 d-flex align-items-center justify-content-center"
        >
          <div
            className="w-75 p-4 bg-white rounded-4 shadow-sm"
            style={{
              maxWidth: "400px",
              minWidth: "280px",
            }}
          >
            <h2 className="text-center mb-3">Sign In</h2>
            <hr style={{ borderColor: "black", borderWidth: "2px" }} />
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPasword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </Form.Group>
              <div className="d-flex align-items-center justify-content-center">
                <Button
                  type="submit"
                  className="w-25 mb-3 d-flex align-items-center justify-content-center"
                >
                  Login
                </Button>
              </div>
            </Form>
            <p className="text-center mt-3">
              Don't have an account?{" "}
              <a href="/register" style={{ textDecoration: "none" }}>
                <strong>Register</strong>
              </a>
            </p>
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default LoginForm;
