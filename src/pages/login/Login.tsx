import React,{useEffect} from 'react'
import { get } from '../../utils/axios';
import './Login.scss'

export default function Login() {
  useEffect(()=>{
    get('/apiInterface/interface/hydra-opinion-analysis-console/api/v1/sys');
  },[])
  return (
    <div className='login'>Login</div>
  )
}
