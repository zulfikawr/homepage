'use client';

import PageTitle from '@/components/PageTitle';
import PostForm from '@/components/Form/Post';

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
