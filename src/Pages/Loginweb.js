import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Loginweb() {
  const navigate = useNavigate();

  useEffect(() => {
    const waitForHashChange = () => {
      const hash = window.location.hash;
      const idTokenKey = 'id_token=';
      const expiresKey = '&expires_in=';

      const startIndex = hash.indexOf(idTokenKey);
      const expiresIndex = hash.indexOf(expiresKey);

      if (startIndex !== -1 && expiresIndex !== -1) {
        const idTokenStart = startIndex + idTokenKey.length;
        const idTokenEnd = expiresIndex;
        const idToken = hash.substring(idTokenStart, idTokenEnd);

        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem('id_token', idToken);
        navigate('/main');
      } else {
        // 해시 값이 없으면 대기하고 다시 확인
        setTimeout(waitForHashChange, 100); // 100 밀리초마다 다시 확인
      }
    };

    // 페이지 로드 시 처음 한 번 대기
    waitForHashChange();
  }, [navigate]);
}

export default Loginweb;
