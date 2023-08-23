import React, { useContext, useEffect, useRef, useState } from "react";
import context from "../../context";
import "./style.scss";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import EnglishFlag from "../../assets/images/en-flag.jpg";
import RussianFlag from "../../assets/images/ru-flag.webp";
import UzbFlag from "../../assets/images/uz-flag.webp";
import axios from "axios";
import SpinnerLoader from "../../components/loader";
import { useNavigate } from "react-router-dom";
const AddAuthor = () => {
  const [t, i18n] = useTranslation("global");
  const contextDatas = useContext(context);
  const navigate = useNavigate();
  const [addLoad, setAddLoad] = useState(false);
  const userDatas = contextDatas.userDatas;
  const currentLang = contextDatas.currentLang;
  const [imgLoad, setImgLoad] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const langs = [
    {
      text: "O'zbekcha",
      lang: "uz",
      img: UzbFlag,
    },
    {
      text: "Русский",
      lang: "ru",
      img: RussianFlag,
    },
    {
      text: "English",
      lang: "en",
      img: EnglishFlag,
    },
  ];

  const [activeLang, setActiveLang] = useState(0);

  const getAuthors = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/authors`
      );
      setAuthors(data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/categories`
      );
      setCategories(data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Refs

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const dateOfBirthRef = useRef();
  const dateOfDeathRef = useRef();
  const countryRef = useRef();
  const bioRef = useRef();
  const categoryRef = useRef();
  const [authorImg, setAuthorImg] = useState("");
  const engBioRef = useRef();
  const ruBioRef = useRef();
  const uzBioRef = useRef();

  const uploadAva = async (pics) => {
    let type = pics.type.substring(pics.type.length - 3);
    if (pics && pics.type.split("/")[0] != "image") {
      return toast.error(t("invalidFile"));
    }
    if (pics && (type == "png" || "jpg" || "svg")) {
      try {
        setImgLoad(true);
        const formDatas = new FormData();
        formDatas.append("file", pics);
        formDatas.append("upload_preset", "chat-app");
        const { data } = await axios.post(
          `https://api.cloudinary.com/v1_1/roadsidecoder/image/upload`,
          formDatas
        );
        setAuthorImg(data.url);
        toast.success();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setImgLoad(false);
      }
    }
  };

  const addBookHandler = async () => {
    if (!firstnameRef.current.value.trim().length) {
      return toast.error(t("requiredFirstname"), { position: "bottom-left" });
    } else if (!lastnameRef.current.value.trim().length) {
      return toast.error(t("requiredLastname"), { position: "bottom-left" });
    } else if (!dateOfBirthRef.current.value.trim().length) {
      return toast.error(t("dateOfBirthRequired"), { position: "bottom-left" });
    } else if (!countryRef.current.value.trim().length) {
      return toast.error(t("countryRequired"), { position: "bottom-left" });
    } else if (!categoryRef.current.value.trim().length) {
      return toast.error(t("categoryRequired"), { position: "bottom-left" });
    } else if (!authorImg.trim().length) {
      return toast.error(t("imgRequired"), { position: "bottom-left" });
    } else if (!uzBioRef.current.value.trim().length) {
      return toast.error(t("uzInfoRequired"), { position: "bottom-left" });
    } else if (!ruBioRef.current.value.trim().length) {
      return toast.error(t("ruInfoRequired"), { position: "bottom-left" });
    } else if (!engBioRef.current.value.trim().length) {
      return toast.error(t("enInfoRequired"), { position: "bottom-left" });
    }
    try {
      setAddLoad(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/authors`,
        {
          firstname: firstnameRef.current.value.trim(),
          lastname: lastnameRef.current.value.trim(),
          date_of_birth: dateOfBirthRef.current.value.trim(),
          date_of_death: dateOfDeathRef.current.value.trim(),
          country: countryRef.current.value.trim(),
          category: categoryRef.current.value.trim(),
          img_link: authorImg.trim(),
          bio: [
            {
              lang: "ru",
              text: ruBioRef.current.value.trim(),
            },
            {
              lang: "uz",
              text: uzBioRef.current.value.trim(),
            },
            {
              lang: "en",
              text: engBioRef.current.value.trim(),
            },
          ],
        },
        { headers: { token: userDatas?.token } }
      );
      if (data.success) {
        toast.success(data.message[currentLang], { position: "bottom-left" });
        navigate("/");
      } else {
        toast.error(data.message[currentLang], { position: "bottom-left" });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAddLoad(false);
    }
  };

  useEffect(() => {
    getAuthors();
    getCategories();
  }, []);

  return (
    <div className="author-page py-3  pb-5 px-4">
      <div className="left ps-5">
        <label className="custom-upload">
          <span className="file-name cursor-pointer border text-center">
            {imgLoad ? (
              <SpinnerLoader />
            ) : authorImg.trim().length ? (
              <img src={authorImg} className="book_img" />
            ) : (
              <i className="fas fa-plus fs-1"></i>
            )}
          </span>
          <input
            className="d-none"
            type="file"
            accept="image/*"
            onChange={(e) => uploadAva(e.target.files[0])}
          />
          <b className="ms-2"></b>
        </label>
      </div>
      <div className="right flex flex-column gap-4">
        <h1 className="heading">{t("addAuthor")}</h1>
        <div className="inputs flex flex-column gap-3 ">
          <input type="text" placeholder={t("firstname")} ref={firstnameRef} />
          <input type="text" placeholder={t("lastname")} ref={lastnameRef} />
          <label className="flex flex-column gap-2">
            {t("dateOfBirth")}
            <input
              type="date"
              placeholder={t("dateOfBirth")}
              ref={dateOfBirthRef}
            />
          </label>
          <label className="flex flex-column gap-2">
            {t("dateOfDeath")}
            <input
              type="date"
              placeholder={t("dateOfDeath")}
              ref={dateOfDeathRef}
            />
          </label>
          <input type="text" placeholder={t("country")} ref={countryRef} />
          <select className="form-control category_select" ref={categoryRef}>
            {categories?.map((el, idx) => (
              <option value={el?._id}>{el?.category}</option>
            ))}
          </select>
          <input
            type="text"
            ref={uzBioRef}
            placeholder="Muallif haqida o'zbekcha malumot kiriting"
          />
          <input
            type="text"
            ref={ruBioRef}
            placeholder="Введите информацию об авторе на русском языке"
          />
          <input
            type="text"
            ref={engBioRef}
            placeholder="Enter information about the author in English"
          />
        </div>
        <button onClick={() => addBookHandler()} className="add_book_btn ">
          {addLoad ? <div className="lds-dual-ring"></div> : t("create")}
        </button>
      </div>
    </div>
  );
};

export default AddAuthor;
