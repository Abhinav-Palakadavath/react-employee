import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [UserID, setUserID] = useState("");
    const [Password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "/ReactTest/ReactTest.php", // API endpoint as is
                { RequestID: "SignIn", UserID, Password },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("API Response:", response.data);
            if (response.data.RC === 0) {
                setMessage({ text: "Login Successful", color: "green" });
                localStorage.setItem("isLoggedIn", "true"); // Store login status
                setTimeout(() => {
                    navigate("/details");
                }, 1000);
            } else if (response.data.RC === 1) {
                setMessage({ text: "Invalid User ID or Password.", color: "red" });
            } else {
                setMessage({ text: "Unexpected server response.", color: "red" });
            }
        } catch (error) {
            console.error("API Error:", error);
            setMessage({ text: "Error connecting to the server.", color: "red" });
        }
    };

    return (
        <div className="login d-flex align-items-center justify-content-center">
            <form onSubmit={handleSubmit} className="container">
                <h1><u>Login</u></h1>
                <div className="form-group">
                    <input
                        type="text"
                        value={UserID}
                        onChange={(e) => setUserID(e.target.value)}
                        className="form-control"
                        placeholder="User ID"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-sucess" id="submit">
                        Login
                    </button>
                </div>
                {message && <p style={{ color: message.color }}>{message.text}</p>}
            </form>
        </div>
    );
};

export default Login;
