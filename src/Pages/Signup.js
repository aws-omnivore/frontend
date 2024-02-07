import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    birthDate: "",
    country: "",
    gender: "",
  });
  //   const history = useHistory();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userInfo);
    // history.push("/edit-store");
    navigate("/admin-landing");
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <input type="date" name="birthDate" onChange={handleChange} />
        <select name="country" onChange={handleChange}>
          <option value="">Select Country</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Australia">Australia</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
          <option value="South Korea">South Korea</option>
        </select>
        <div className="gender-radio\">
          <input
            type="radio"
            id="male"
            name="gender"
            value="Male"
            onChange={handleChange}
          />
          <label htmlFor="male\">남자</label>
          <input
            type="radio"
            id="female"
            name="gender"
            value="Female"
            onChange={handleChange}
          />
          <label htmlFor="female">여자</label>
          <input
            type="radio"
            id="other"
            name="gender"
            value="Other"
            onChange={handleChange}
          />
          <label htmlFor="other">Other</label>
        </div>
        <button type="submit">저장</button>
      </form>
    </div>
  );
}

export default Registration;
