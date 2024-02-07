// src/context/BookmarkContext.js
import React, { createContext, useState } from "react";

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);

  const addBookmark = (store) => {
    setBookmarks((prevBookmarks) => {
      // 이미 즐겨찾기에 추가된 항목이면 추가하지 않음
      if (prevBookmarks.some((bookmark) => bookmark.id === store.id)) {
        return prevBookmarks;
      }
      return [...prevBookmarks, store];
    });
  };
  const toggleBookmark = (store) => {
    setBookmarks((prevBookmarks) => {
      if (prevBookmarks.some((bookmark) => bookmark.id === store.id)) {
        // 즐겨찾기에서 제거
        return prevBookmarks.filter((bookmark) => bookmark.id !== store.id);
      } else {
        // 즐겨찾기에 추가
        return [...prevBookmarks, store];
      }
    });
  };
  const removeBookmark = (store) => {
    setBookmarks((prevBookmarks) =>
      prevBookmarks.filter((bookmark) => bookmark.id !== store.id)
    );
  };
  return (
    <BookmarkContext.Provider
      value={{ bookmarks, addBookmark, removeBookmark, toggleBookmark }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
