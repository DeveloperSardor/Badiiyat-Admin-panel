import React, { useContext } from 'react'
import context from '../../context'
import './style.scss'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const BookCard = ({book,catId, isDelete, author, reloadFunc}) => {
    const [t, i18n] = useTranslation("global");
    const contextDatas = useContext(context);
    const currentMode = contextDatas.currentMode;
    const currentLang = contextDatas.currentLang;
    const userDatas = contextDatas.userDatas;
    console.log(userDatas);
    const navigate = useNavigate()


    async function deleteBook(id){
      try {
        const {data} = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/books/${id}`, {headers : {token : userDatas?.token}})
        if(data.success){
           toast.success(data.message[currentLang])
           reloadFunc(catId)
        }else{
          toast.error(data.message[currentLang])
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

 async function changeLink(id){
    if(userDatas){
      navigate(`/books/${id}`)
    }else{
    toast.error(t('youMustRegister'))
    }
 }

  return (
    <div className='book-card flex flex-column gap-3 cursor-pointer' >
      <img alt={book?.title} title={book?.title} className='book_img' src={book?.img_link} onClick={()=>changeLink(book?._id)}/>
      <div className='body flex flex-column gap-1'>
      <h3 className={`title_book ${currentMode == 'dark' ? "text-light" : ""}`}>{book?.title}</h3>
      <div className='flex justify-between '>
      <p className={`author_name ${currentMode == 'dark' ? "text-light" : ""}`}>{book.author?.firstname || author?.mainData.firstname} {book.author?.lastname || author?.mainData?.lastname}</p>
       {isDelete && <button onClick={()=>deleteBook(book?._id)} className='btn float-end btn-danger'><i class="fa-sharp fa-solid fa-trash"></i></button>} 
      </div>
      </div>
    </div>
  )
}

export default BookCard
