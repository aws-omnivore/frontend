import React from "react";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AdminLanding() {
  //   const history = useHistory();
  const navigate = useNavigate();

  return (
    <div className="admin-landing-container">
      {/* <button onClick={() => history.push("/edit-store")}>업장 등록</button>
      <button onClick={() => history.push("/registered-stores")}> */}
      <button onClick={() => navigate("/edit-store")}>업장 등록</button>
      <button onClick={() => navigate("/registered-stores")}>업장 관리</button>
      {/* <div className="redirect-link" onClick={() => history.push("/")}> */}
      <div className="redirect-link" onClick={() => navigate("/")}>
        메인 페이지로 돌아가기
      </div>
    </div>
  );
}

export default AdminLanding;
