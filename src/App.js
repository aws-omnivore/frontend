// App.js

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react"; // useState와 useEffect를 임포트
import "./styles.css";
import Main from "./Pages/Main";
import Bookmark from "./Pages/Bookmark"; // Bookmark 페이지 임포트
import Record from "./Pages/Record";
import Recommend from "./Pages/Recommend";
import Information from "./Pages/Information";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Admin from "./Pages/Admin";
import { BookmarkProvider } from "./BookmarkContext";
import EditStore from "./Pages/EditStore";
import RegisteredStores from "./Pages/RegistedStore";
import Loginweb from "./Pages/Loginweb";
import Test from "./Pages/Test";
import { LocationProvider } from './LocationProvider';
import { LanguageProvider } from './LanguageProvider'; // 경로에 맞게 수정
import TokenTest from "./Pages/TokenTest";
import Testre from "./Pages/Testre";
import Result from "./Pages/Result";

function App() {
  return (
    <LanguageProvider>
      <LocationProvider>
    <BookmarkProvider>
      <Router>
        <Routes>
          <Route path="/main" element={<Main />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/edit-store" element={<EditStore />} />
          <Route path="/registered-stores" element={<RegisteredStores />} />
          <Route path="/bookmark" element={<Bookmark />} />{" "}
          {/* 북마크 페이지 라우트 추가 */}
          <Route path="/record" element={<Record />} />{" "}
          {/* 북마크 페이지 라우트 추가 */}
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/loginweb" element={<Loginweb />} />{" "}
              {/* 새로운 페이지 라우트 추가 */}
          <Route path="/test" element={<Test />} /> // '/test' 경로에 대한 라우트 추가
              {/* 새로운 페이지 라우트 추가 */}
          <Route path="/information/:storeId" element={<Information />} />{" "}
          <Route path="/test" element={<Test />} /> // '/test' 경로에 대한 라우트 추가
          <Route path="/token" element={<TokenTest />} /> // '/token-test' 경로에 대한 라우트 추가
          <Route path="/re" element={<Testre />} /> // '/token-test' 경로에 대한 라우트 추가
          <Route path="/result" element={<Result />} />
        </Routes>
      </Router>
        </BookmarkProvider>
        </LocationProvider>
      </LanguageProvider>
  );
}

export default App;
