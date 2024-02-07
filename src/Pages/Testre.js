import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BookmarkContext } from "../BookmarkContext";
import { useLocationContext } from '../LocationProvider';
import axios from 'axios'; // axios 임포트 추가import { useLocationContext } from '../LocationProvider'; // useLocationContext 임포트

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

const ImageContainer = styled.div`
  width: 100%; // 컨테이너의 너비를 100%로 설정
  display: flex; // Flex 컨테이너 설정
  justify-content: center; // 가로축 중앙 정렬
  align-items: center; // 세로축 중앙 정렬
`;

const Card = styled.div`
  width: calc(30% - 10px);
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 10px;
  overflow: hidden;
  display: flex; // Flex 컨테이너 설정
  flex-direction: column; // 세로 방향 정렬
  align-items: center; // 가로축 중앙 정렬
  justify-content: center; // 세로축 중앙 정렬
`;

const Image = styled.img`
  width: 200px;   // 너비를 300픽셀로 고정
  height: 200px;  // 높이를 200픽셀로 고정
  border-radius: 10px;
  object-fit: cover; // 이미지가 컨테이너에 맞도록 조정
`;
const Info = styled.div`
  padding: 10px; // 내부 여백
  text-align: center; // 텍스트 중앙 정렬
`;

const StarIcon = styled.span`
  cursor: pointer;
  color: ${(props) => (props.isBookmarked ? "yellow" : "gray")};
  margin-left: 10px; // 이름과 별 아이콘 사이의 간격
`;
const initialStores = [
  {
    id: 1,
    name: "가게 1",
    type: "카페",
    info: "아늑한 분위기의",
    imageUrl: "https://example.com/cafe1.jpg",
  },
  {
    id: 2,
    name: "가게 2",
    type: "레스토랑",
    info: "이탈리안 레스토랑",
    imageUrl: "https://example.com/restaurant1.jpg",
  },
  {
    id: 3,
    name: "가게 3",
    type: "카페",
    info: "아늑한 분위기의 카페",
    imageUrl: "https://example.com/cafe1.jpg",
  },
  {
    id: 4,
    name: "가게 4",
    type: "레스토랑",
    info: "이탈리안 레스토랑",
    imageUrl: "https://example.com/restaurant1.jpg",
  },

  // ... 초기 데이터 더 추가 가능 ...
];

/*const ContainerWithBorder = styled.div`
  border-top: 1px solid #ccc; // 맨 아래 구분선 추가
`;*/

function Recommend() {
  const navigate = useNavigate(); // Instantiate useNavigate
  const { location } = useLocationContext();
 
  const [stores, setStores] = useState([]);
  const { bookmarks, addBookmark, removeBookmark } = useContext(BookmarkContext);

  const handleStoreClick = (storeId) => {
    navigate(`/information/${storeId}`, { replace: true });
  };

 useEffect(() => {
    const fetchNearbyRestaurants = async () => {
      if (location.latitude && location.longitude) {
        const headers = {
          'Language': 'en',
          'La': location.latitude,
          'Lo': location.longitude,
        };
        const config = { headers };

        try {
          const response = await axios.get(`http://52.78.132.87:8888/recomm`, config);
          setStores(response.data);
        } catch (error) {
          console.error('근처 맛집 조회 오류', error);
        }
      }
    };

    fetchNearbyRestaurants();
  }, [location]); // useEffect 의존성 배열에 location 추가


  const goBackToMain = () => {
    navigate("/"); // 메인 페이지로 이동
  };

  const goBack = () => {
    navigate(-1);
  };
  // 예시 데이터, 실제 데이터로 대체 필요

    return (
    <div>
      <TitleContainer>
        <h1>Nearby restaurants pages</h1>
        {/* 위치 정보 표시 */}
      </TitleContainer>
      <Container>
        {stores.map((store) => (
          <Card key={store.id} onClick={() => handleStoreClick(store.id)}>
            <ImageContainer>
                    <Image src={store.photo} alt={store.name} />
                    </ImageContainer>
            <Info>
              <h2>{store.name}</h2>
              <p>{store.category}</p>
            </Info>
          </Card>
        ))}
      </Container>
    </div>
  );
}

export default Recommend;