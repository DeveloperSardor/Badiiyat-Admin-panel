import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import context from "./context";
import Layout from "./pages/layout";
import Home from "./pages/home";
import { Toaster, toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Books from "./pages/books";
import AuthorById from "./pages/authorById";
import Profile from "./pages/profile";
import BookById from "./pages/bookById";
import Login from "./pages/login";
import axios from "axios";
import AddBook from "./pages/add-book";
import AddAuthor from "./pages/add-author";
import UsersView from "./pages/users-view";
import NotFoundAnimation from './pages/not-found'

function App() {
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("global");
  const [userDatas, setUserDatas] = useState(null);
  const currentLang = JSON.parse(localStorage.getItem("currentLang")) || "uz";
  const [currentMode, setCurrentMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  const getAdminData = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/admin`
      );
      setUserDatas({
        ...data.data,
        token: JSON.parse(sessionStorage.getItem("userDatas"))?.token,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAdminData();
    const datas = sessionStorage.getItem("userDatas");
    if (datas) {
      return;
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <context.Provider
      value={{ userDatas, currentLang, currentMode, setCurrentMode }}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" index element={<Home />} />
          <Route path="/authors/:id" element={<AuthorById />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookById />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/add-author" element={<AddAuthor />} />
          <Route path="/view-users" element={<UsersView />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFoundAnimation/>} />
      </Routes>
      <Toaster />
    </context.Provider>
  );
}

export default App;
