//Employee salary updation page

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Details = () => {
    const [employeeID, setEmployeeID] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [employeeDOB, setEmployeeDOB] = useState("");
    const [salary, setSalary] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Redirect to login if not logged in
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn"); // Clear login status
        navigate("/"); 
    };
    // Fetch employee details from the server
    const fetchEmployeeDetails = async (id) => {
        try {
            const response = await axios.post(
                "/ReactTest/ReactTest.php", 
                {
                    RequestID: "GetEmployeeDetails",
                    EmployeeID: id,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log("API Response:", response.data);

            if (response.data.RC === 0) {
                setEmployeeName(response.data.Name || "");
                setEmployeeDOB(response.data.DOB || "");
                setMessage("");
            } else {
                // Clear details and show error if not found
                setEmployeeName("");
                setEmployeeDOB("");
                setSalary("");
                setMessage({ text: "Invalid Employee ID.", color: "red" });
            }
        } catch (error) {
            console.error("Error connecting to the server:", error);
            setMessage({ text: "Error connecting to the server.", color: "red" });
        }
    };
     // Handle changes to the Employee ID input
    const handleEmployeeIDChange = (e) => {
        const id = e.target.value;
        setEmployeeID(id);
        if (id.trim() === "") {
            setEmployeeName("");
            setEmployeeDOB("");
        }
    };

    const handleEmployeeIDBlur = async () => {
        if (employeeID.trim() !== "") {
            await fetchEmployeeDetails(employeeID); // Fetch details if ID is not empty
        } else {
            setEmployeeName("");
            setEmployeeDOB("");
            setMessage({ text: "Employee ID cannot be empty.", color: "red" });
        }
    };

    const updateSalary = async () => {
        try {
        // Check if the salary contains only digits
        if (!/^\d+$/.test(salary)) {
            setMessage({ text: "Salary must be a numeric value.", color: "red" });
        return;
        }
            const salaryNumber = parseInt(salary, 10);
            if (salaryNumber < 1 || salaryNumber > 25000) {
                setMessage({ text: "Salary must be a number between 1 and 25000.", color: "red" });
                return;
            }

            const response = await axios.post(
                "/ReactTest/ReactTest.php", 
                {
                    RequestID: "UpdateSalary",
                    EmployeeID: employeeID,
                    Salary: salary,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log("API Response:", response.data);

            if (response.data.RC === 0) {
                setMessage({ text: "Salary updated successfully.", color: "green" });
            } else {
                setMessage({ text: "Failed to update salary. Please try again.", color: "red" });
            }
        } catch (error) {
            console.error("Error connecting to the server:", error);
            setMessage({ text: "Error connecting to the server.", color: "red" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (employeeName && employeeDOB) {
            await updateSalary(); // Proceed if valid employee details are present
        } else {
            setMessage({ text: "Please enter a valid Employee ID.", color: "red" });
        }
    };

    return (
        <div className="employee-details">
            <form onSubmit={handleSubmit} className="container">
                <h1><u>Employee Details</u></h1>

                <div className="form-group">
                    <input
                        type="text"
                        value={employeeID}
                        onChange={handleEmployeeIDChange}
                        onBlur={handleEmployeeIDBlur}
                        className="form-control"
                        id="employeeID"
                        placeholder="Employee ID"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        value={employeeName}
                        className="form-control"
                        id="employeeName"
                        placeholder="Name"
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        value={employeeDOB}
                        className="form-control"
                        id="employeeDOB"
                        placeholder="DOB"
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="form-control"
                        id="salary"
                        placeholder="Salary (1-25000)"
                        required
                    />
                </div>

                <div className="form-group">
                    <button type="submit" className="btn btn-success" id="submit">
                        Save
                    </button>
                </div>
                <div className="form-group">
                    <button type="button" onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                        Logout
                    </button>
                </div>
                {message && <p style={{ color: message.color }}>{message.text}</p>}
            </form>
        </div>
    );
};

export default Details;
