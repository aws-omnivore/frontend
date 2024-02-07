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

function Test() {
  const navigate = useNavigate();
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [stores, setStores] = useState([]); // 빈 배열로 초기화
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const observer = useRef(null);
  const { bookmarks, removeBookmark } = useContext(BookmarkContext);


   useEffect(() => {
    const fetchBookmarks = async () => {
      const token = "eyJraWQiOiIxVlpsMkJYU2NuUEREZnl0cVJDa0hON2JcL1FBOXBNM0FHaEdIcHN6cGhFaz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiSlUzazVXQ0p3Y1NKa1ppOXZrSFJ1dyIsInN1YiI6IjQ2ZTgxOGI2LTU1ZGUtNDEzYy1iYzU4LTRkYTE5N2IzNzAzMiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTJfb0EwWUM1UExDIiwiY29nbml0bzp1c2VybmFtZSI6IjQ2ZTgxOGI2LTU1ZGUtNDEzYy1iYzU4LTRkYTE5N2IzNzAzMiIsImF1ZCI6IjRsZG4wbnFmY2MxYmxtb2I3OWxlcGpjM21xIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MDY2Nzk0ODMsImV4cCI6MTcwNjY4MzA4MywiaWF0IjoxNzA2Njc5NDgzLCJqdGkiOiI3YmFlNDRhYy1lOGNkLTQ2NDktYjZiMy0yMjdhYjI3OTYxOGYiLCJlbWFpbCI6InJoa2RndXMxNDMwQG5hdGUuY29tIn0.KEPO7LyR3hn4G8z7B6vlOhDNvjS_QKaSNZJ2symU7HJm4GbyVvei5VC71lKMYempCCjnzR6OPXtGiyRbyHWG3rGdF9vMTMo6sXr2ylF0dLsVcpdiXafBV-p4x65JIzFPhMLF2HTXeyZsnGQkF6z2GybOQaapbXMdxqcYTdXV1DD6XFNzDPmNuGYVZTTsbjayqurPwTunMvXgOAGz4iz9g_0bqd3qJlRvGqpNdlG-MRRpa3uAF0tEzJOrdJHUdgzFEpx9yGjUTxe-u1q2_RbVCvI9rCWtsn1Lw2gNwQ3ySV0TL744sN8fn2OVshrvQ7VcvtVcBcZOo1yLxz5S_fYdVQ&access_token=eyJraWQiOiJVWUlKSGllZnlKRitpRU1mUFFcL2lKenBpaDB2XC9UVkhvaWNlbzRjQUJYNHM9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI0NmU4MThiNi01NWRlLTQxM2MtYmM1OC00ZGExOTdiMzcwMzIiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6InBob25lIG9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTcwNjY3OTQ4MywiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0yLmFtYXpvbmF3cy5jb21cL2FwLW5vcnRoZWFzdC0yX29BMFlDNVBMQyIsImV4cCI6MTcwNjY4MzA4MywiaWF0IjoxNzA2Njc5NDgzLCJ2ZXJzaW9uIjoyLCJqdGkiOiI0MTEyODQ2OS02ZTNhLTQxMjMtYmI3Zi1jZTgxYTZiMDU1YzQiLCJjbGllbnRfaWQiOiI0bGRuMG5xZmNjMWJsbW9iNzlsZXBqYzNtcSIsInVzZXJuYW1lIjoiNDZlODE4YjYtNTVkZS00MTNjLWJjNTgtNGRhMTk3YjM3MDMyIn0.KyKjrM8PvDRc4qVnb66PVnB8GYv_Ae2pg5ADHRHZJHg8fGmO91-ogLxSarw0CWvv1Ews9oiBiAHMleWklIc7YZRWro3CslzbNPayadIuWihRHLAn16DU6EcPdW-_yvHWNSV-w7rkqt9oZrdDtNo2XmT8wtsMNQaEnb3TZMG9XUbb5nkI87COUICKWUpfxFCGpjf33yajUlzWHRRmI7nB4aFGbVBEWms_KauvP0EQ3sPXLhtzvclmfdxXbm0F9v1SzxPQJbqUjJfJvzGQru297GjMMNTxnP4X7Ph6p7_9tdAgE5lYrtkc11mzmaL3uB-eg2ci3Vt8PYuerVmb5iJg-g"; // Access Token을 적절히 설정
      const userLanguage = 'en'; // 사용자 언어 설정

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Language': userLanguage
        }
      };

      try {
        // API 엔드포인트 URL을 설정하고 GET 요청을 보냅니다.
        const response = await axios.get('/api/v1/bookmarks', config);

        // 응답 데이터를 stores 상태에 설정합니다.
        setStores(response.data);
      } catch (error) {
        console.error('북마크 조회 중 오류 발생:', error);
      }
    };

    fetchBookmarks();
  }, []);

  // Fetch new data from the server and assign it to newStores
  // Example:
    // newStores = await fetchMoreStores();
    const handleBookmarkClick = async (store) => {
  const token = localStorage.getItem('userToken');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  if (isBookmarked(store.id)) {
    try {
      await axios.delete(`http://localhost:8080/api/v1/bookmarks/${store.id}`, config); // 토큰을 포함하여 삭제 요청
      removeBookmark(store.id); // 북마크 목록에서 제거
      removeBookmarkFromState(store.id); // 상태에서 북마크 제거
    } catch (error) {
      console.error('북마크 제거 오류', error);
    }
  } else {
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/bookmarks`, { restaurantId: store.id }, config); // 토큰을 포함하여 추가 요청
      addBookmark(response.data); // 북마크 목록에 추가
      addBookmarkToState(response.data); // 상태에 북마크 추가
    } catch (error) {
      console.error('북마크 추가 오류', error);
    }
  }
};
  
  const addBookmark = (newBookmark) => {
  setBookmarks(prev => [...prev, newBookmark]);
};

const isBookmarked = (id) => {
  return bookmarks.some(bookmark => bookmark.id === id);
  };
  
const removeBookmarkFromState = (id) => {
  setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
};


  const goBack = () => {
    if (isFirstPage) {
      navigate("/"); // 메인 페이지로 이동
    } else {
      navigate(-1); // 이전 페이지로 돌아가기
    }
  };

 
  return (
    <div>
      <TitleContainer>
        <h1>Bookmark page</h1>
      </TitleContainer>
{stores.map((store) => (
  <StoreContainer key={store.id}>
    <StoreImage src={store.photo} alt={store.name} />
    <StoreInfo onClick={() => navigate(`/information/${store.id}`)}>
      <h2>{store.name}</h2>
      <p>{store.category}</p>
      {/* 기타 필요한 정보 표시 */}
    </StoreInfo>
    <FaStar
      onClick={() => handleBookmarkClick(store)}
      style={{
        marginLeft: "auto", // 오른쪽 정렬
        color: isBookmarked(store.id) ? "yellow" : "black", // 별 아이콘의 노란색 설정
        border: "1px solid black", // 테두리 추가
        padding: "3px", // 테두리와 별 아이콘 사이의 여백
        borderRadius: "50%", // 둥근 모양으로 테두리 설정
      }}
    >
      {isBookmarked(store.id) ? "★" : "☆"}
    </FaStar>
  </StoreContainer>
))}

    </div>
  );
}

export default Test;