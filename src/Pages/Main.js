import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { useLocationContext } from "../LocationProvider"; // useLocationContext 임포트 확인



const ActionModal = styled.div`
  // 모달의 스타일 정의
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  margin: 0;
  overflow: hidden;
`;

const LanguageDropdown = styled.select`
  width: 60%;
  padding: 10px;
  margin-top: 20px;
  font-size: 16px;
`;

const MainButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto; /* 중앙 정렬을 위한 자동 마진 */
  flex-grow: 1; /* 컨테이너가 사용 가능한 공간을 채우도록 설정 */
`;

const MainButton = styled.button`
  padding: 30px 50px;
  font-size: 18px;
  border: 2px solid black;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: darkgray;
  }
  &:active {
    transform: scale(0.98);
  }
  margin-top: -100px;
`;

const LoginLink = styled.a`
  cursor: pointer;
  color: blue;
  text-decoration: underline;
  margin-top: 10px; /* 간격 조정 */
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 20px;
  position: absolute;
  bottom: 0;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const RoundButton = styled.button`
  border-radius: 50%;
  width: 80px;
  height: 80px;
  &:hover {
    background-color: darkgray;
  &:active {
    transform: scale(0.90);
  }
`;

const ButtonDescription = styled.div`
  margin-top: 5px;
`;

function Main() {
  const navigate = useNavigate();
  const { location } = useLocationContext();
  const fileInputRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem('id_token');
  const [language, setSelectedLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");

  const [showActionModal, setShowActionModal] = useState(false);
   useEffect(() => {
    // 모달 바깥 클릭 감지 함수
    const handleClickOutside = (event) => {
      if (showActionModal && !event.target.closest(".action-modal")) {
        setShowActionModal(false);
      }
     };
     

    // 문서에 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);
    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem("id_token");
    setIsLoggedIn(token); // 토큰이 있으면 로그인 상태로 설정

    // 클린업 함수: 모달이 닫힐 때 이벤트 리스너 제거 및 로그인 상태 체크 종료
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
   }, [showActionModal]); // showActionModal이 변경될 때마다 효과 실행
  
  const handleActionChoice = (action) => {
    setShowActionModal(false);
    if (action === "camera") {
      openCamera();
    } else if (action === "gallery") {
      // 'Upload' 버튼을 클릭하면 숨겨진 input 태그를 클릭하도록 합니다.
     fileInputRef.current.click();
    }
  };


  
    const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      await uploadImage(file); // 선택된 이미지를 서버로 업로드
    }
  };
   // 이미지 업로드 함수
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file); // 서버가 요구하는 필드명으로 파일 추가

  try {
    const response = await axios.post('https://api.sketch-food.com:443/api/v1/extract', formData, {
      headers: {
        // 'Content-Type': 'multipart/form-data'는 Axios가 자동으로 설정합니다.
        'Authorization': `Bearer ${token}`, // 'Bearer' 스키마를 사용해야 할 경우
        'Language': language, // 예시로 'en'을 사용했습니다. 필요에 따라 변경하세요.
        'La': location.latitude.toString(), // latitude 값을 문자열로 변환
        'Lo': location.longitude.toString(), // longitude 값을 문자열로 변환
      },
    });
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    // Axios는 자동으로 응답을 JSON으로 파싱합니다.
    console.log(response.data); // 결과 처리, 예: 결과 페이지로 이동
    navigate('/result', { state: { data: response.data } });
  } catch (error) {
    console.error('Error uploading image:', error);
    // 오류 처리 로직
  }
};

  // 파일 입력 요소 참조를 사용하여 파일 선택 이벤트 처리
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 카메라 접근 함수
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.display = "block";
      }
    } catch (error) {
      console.error("카메라 접근 오류:", error);
    }
  };

    const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      // 여기에서 canvas의 이미지를 사용할 수 있습니다 (예: 저장 또는 업로드)
    }
  };

  const handleCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // 모바일 디바이스의 카메라를 사용
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await uploadImage(file); // 선택된 사진을 서버로 업로드
      }
    };
    input.click();
  };

  const navigateToBookmark = () => {
    navigate("/bookmark");
  };

  const navigateToRecord = () => {
    navigate("/record"); // "/record" 경로로 이동
  };

  const navigateToRecommend = () => {
    navigate("/recommend"); // "/recommend" 경로로 이동
  };
  const handleClickOutside = (event) => {
    if (showActionModal && !event.target.closest(".action-modal")) {
      setShowActionModal(false);
    }
  };

    const handleLogout = () => {
    localStorage.removeItem("authToken"); // 로컬 스토리지의 토큰 삭제
    setIsLoggedIn(false); // 로그인 상태 업데이트
    alert("Logout Successful"); // 로그아웃 성공 메시지 표시
    navigate("/"); // 홈페이지로 리디렉션
  };


  useEffect(() => {
    // 로컬 스토리지에서 'selectedLanguage' 값 로드
    const savedLanguage = localStorage.getItem("selectedLanguage") || 'en';
    setSelectedLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage); // 상태 업데이트
    localStorage.setItem("selectedLanguage", newLanguage); // 로컬 스토리지에 저장
    console.log("Selected language saved:", newLanguage); // 콘솔에 저장된 언어 확인
  };


  return (
    <Container>
      <LanguageDropdown onChange={handleLanguageChange}>
        <option value="en">English</option>
        <option value="ko">한국어</option>
        <option value="ja">日本語</option>
      </LanguageDropdown>

      <MainButtonContainer>
        <MainButton onClick={navigateToRecommend}>
Nearby restaurants</MainButton>
        <LoginLink onClick={handleLogout}>Logout</LoginLink>
      </MainButtonContainer>

      <ButtonGroup>
        <ButtonContainer>
          <RoundButton onClick={() => setShowActionModal(true)}>1</RoundButton>
          <ButtonDescription>shot, upload</ButtonDescription>
      {showActionModal && (
        <ActionModal className="action-modal">
          <button onClick={() => handleActionChoice("gallery")}>Upload</button>
          <video ref={videoRef} autoPlay className="modal-video" style={{ display: "none" }}></video>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </ActionModal>
          )}
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
          />
        </ButtonContainer>
        <ButtonContainer>
          <RoundButton onClick={navigateToBookmark}>2</RoundButton>{" "}
          {/* 버튼 2에 이벤트 핸들러 추가 */}
          <ButtonDescription>Bookmark</ButtonDescription>
        </ButtonContainer>
        <ButtonContainer>
          <RoundButton onClick={navigateToRecord}>3</RoundButton>{" "}
          {/* 버튼 3을 클릭하면 Record 페이지로 이동 */}
          <ButtonDescription>Records</ButtonDescription>
        </ButtonContainer>
      </ButtonGroup>
    </Container>
  );
}

export default Main;
