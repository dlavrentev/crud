import React,{useState, useContext, useRef} from 'react'
import axios from 'axios';
import {Link} from "react-router-dom"
import './header.css'
import { UserContext } from '../../context/UserContext';


export default function Header({baseUrl}) {
  const [signupSuccess,setSignupSuccess]=useState(false)
  const [loggedIn,setLoggedIn]=useState(false)
  const [errorlog,setErrorlog]=useState('')
  const [modal,setModal]=useState(false)
  const [userExists,setUserExists]=useState(true)
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [imageUrl,setImageUrl]=useState('')
  const [message,setMessage]=useState('')
  
  const colorRef = useRef();
  

  const {user,setUser}=useContext(UserContext)
  
  
  
  const handleSignup=(e)=>{
    e.preventDefault()
    axios.post(`${baseUrl}/users/register`,{
      username,password,imageUrl
    })
    .then(res=>{
      setSignupSuccess(true)
      console.log(res.data)
    })
    .catch(err=>console.log(err))

  }
 


  const handleLogin=(e)=>{ 
    e.preventDefault()
    axios.post(`${baseUrl}/users/login`,{
      username,password
    })
    .then(res=>{
      setUser(res.data)
      setLoggedIn(true)
      setModal(false)
      colorRef.current.style.backgroundColor = 'salmon';
    })
    .catch(err=>{
      setErrorlog(true)
    })

  }

  const handleLogout=()=>{
    setUser({})
    setLoggedIn(false)
  }


  return (
    <div className='header-container'>
      <h1><Link to="/">Travel Diaries</Link></h1>
        {
         loggedIn ?
         <div className='profile-container-loggedin'>
           <div className='add-destination-container'>
           <button><Link to="/add-destination">Add a new destination</Link></button>
           <p>{user.username}</p>
           </div>
           
           <div className='img-container'>
            <img src={user.imageUrl} alt="avatar"/>
           </div>  
           <button className='logout-btn' onClick={handleLogout}>Logout</button>
         </div>
         
         : <div className='profile-container-loggedout'>
             {
              modal ? <button className='login-btn' style={{backgroundColor: "salmon"}} onClick={() => { setModal(!modal); setErrorlog(false);}}>Login</button>
              : <button className='login-btn' style={{backgroundColor: "green"}}  onClick={() => { setModal(!modal); setErrorlog(false);}}>Login</button>
             }
           </div>
        }
     

      
      {
        modal ? <div className='header-modal'>
                   <h3 onClick={()=>{setModal(false)}}>X</h3>
           {
              userExists ? <div> 
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                  <input type="text" placeholder="Enter username" onChange={(e)=>setUsername(e.target.value)}/>
                  <input type="password" placeholder="Enter password" onChange={(e)=>setPassword(e.target.value)}/>
                  <button className='login-btn' type="submit" onChange={(e)=>setImageUrl(e.target.value)}>Submit</button>
                </form>
                {errorlog ? <p style={{"color":"#FFE66D"}}>Wrong password or username..</p> : null }
                <p>Don't have an account? <span onClick={()=>{setUserExists(false)}}>Sign up</span></p>
                {message !== '' ? <p>{message}</p> : null}

              </div>
              : <div> 
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
                  <input type="text" placeholder="Enter username" onChange={(e)=>setUsername(e.target.value)}/>
                  <input type="password" placeholder="Enter password" onChange={(e)=>setPassword(e.target.value)}/>
                  <input type="text" placeholder="Enter image url" onChange={(e)=>setImageUrl(e.target.value)}/>
                  <button className='login-btn' type="submit">Submit</button>
                </form>
                {
                  signupSuccess ? <p style={{"color":"green"}}>Signed up successfully. <span onClick={()=>{setUserExists(true)}}>Login</span></p>
                  : <p>Already have an account? <span onClick={()=>{setUserExists(true)}}>Login</span></p>
                }
                
                
              </div>
           }
        </div> 
        : null
      }

    </div>
  )
}
