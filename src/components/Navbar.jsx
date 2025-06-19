import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { use } from 'react';

const Navbar = () => {
const [counter, setCounter] =useState(0);

useEffect(() => {
    console.log(counter)
}, [counter]); // Empty dependency array to run only once on mount


  return (
    <>
    <div className='h-16 bg-amber-300 flex items-center justify-between px-10'>
        <div>Logo</div>
        <div>
        <li className='flex gap-10 list-none'>
            <Link to="/" className="text-gray-800 hover:text-blue-600">Home</Link>
            <Link to="/" className="text-gray-800 hover:text-blue-600">Contacts</Link>
            <Link to="/" className="text-gray-800 hover:text-blue-600">My posts</Link>
            
        </li>
        </div>
    </div>

<div className='mx-auto mt-10 w-1/2'>

    <button className='bg-amber-100 mx-auto' onClick={() =>{setCounter(counter+1)}} >{counter}</button>
</div>
    </>
  )
}

export default Navbar