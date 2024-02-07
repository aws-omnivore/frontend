import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function EditStore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  //   const history = useHistory();
  //   const history = useNavi();
  const navigate = useNavigate();

  useEffect(() => {
    // 여기에서 DB로부터 메뉴 목록을 가져오는 API 호출을 구현합니다.
    // 임시 데이터로 예시를 들면 다음과 같습니다:
    setMenuItems([
      { name: "메뉴 1", description: "설명 1", image: "image_url_1" },
      { name: "메뉴 2", description: "설명 2", image: "image_url_2" },
      { name: "메뉴 3", description: "설명 3", image: "image_url_3" },
      { name: "메뉴 4", description: "설명 4", image: "image_url_4" },
      { name: "메뉴 5", description: "설명 5", image: "image_url_5" },
      { name: "메뉴 6", description: "설명 6", image: "image_url_6" },
      { name: "메뉴 7", description: "설명 7", image: "image_url_7" },
      { name: "메뉴 8", description: "설명 8", image: "image_url_8" },
      // ... 메뉴 데이터 추가
    ]);
  }, []);

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // Implement search functionality
  };

  return (
    <div className="App">
      <div className="search-section">
        <input
          type="text"
          placeholder="업장 이름"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          조회
        </button>
      </div>
      <div className="menu-section">
        <header className="menu-header">메뉴</header>
        <div className="menu-list">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item">
              <h3>{item.name}</h3>
              <img src={item.image} alt={item.name} className="menu-image" />
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditStore;
