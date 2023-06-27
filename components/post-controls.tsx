"use client";

// import { addPost, editPost, removePost } from "../actions";
import { useState } from "react";

type DeletePostProps = {
  id: number;
};

type UpdatePostProps = {
  id: number;
  data: {
    title?: string;
    content?: string;
    date?: Date;
    authorId?: number;
    published?: boolean;
  };
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    console.log("adding post");
    // addPost({ title });
  };

  const handleChange = (e: React.BaseSyntheticEvent) => {
    setTitle(e.target.value);
  };

  return (
    <form>
      <input type="text" onChange={handleChange}></input>
      {/* <button onClick={handleSubmit}>Create Post</button> */}
    </form>
  );
};

export const DeletePost = (props: DeletePostProps) => {
  const { id } = props;
  const handleClick = () => {
    console.log("deleting ", id);
    // removePost(id);
  };
  return <button onClick={handleClick}>Delete Post</button>;
};

export const UpdatePost = (props: UpdatePostProps) => {
  const { id, data } = props;
  const handleClick = () => {
    console.log("updating ", id);
    // editPost(id, data);
  };
  return <button onClick={handleClick}>Update Post</button>;
};
