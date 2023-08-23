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
const AddBook = () => {
  const [t, i18n] = useTranslation("global");
  const contextDatas = useContext(context);
  const navigate = useNavigate()
  const [addLoad, setAddLoad] = useState(false)
  const userDatas = contextDatas.userDatas;
  const currentLang = contextDatas.currentLang;
const [imgLoad, setImgLoad] = useState(false)
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
  const titleRef = useRef();
  const pagesRef = useRef();
  const priceRef = useRef();
  const authorIdRef = useRef();
  const categoryIdRef = useRef();
  const engInfoRef = useRef();
  const ruInfoRef = useRef();
  const uzInfoRef = useRef();
  const [bookImg, setBookImg] = useState('')


  
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
        setBookImg(data.url);
        toast.success();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setImgLoad(false);
      }
    }
  };



  const addBookHandler = async()=>{
    if(!titleRef.current.value.trim().length){
      return toast.error(t('titleRequired'),  {position : 'bottom-left'})
    }else if(!priceRef.current.value.trim().length){
      return toast.error(t('priceRequired'),  {position : 'bottom-left'})
    }else if(!pagesRef.current.value.trim().length){
      return toast.error(t('pageRequired'),  {position : 'bottom-left'})
    }else if(!authorIdRef.current.value.trim().length){
      return toast.error(t('countryRequired'), {position : 'bottom-left'})
    }else if(!categoryIdRef.current.value.trim().length){
      return toast.error(t('authorRequired'), {position : 'bottom-left'})
    }else if(!bookImg.trim().length){
      return toast.error(t('imgRequired'),  {position : 'bottom-left'})
    }else if(!uzInfoRef.current.value.trim().length){
      return toast.error(t('uzInfoRequired'),  {position : 'bottom-left'})
    }else if(!ruInfoRef.current.value.trim().length){
      return toast.error(t('ruInfoRequired'),  {position : 'bottom-left'})
    }else if(!engInfoRef.current.value.trim().length){
     return toast.error(t('enInfoRequired'),  {position : 'bottom-left'})
    }
    try {
      setAddLoad(true)
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/books`, {
       title : titleRef.current.value.trim(),
       full_info : [
        {
          lang : 'ru',
          text : ruInfoRef.current.value.trim()
        },
        {
          lang : 'uz',
          text : uzInfoRef.current.value.trim() 
        },{
          lang : 'en',
          text : engInfoRef.current.value.trim()
        }
      ],
      pages : pagesRef.current.value.trim(),
      price : priceRef.current.value.trim(),
      img_link : bookImg.trim(),
      author : authorIdRef.current.value.trim(),
      category : categoryIdRef.current.value.trim()
      }, {headers : {token : userDatas?.token}})
      if(data.success){
        toast.success(data.message[currentLang],  {position : "bottom-left"})
        navigate('/books')
      }else{
        toast.error(data.message[currentLang],  {position : 'bottom-left'})
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setAddLoad(false)
    }
  }

  useEffect(() => {
    getAuthors();
    getCategories();
  }, []);

  return (
    <div className="author-page py-3  pb-5 px-4">
      <div className="left ps-5">
        <label className="custom-upload">
          <span className="file-name cursor-pointer border text-center">
          {imgLoad ? <SpinnerLoader/> : bookImg.trim().length ? <img src={bookImg} className="book_img"/> :  <i className="fas fa-plus fs-1"></i>}
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
      <div className="right flex flex-column gap-4" >
        <h1 className="heading">{t("addBook")}</h1>
        <div className="inputs flex flex-column gap-3 ">
          <input type="text" placeholder={t("title")} ref={titleRef}/>
          <input type="number" placeholder={t("pages")}  min={0} ref={pagesRef}/>
          <input type="number" placeholder={t("price")} min={0} ref={priceRef}/>
          <select className="form-control author_select" ref={authorIdRef}>
            {authors?.map((el, idx) => (
              <option value={el?._id}>
                {el?.firstname} {el?.lastname}
              </option>
            ))}
          </select>
          <select className="form-control category_select" ref={categoryIdRef}>
            {categories?.map((el, idx) => (
              <option value={el?._id}>{el?.category}</option>
            ))}
          </select>
          <input type="text" ref={uzInfoRef} placeholder="Kitob haqida o'zbekcha malumot kiriting"/>
          <input type="text" ref={ruInfoRef}  placeholder="Введите информацию о книге на русском языке"/>
          <input type="text" ref={engInfoRef}  placeholder="Enter information about the book in English"/>

      
        </div>
          <button onClick={()=>addBookHandler()} className="add_book_btn ">{addLoad ? <div className="lds-dual-ring"></div> : t('create')}</button>
      </div>
    </div>
  );
};

export default AddBook;
