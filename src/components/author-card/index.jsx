import React, { useContext } from 'react'
import './style.scss'
import context from '../../context'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import NaqshImg from '../../assets/images/naqsh.png'
import axios from 'axios'

const AuthorCard = ({author, catId, reloadFunc}) => {
    const [t, i18n] = useTranslation('global')
    const contextDatas = useContext(context);
    const userDatas = contextDatas.userDatas;
    const currentLang = contextDatas.currentLang;
    const navigate = useNavigate()


    const changeLink = ()=>{
        if(userDatas){
         navigate(`authors/${author._id}`)
        }else{
            toast.error(t('youMustRegister'))
        }
    }

    const deleteAuthor=async()=>{
      try {
        const {data} = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/authors/${author?._id}`, {
          headers : {token : userDatas?.token}
        })
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


    const formatDate = (dateString) => {
        const dateParts = dateString.split('T')[0].split('-');
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        
        const formattedDate = `${day}.${month}.${year}`;
        return year;
      };
      
  return (
    <div className='author-card mt-3 cursor-pointer' > 
      <img alt='author image' onClick={changeLink} className='author_img' src={author?.img_link}/>
      <div className='body py-2 ps-4'>
      <h3 className='author_name'>{author.firstname} {author.lastname}</h3>
      <p className='author_date '>{formatDate(author?.date_of_birth)} - {formatDate(author?.date_of_death)}</p>
      </div>
      
      <div className='btm pe-3'>
        <button onClick={()=>deleteAuthor()} className='btn float-end btn-danger'><i class="fa-sharp fa-solid fa-trash"></i></button>
      </div>
    </div>
  )
}

export default AuthorCard
