'use client';

import PostForm from '@/components/Form/Post';
import PageTitle from '@/components/PageTitle';

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
