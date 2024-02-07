import React, { useState, useEffect } from "react";

function RegisteredStores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // TODO: API 호출을 통해 DB에서 가게 정보를 가져오는 코드를 작성하세요.
    // 아래는 임시 데이터 예시입니다.
    setStores([
      { name: "가게 이름 1", info: "가게 정보 1" },
      { name: "가게 이름 2", info: "가게 정보 2" },
      { name: "가게 이름 3", info: "가게 정보 3" },
      { name: "가게 이름 4", info: "가게 정보 4" },
      { name: "가게 이름 5", info: "가게 정보 5" },
      { name: "가게 이름 6", info: "가게 정보 6" },
      { name: "가게 이름 7", info: "가게 정보 7" },
      // 가게 정보는 음식 장르, 운영 정보는 시간 등이 입력 될 예정
      // ... 여기에 더 많은 가게 데이터를 추가할 수 있습니다.
    ]);
  }, []);

  return (
    <div className="App">
      <header className="header">등록한 업장</header>
      <div className="store-list">
        {stores.map((store, index) => (
          <div key={index} className="store-item">
            <div className="store-image-placeholder"></div>
            <div className="store-details">
              <h3 className="store-name">{store.name}</h3>
              <p className="store-info">{store.info}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RegisteredStores;
