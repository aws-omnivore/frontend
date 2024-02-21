import React, { useState, useEffect, useContext } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BookmarkContext } from "../BookmarkContext"; // BookmarkContext 임포트 확인
import { FaStar } from 'react-icons/fa';
import { useLocationContext } from "../LocationProvider"; // useLocationContext 임포트 확인


const TitleContainer = styled.div`
  margin-bottom: 30px; // 제목과 내용 사이의 간격
  padding-bottom: 10px; // 제목 아래의 패딩
  border-bottom: 2px solid #000; // 제목 아래의 구분선
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap; // 가로로 한 줄에 여러 개의 요소를 나열
  justify-content: space-between; // 요소들 사이에 여백을 둠
`;

const Card = styled.div`
  flex: 10 calc(27% - 10px); // flex-grow, flex-shrink 및 flex-basis 값을 설정
  margin: 10px; // 카드 사이의 마진
  max-width: calc(26% - 20px); // 최대 너비 설정
  border: 1px solid #ddd; // 경계선 스타일 추가
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); // 박스 그림자 추가
  padding: 16px; // 내부 패딩
  background-color: #fff; // 배경색 설정
  border-radius: 10px; // 모서리 둥글게 처리
  transition: transform 0.3s ease-in-out; // 호버 효과를 위한 transition 추가

  &:hover {
    transform: translateY(-10px); // 호버 시 카드를 약간 위로 이동
  }

  h2, p {
    font-size: 16px; // 폰트 크기 조정
    margin: 5px 0; // 제목과 설명 사이의 간격
  }

  @media (max-width: 768px) {
    width: calc(30% - 20px); // 한 줄에 두 개의 카드가 표시되도록 조정
    margin: 10px; // 카드 사이의 마진 조정
  }
  @media (max-width: 480px) {
    width: calc(20% - 0px); // 한 줄에 세 개의 카드가 표시되도록 조정
    margin: 5px; // 카드 사이의 마진 조정
      h2, p {
    font-size: 10px; // 폰트 크기 조정
    margin: 5px 0; // 제목과 설명 사이의 간격
  }
  }
`;


const Image = styled.img`
  width: 100%; // 이미지 너비를 컨테이너에 맞춤
  height: auto; // 이미지 높이를 비율에 맞게 조정
  object-fit: cover; // 이미지를 컨테이너에 맞게 조절
  border-radius: 10px;
`;

const Info = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center; // 여기에 추가
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; // 컨테이너의 너비를 100%로 설정
  margin-bottom: 10px;
`;




/*const ContainerWithBorder = styled.div`
  border-top: 1px solid #ccc; // 맨 아래 구분선 추가
`;*/

function Recommend() {
  const navigate = useNavigate(); // Instantiate useNavigate
  const [stores, setStores] = useState([]); // 빈 배열로 초기화
  const { location } = useLocationContext();
  const [bookmarkedStores, setBookmarkedStores] = useState({});
  const [language, setLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");
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
  
  // 로컬 스토리지에서 'bookmarks' 키에 저장된 데이터를 조회

  useEffect(() => {
    const fetchNearbyRestaurants = async () => {
      // 근처 맛집 조회 로직
      if (location.latitude && location.longitude) {
        const config = {
          headers: {
            'Language': language,
            'La': location.latitude,
            'Lo': location.longitude,
          }
        };
        try {
          const response = await axios.get(`/api/v1/recomm`, config);
          // 데이터 중복 확인: 이미 로드된 데이터와 다른지 확인
          setStores(response.data);
      } catch (error) {
        console.error('근처 맛집 조회 오류', error);
      }
    }
  };
      fetchNearbyRestaurants();
  }, [location]);

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
  
  
  return (
    <div>
      <TitleContainer>
        <h1>Nearby Restaurants</h1>
      </TitleContainer>
      <Container>
        {stores.map((store) => (
          <Card key={store.id} onClick={() => navigate(`/information/${store.id}`)}>
            <ImageContainer>
              <Image src={store.photo} alt={store.name} />
              </ImageContainer>
            <Info>
              <h2>{store.name}</h2>
              <p>{store.category}</p>

            <FaStar
            size={30}
            color={bookmarkedStores[store.id] ? "yellow" : "gray"}
            onClick={(e) => {
              e.stopPropagation();
              handleBookmarkClick(store);
            }}
                />
  
            </Info>
          </Card>
        ))}
      </Container>
    </div>
  );
          }
export default Recommend;
