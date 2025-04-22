import { useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";

const ClientIntro = () => {
  const navigate = useNavigate();

  const handleBookService = () => {
    navigate("/client-dashboard");
  };

  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: "url('/17543705_1911.i126.029_video_bloggers_set-09[1].jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "2rem",
        position: "relative",
      }}
    >
     
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 0,
        }}
      />

      
      <Container style={{ maxWidth: "850px", zIndex: 1 }}>
        <Card className="p-5 shadow-lg rounded-4 border-0 bg-light bg-opacity-75">
          <h1 className="text-center fw-bold mb-3 text-primary">Welcome to FixFriend</h1>
          <h4 className="text-center text-dark mb-4">
            Your Trusted Partner in Home Repair & Maintenance Services
          </h4>
          <p className="text-center text-secondary">
            At <strong>FixFriend</strong>, we connect you with skilled and certified technicians
            for a wide range of home services — from plumbing, electrical work, and appliance
            repairs to painting and cleaning.
          </p>
          <p className="text-center text-secondary">
            Whether it's a minor fix or a major installation, we ensure top-notch service, fast
            response, and satisfaction guarantee — all through our seamless platform.
          </p>
          <p className="text-center text-secondary">
            Trusted by thousands of households, FixFriend is here to make your life easier and
            your home better.
          </p>

          <div className="text-center mt-4">
            <Button
              variant="primary"
              onClick={handleBookService}
              className="px-5 py-2 fw-semibold rounded-pill shadow"
            >
              Book a Service
            </Button>
          </div>
        </Card>
      </Container>

      
      <footer
        style={{
          width: "100%",
          padding: "1rem 0",
          marginTop: "2rem",
          background: "rgba(2, 16, 36, 0.75)",
          color: "#C1E8FF",
          textAlign: "center",
          fontSize: "0.95rem",
          backdropFilter: "blur(8px)",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      >
        <div>
          <div style={{ fontWeight: "600", fontSize: "1.1rem", color: "#B7D3F4" }}>
            🔧 FixFriend <span style={{ fontWeight: "400" }}>– Reliable Service Starts Here</span>
          </div>
          <div style={{ marginTop: "0.3rem" }}>
            &copy; {new Date().getFullYear()} FixFriend. All rights reserved.
          </div>
          <div style={{ fontSize: "0.85rem", color: "#A8CBE8" }}>
            v1.0.0 – Empowering clients & technicians
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientIntro;
