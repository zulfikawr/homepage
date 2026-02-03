'use client';

import PostForm from '@/components/form/post';
import PageTitle from '@/components/page-title';

export default function NewPostContent() {
  return (
    <div>
      <PageTitle
        emoji='📰'
        title='Add Post'
        subtitle='Fill out the form below to add a new post'
      />

      <PostForm />
    </div>
  );
}
