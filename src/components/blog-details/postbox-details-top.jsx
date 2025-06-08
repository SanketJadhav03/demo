import React from "react";
import { Comment, Date, UserTwo } from "@/svg";
import Link from "next/link";

const PostboxDetailsTop = ({blog}) => {
  const {category,title,date,comments,author} = blog || {};
  return ( 
    <div className="tp-postbox-details-top">
      <div className="tp-postbox-details-category">
        <span>
          <Link href="#" className="text-capitalize">{category}</Link>
        </span>
      </div>
      <h3 className="tp-postbox-details-title">
        {title}
      </h3>
      <div className="tp-postbox-details-meta mb-50">
        <span data-meta="author">
          <UserTwo />
          By <Link href="#">{" "}{author}</Link>
        </span>
        <span>
          <Date />
          {" "}{date}
        </span>
        <span>
          <Comment />
          <Link href="#">Comments ({comments})</Link>
        </span>
      </div>
    </div>
  );
};

export default PostboxDetailsTop;
