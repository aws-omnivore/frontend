// ./Pages/Bookmark.js

import React, { useState, useEffect, useRef, useContext } from "react"; // useContext 추가
import { useNavigate } from "react-router-dom"; // useNavigate 훅 추가
import styled from "styled-components";
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

const StarIcon = styled.span`
  cursor: pointer;
  margin-left: auto; // 별 아이콘을 오른쪽 끝으로 정렬
  color: yellow; // 초기 색상을 노란색으로 설정
`;

//초기데이터
const initialStores = [
  // ... 초기 데이터 더 추가 가능 ...
];

function Test2() {
  const [localBookmarks, setLocalBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const { addBookmark } = useContext(BookmarkContext);

  // 여기서 지정한 store.id를 설정하세요. 예시: const targetStoreId = '123';


  useEffect(() => {
    const token = localStorage.getItem('id_token');
    if (!token) {
      console.error("토큰이 없습니다. 로그인이 필요합니다.");
      return;
    }


const url = `/api/v1/bookmarks?restaurantId=${targetStoreId}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Language': 'en'
      }
    };

    const bookmarkStore = async () => {
      try {
       const response = await axios.post(url, {}, config);
    addBookmark(response.data);
    updateLocalBookmarks([...new Set([...localBookmarks, targetStoreId])]);
      } catch (error) {
        console.error('북마크 추가 오류', error);
      }
    };

    bookmarkStore();
  }, []);

  const updateLocalBookmarks = (bookmarkIds) => {
    setLocalBookmarks(bookmarkIds);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkIds));
  };

 
return (
  <div>
    <TitleContainer>
      <h1>Bookmark page</h1>
    </TitleContainer>
 
    
  </div>
);
}

export default Test2;