// ./Pages/Bookmark.js

import React, { useState, useEffect, useContext } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BookmarkContext } from "../BookmarkContext"; // BookmarkContext 임포트 확인
import { FaStar } from 'react-icons/fa';

const TitleContainer = styled.div`
  margin-bottom: 30px; // 제목과 내용 사이의 간격
  padding-bottom: 10px; // 제목 아래의 패딩
  border-bottom: 2px solid #000; // 제목 아래의 구분선
`;

const StoreContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px; // 하단 패딩 추가
  border-bottom: 1px solid #ccc; // 하단 테두리를 회색으로 설정

  &:last-child {
    border-bottom: none; // 마지막 요소는 테두리 없앰
  }
`;
const StoreImage = styled.img`
  width: 100px; // 너비 설정
  height: 100px; // 높이 설정 (정사각형으로 만들기 위해 너비와 동일하게 설정)
  object-fit: cover; // 이미지 비율을 유지하면서 컨테이너에 맞게 조정
  margin-right: 20px; // 오른쪽 여백 추가
  border-radius: 10px; // 이미지의 모서리를 둥글게 처리
`;

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0; // 여백 제거
  h2,
  p {
    margin: 0; // h2와 p 태그의 여백 제거
  }
`;





function Record() {
  const navigate = useNavigate(); // Instantiate useNavigate
  const [stores, setStores] = useState([]); // 빈 배열로 초기화
  const { bookmarks } = useContext(BookmarkContext);
  const [language, setLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");
  const token = localStorage.getItem('id_token');
  const [bookmarkedStores, setBookmarkedStores] = useState({});
  const [localBookmarks, setLocalBookmarks] = useState(() => {
    // 로컬 스토리지에서 북마크 불러오기
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  
      useEffect(() => {
    // 저장된 북마크 확인
    const savedBookmarks = localStorage.getItem('bookmarks');
    console.log('저장된 북마크:', savedBookmarks ? JSON.parse(savedBookmarks) : '저장된 북마크 없음');
    if (savedBookmarks) {
      const parsedSavedBookmarks = JSON.parse(savedBookmarks);
      setLocalBookmarks(parsedSavedBookmarks);
      
      // localBookmarks 변경 시 bookmarkedStores 업데이트
      const updatedBookmarkedStores = parsedSavedBookmarks.reduce((acc, id) => {
        acc[id] = true; // 북마크된 식당에 대해 true로 설정
        return acc;
      }, {});
      setBookmarkedStores(updatedBookmarkedStores);
    }
  }, []); // 의존성 없음, 마운트 시 한 번 실행

  useEffect(() => {
    const token = localStorage.getItem('id_token');
    const fetchRecorrd = async () => {
      // 최근 기록 조회 로직
      if (language) {
        setLanguage(language); // 'setSelectedLanguage' 대신 'setLanguage' 사용
      }
      if (!token) {
        console.error("토큰이 없습니다. 로그인이 필요합니다.");
        return;
      }

      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Language': language
          }
        };
        const response = await axios.get('https://api.sketch-food.com:443/api/v1/recents', config);
        setStores(response.data);
      } catch (error) {
        console.error('최근 기록 조회 오류', error);
      }
    };
  
    fetchRecorrd();
  }, [location, language]); 

 // toggleBookmark 함수
  // 북마크 클릭 핸들러
  const handleBookmarkClick = async (store) => {
    const token = localStorage.getItem('id_token');
    const isAlreadyBookmarked = localBookmarks.includes(store.id);
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Language': language
      }
    };
    
  if (isAlreadyBookmarked) {
    // 북마크 삭제
    try {
      await axios.delete(`/api/v1/bookmarks?restaurantId=${store.id}`, config);
      const updatedLocalBookmarks = localBookmarks.filter(id => id !== store.id);
      setLocalBookmarks(updatedLocalBookmarks); // 로컬 상태 업데이트
      localStorage.setItem('bookmarks', JSON.stringify(updatedLocalBookmarks)); // 로컬 스토리지 업데이트
    } catch (error) {
      console.error('북마크 삭제 오류:', error);
    }
  } else {
    // 북마크 추가
    try {
      await axios.post(`/api/v1/bookmarks?restaurantId=${store.id}`, {}, config);
      const updatedLocalBookmarks = [...localBookmarks, store.id];
      setLocalBookmarks(updatedLocalBookmarks); // 로컬 상태 업데이트
      localStorage.setItem('bookmarks', JSON.stringify(updatedLocalBookmarks)); // 로컬 스토리지 업데이트
    } catch (error) {
      console.error('북마크 추가 오류:', error);
    }
  }
  setBookmarkedStores(prev => ({
    ...prev,
    [store.id]: !prev[store.id],
  }));
  };
  
const isBookmarked = (id) => localBookmarks.includes(id);
  return (
    <div>
      <TitleContainer>
        <h1>Record page</h1>
      </TitleContainer>
      {stores.map((store) => (
        <StoreContainer key={store.id} onClick={() => navigate(`/information/${store.id}`)}>
          <StoreImage src={store.photo} alt={store.name} />
          <StoreInfo>
            <h2>{store.name}</h2>
            <p>{store.category}</p>
          </StoreInfo>
          <FaStar
            size={30}
            color={isBookmarked(store.id) ? "yellow" : "gray"}
            onClick={(e) => {
              e.stopPropagation();
              handleBookmarkClick(store);
            }}
            style={{ marginRight: "0px" }}
          />
        </StoreContainer>
      ))}
    </div>
  );
}

export default Record;
