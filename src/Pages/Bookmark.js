// ./Pages/Bookmark.js

import React, { useState, useEffect, useRef, useContext } from "react"; // useContext 추가
import { useNavigate } from "react-router-dom"; // useNavigate 훅 추가
import styled, { css } from 'styled-components';
import axios from 'axios'; // axios 임포트
import { BookmarkContext } from "../BookmarkContext";
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


//초기데이터

function Bookmark() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const { bookmarks } = useContext(BookmarkContext);
  const [localBookmarks, setLocalBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [language, setLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");
  
  // 북마크 조회 함수
  const fetchBookmarks = async () => {
    const token = localStorage.getItem('id_token');
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
    const response = await axios.get('https://api.sketch-food.com:443/api/v1/bookmarks', config);
    // 데이터 중복 제거
    const uniqueData = Array.from(new Set(response.data.map(store => JSON.stringify(store))))
                            .map(item => JSON.parse(item));
    setStores(uniqueData); // 중복이 제거된 데이터를 상태로 설정
    const bookmarkIds = uniqueData.map(store => store.id);
    setLocalBookmarks(bookmarkIds); // 로컬 상태 업데이트
  } catch (error) {
    console.error('북마크 조회 중 오류 발생:', error);
  }
};
  useEffect(() => {
    fetchBookmarks();
  }, [language]);

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
        await axios.delete(`https://api.sketch-food.com:443/api/v1/bookmarks?restaurantId=${store.id}`, config);
        const updatedLocalBookmarks = localBookmarks.filter(id => id !== store.id);
        setLocalBookmarks(updatedLocalBookmarks); // 로컬 상태 업데이트
        localStorage.setItem('bookmarks', JSON.stringify(updatedLocalBookmarks)); // 로컬 스토리지 업데이트
        fetchBookmarks(); // 변경된 북마크 목록 재조회
      } catch (error) {
        console.error('북마크 삭제 오류:', error);
      }
    } else {
      // 북마크 추가
      try {
        await axios.post(`https://api.sketch-food.com:443/api/v1/bookmarks?restaurantId=${store.id}`, {}, config);
        const updatedLocalBookmarks = [...localBookmarks, store.id];
        setLocalBookmarks(updatedLocalBookmarks); // 로컬 상태 업데이트
        localStorage.setItem('bookmarks', JSON.stringify(updatedLocalBookmarks)); // 로컬 스토리지 업데이트
        fetchBookmarks(); // 변경된 북마크 목록 재조회
      } catch (error) {
        console.error('북마크 추가 오류:', error);
      }
    }
  };

  // Fetch new data from the server and assign it to newStores
  // Example:
  // newStores = await fetchMoreStores();

  const goBack = () => {
    if (isFirstPage) {
      navigate("/"); // 메인 페이지로 이동
    } else {
      navigate(-1); // 이전 페이지로 돌아가기
    }
  };

 const isBookmarked = (id) => bookmarks.some(bookmark => bookmark.id === id);
  return (
    <div>
      <TitleContainer>
        <h1>Bookmark page</h1>
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
            color={isBookmarked(store.id) ? "gray" : "yellow"}
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

export default Bookmark;