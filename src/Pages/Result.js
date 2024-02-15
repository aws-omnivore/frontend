// Information.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // axios 임포트
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const StoreHeader = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
  flex: 1;
  img {
    width: 100%; // 이미지 크기 조정
    max-width: 300px; // 최대 너비 설정
    height: auto;
    border-radius: 10px;
  }
`;

const StoreInfoContainer = styled.div`
  flex: 2;
  padding-left: 20px; // 사진과 정보 사이 간격
`;

const MenuList = styled.div`
  width: 100%;
`;

const MenuItem = styled.div`
  display: flex; // 플렉스 레이아웃 사용
  align-items: center; // 세로축 중앙 정렬
  border-bottom: 1px solid #ccc; // 구분선 추가
  padding: 10px 0;
`;

const MenuItemContent = styled.div`
  // 메뉴 이름과 설명을 감싸는 컨테이너
`;

const MenuImage = styled.img`
  max-width: 100px; // 메뉴 이미지의 최대 너비
  height: auto; // 이미지의 높이를 자동으로 조절
  border-radius: 5px; // 이미지의 모서리를 약간 둥글게 처리
  margin-right: 10px; // 이미지와 텍스트 사이의 여백
`;

const Result = () => {
  const location = useLocation();
  const [storeDetails, setStoreDetails] = useState(location.state?.data); // 상태와 업데이트 함수 정의
  const [menuDetailsVisible, setMenuDetailsVisible] = useState({});
  const [language, setLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");

  if (!storeDetails) {
    return <div>No data available</div>;
  }

  const toggleMenuDetails = (menuId) => {
    setMenuDetailsVisible((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };
  

  const operationList = storeDetails.operation.map((day, index) => {
    const [key, value] = Object.entries(day)[0];
    return <li key={index}>{`${key}: ${value}`}</li>;
  });

    const getCurrencySymbol = (language) => {
    switch (language) {
      case "en":
        return "$";
      case "ja":
        return "¥";
      case "ko":
        return "₩";
      default:
        return "$"; // 기본값은 달러로 설정
    }
  };

  return (
    <InfoContainer>
      <StoreHeader>
        <ImageContainer>
          <img src={storeDetails.photo} alt={storeDetails.name} />
        </ImageContainer>
        <StoreInfoContainer>
          <h2>{storeDetails.name}</h2>
          <p>{storeDetails.category}</p>
          {/* 여기서 storeDetails.operation 등 추가 정보가 있으면 표시할 수 있습니다 */}
                    <div>
            <h4>Operation Hours:</h4>
            <ul>{operationList}</ul>
          </div>
        </StoreInfoContainer>
      </StoreHeader>
      <MenuList>
        {storeDetails.menus.map((menu) => (
          <MenuItem key={menu.menu_id}>
            <MenuImage src={menu.photo} alt={menu.name} />
            <MenuItemContent onClick={() => toggleMenuDetails(menu.menu_id)}>
              <h3>{menu.name} - {menu.price.toFixed(2)}{getCurrencySymbol(language)}</h3>
              {menuDetailsVisible[menu.menu_id] && <p>{menu.description}</p>}
            </MenuItemContent>
          </MenuItem>
        ))}
      </MenuList>
    </InfoContainer>
  );
};

export default Result;