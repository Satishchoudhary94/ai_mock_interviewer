// app/interview/page.tsx or wherever this file is
import React from 'react'
import Agent from '@/components/agent' // ✅ Capitalized import to match usage

const Page = () => {
  return (
    <> 
      <h3>Interview Page</h3> 
      <Agent userName="You" userId="user1" type="generate" />
    </>
  )
}

export default Page
