import React, { useEffect } from 'react';
import '../Info/Info.css'
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';

const Info = ({message, type, duration = 3000, onClose}) => {

useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);


  return (
    <div className={`${type} info`}>
      {type === "infoOk" ? (<IoMdCheckmark className='infoIcon'/>) : (<IoMdClose className='infoIcon'/>)}
        <p>{message}</p>
    </div>
  )
}

export default Info