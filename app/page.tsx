'use client'
import { useState } from 'react'

const moves = ['rock','paper','scissors']

function getResult(p,a){
  if(p===a) return 'tie'
  if((p==='rock'&&a==='scissors')||(p==='paper'&&a==='rock')||(p==='scissors'&&a==='paper')) return 'win'
  return 'loss'
}

export default function Page(){
  const [log,setLog]=useState([])
  const [gold,setGold]=useState(0)

  function play(m){
    const ai = moves[Math.floor(Math.random()*3)]
    const res = getResult(m,ai)
    if(res==='win') setGold(g=>g+100)
    setLog(l=>[...l,{m,ai,res}])
  }

  return (
    <div style={{background:'black',color:'white',minHeight:'100vh',padding:20}}>
      <img src='/logo.png' style={{height:40}}/>
      <h1>Birb RPS — Juice Test</h1>

      <div style={{display:'flex',gap:10}}>
        {moves.map(m=>(
          <button key={m} onClick={()=>play(m)}>{m}</button>
        ))}
      </div>

      <h2>Gold: {gold}</h2>

      <div>
        {log.map((r,i)=>(
          <div key={i}>
            You: {r.m} | AI: {r.ai} → {r.res}
          </div>
        ))}
      </div>

      <div style={{marginTop:20}}>
        <img src='/rock.png' width=120/>
        <img src='/paper.png' width=120/>
        <img src='/scissors.png' width=120/>
      </div>
    </div>
  )
}
