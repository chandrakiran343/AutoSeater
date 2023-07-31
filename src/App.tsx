import { useEffect} from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom'


function App() {

  const nav = useNavigate()


  useEffect(()=>{
    document.getElementById("logo")?.animate([
      {opacity: 0},
      {opacity: 1}
    ]
      ,{duration: 2000, easing: "ease-in-out", fill: "forwards"})
    setTimeout(()=>{
      nav("/home")
    },5000)
  }, [])
  return (
    <div style={{display: "flex", justifyContent: "center", height: "100%", alignItems:"center"}}>
      <h1 id="logo" style={{fontSize: "7em",color:"orange",fontFamily: "Dancing Script, cursive"}}
      >AutoSeater</h1>
    </div>
  )
}

export default App
