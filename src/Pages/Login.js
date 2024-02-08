import React, { useEffect } from 'react';
import { useLocationContext } from '../LocationProvider';

function Login() {
    const { location, setLocation } = useLocationContext(); // useLocationContext 사용

    useEffect(() => {
        if (location.latitude === null || location.longitude === null) {
            // 위치 정보가 없으면 GPS를 통해 위치 정보를 가져옵니다.
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => console.log(error)
            );
        }
    }, [location, setLocation]);

  const userLoginUrl = "https://fs.auth.ap-northeast-2.amazoncognito.com/login?client_id=4ldn0nqfcc1blmob79lepjc3mq&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fwww.sketch-food.com%2Floginweb";
  const adminLoginUrl = "https://fs.auth.ap-northeast-2.amazoncognito.com/login?client_id=4ldn0nqfcc1blmob79lepjc3mq&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Floginweb";
 
   const redirectToLogin = (url) => {
    window.location.href = `${url}&redirect_uri=/loginweb`; // 리다이렉션 URL 수정
  }


  
  const buttonStyle = {
    padding: '20px 30px',
    fontSize: '30px',
    margin: '10px',
    cursor: 'pointer',
    width: '250px',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={() => redirectToLogin(userLoginUrl)}>
        User Login
      </button>
      <button style={buttonStyle} onClick={() => redirectToLogin(adminLoginUrl)}>
        Admin Login
      </button>
    </div>
  );
}

export default Login;