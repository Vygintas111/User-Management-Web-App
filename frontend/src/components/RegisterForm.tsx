import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// http://localhost:5000
// http://test4app.codespark.lt
const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://test4app.codespark.lt";
const apiUrl = `${backendUrl}/api/auth/register`;

console.log("Backend URL (RegisterForm before handleSubmit):", backendUrl); // Log the backend API
console.log("API Endpoint (RegisterForm before handleSubmit):", apiUrl); // Log the full API endpoint

const RegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // http://localhost:5000
    // http://test4app.codespark.lt
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://test4app.codespark.lt";
    const apiUrl = `${backendUrl}/api/auth/register`;

    console.log("Backend URL (RegisterForm in handleSubmit):", backendUrl);
    console.log("API Endpoint (RegisterForm in handleSubmit):", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.message === "User registered successfully") {
        toast.success("Registration successful! Please log in");
        navigate("/login");
      } else if (data.error === "Email already exists") {
        toast.error("Email already exists");
      } else {
        toast.error("An error occured during registration:");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    }
  };

  return (
    <Container fluid className="vh-100 p-0 d-flex">
      <Row className="g-0 flex-grow-1">
        <Col md={7} className="p-0 d-none d-md-block">
          <img
            src="/mountains.jpg"
            alt="Register Background"
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
            style={{ maxWidth: "400px", minWidth: "280px" }}
          >
            <h2 className="text-center mb-3">Register</h2>
            <hr style={{ borderColor: "black", borderWidth: "2px" }} />
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                />
              </Form.Group>
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </Form.Group>
              <div className="d-flex align-items-center justify-content-center">
                <Button
                  type="submit"
                  className="w-25 mb-3 d-flex align-items-center justify-content-center"
                >
                  Register
                </Button>
              </div>
            </Form>
            <p className="text-center mt-3">
              Already have an account?{" "}
              <a href="/login" style={{ textDecoration: "none" }}>
                <strong>Login</strong>
              </a>
            </p>
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default RegisterForm;
