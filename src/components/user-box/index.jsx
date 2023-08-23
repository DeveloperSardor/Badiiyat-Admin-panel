import React from 'react'
import './style.scss'

const UserBox = ({user}) => {
    const formatDate = (dateString) => {
        const dateParts = dateString.split('T')[0].split('-');
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        
        const formattedDate = `${day}.${month}.${year}`;
        return formattedDate;
      };
    console.log(user);
  return (
    <div className='user-box bg-light text-dark p-3 rounded-3 flex items-center justify-between'>
      <p>{user?.firstname} {user?.lastname}</p>
      <p>{user?.email}</p>
      <em>{formatDate(user?.createdAt)}</em>
    </div>
  )
}

export default UserBox
