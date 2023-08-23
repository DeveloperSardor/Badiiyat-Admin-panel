import React, {useState, useEffect} from 'react'
import { toast } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Toaster } from 'react-hot-toast'
import './style.scss'
import PrimarySection from '../../components/primary-section'
import SpinnerLoader from '../../components/loader'
import axios from 'axios'
import CategoryButton from '../../components/category-button'
import AuthorCard from '../../components/author-card'

import './style.scss'
const Home = () => {
    const [t, i18n] = useTranslation('global')
    const userDatas = JSON.parse(localStorage.getItem('userDatas')) || null;
    const currentLang =JSON.parse(localStorage.getItem('currentLang')) || "uz";
  const [currentMode, setCurrentMode] = useState(localStorage.getItem('theme') || "light")
  const [activeCat, setActiveCat] = useState(0);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loadAuthor, setLoadAuthor] = useState(false);
  const [loadCat, setLoadCat] = useState(false);
  const [searchState, setSearchState] = useState("");

  async function getCategories() {
    try {
      setLoadCat(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/categories`
      );
      setCategories(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadCat(true);
    }
  }

  async function getAuthors(catId) {
    try {
      setLoadAuthor(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/authors?category=${catId}`
      );
      setAuthors(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadAuthor(false);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const catId = categories[activeCat]?._id;
    getAuthors(catId);
  }, [categories, activeCat]);
  return (
    <div className="home-page page">
       <PrimarySection
        option={"authors"}
        catId={categories[activeCat]?._id}
        searchState={searchState}
        setSearchState={setSearchState}
        setAuthors={setAuthors}
        reloadAuthors={getAuthors}
      />
    <section className="py-3 mainCSec">
        <h1 className="text-center main_title">{t("mainCategories")}</h1>
        <div className="btn-group w-75 mx-auto  flex justify-around mt-3 flex-wrap">
          {!categories?.length && loadCat ? <SpinnerLoader /> : ""}
          {categories?.map((el, idx) => (
            <CategoryButton
              category={el}
              setActive={setActiveCat}
              activeCat={activeCat}
              idx={idx}
              key={idx}
            />
          ))}
        </div>

        {loadAuthor && <SpinnerLoader />}
        {!loadAuthor && (
          <div className="authors_wrp flex items-center justify-around flex-wrap ">
            {authors?.map((el, idx) => (
              <AuthorCard reloadFunc={getAuthors} catId={categories[activeCat]?._id} author={el} key={idx} />
              ))}
          </div>
        )}

        {!authors?.length && (
          <h1 className="text-center notFoundText">{t("notFoundAuthors")}🤔</h1>
        )}
      </section>
    </div>
  )
}

export default Home
