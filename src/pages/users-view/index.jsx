import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import context from '../../context'
import SpinnerLoader from '../../components/loader'
import UserBox from '../../components/user-box'
import './style.scss'

const UsersView = () => {
    const [t, i18n] = useTranslation('global')

    const contextDatas = useContext(context);
    const userDatas = contextDatas?.userDatas;
    const [users, setUsers] = useState([])
    const [load, setLoad] = useState(false)

    const getUsers = async()=>{
        try {
            setLoad(true)
            const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/view-users`, {headers : {token : userDatas?.token}})
                setUsers(data.data)
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoad(false)
        }
    }





  useEffect(()=>{
    getUsers()
  }, [])

  return (
    <div className='user-view py-5'>
      <div className='top-header position-fixed top-0 flex items-center justify-between'>
        <h3 className='fs-5'>{t('users')}</h3>
        <p>{t('usersCount')} : {users?.length}</p>
      </div>
        {load && <SpinnerLoader/>}
        {!load && (
      <div className='users-wrp  w-75 mt-5 mx-auto flex flex-column gap-3'>
         {users?.map((el, idx)=>(
            <UserBox key={idx} user={el}/>
        ))}
      </div>
        )}

        {!users?.length && (
            <h1 className="text-center notFoundText">{t('notFoundUsers')}</h1>
        )}
    </div>
  )
}

export default UsersView
