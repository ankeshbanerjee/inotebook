import React, { useContext, useEffect } from 'react'
import NoteContext from '../context/notes/NoteContext'

const About = () => {
  const a = useContext(NoteContext)
  useEffect(() => {
    a.update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div>
      This is About {a.state.name}. He reads in {a.state.college}
    </div>
  )
}

export default About
