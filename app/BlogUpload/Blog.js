import React from 'react'
import { BlogUpload } from './BlogUpload'

const Blog = () => {
  return (
    <div className='mb-28'>
      <div className='text-2xl font-bold p-7 text-white text-center'>Upload Blog Post</div>
        <BlogUpload/>
    </div>
  )
}

export default Blog