import React from "react";
import Image from "next/image";
// internal
import author_img from "@assets/img/users/user-11.jpg";
import social_data from "@/data/social-data";
import Link from "next/link";
const BlogDetailsAuthor = () => {
  return (
    <div
      className="tp-postbox-details-author d-sm-flex align-items-start"
      data-bg-color="#F4F7F9"
    >
      <div className="tp-postbox-details-author-thumb">
        <Link href="#">
          <Image src={author_img} alt="author_img" />
        </Link>
      </div>
      <div className="tp-postbox-details-author-content">
        <span>Written by</span>
        <h5 className="tp-postbox-details-author-title">
          <Link href="#">Theodore Handle</Link>
        </h5>
        <p>
          By defining and following internal and external processes, your team
          will have clarity on resources to attract and retain customers for
          your business.
        </p>

        <div className="tp-postbox-details-author-social">
          {social_data.map((s) => (
            <Link href={s.link} target="_blank" className="me-1" key={s.id}>
              <i className={s.icon}></i>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsAuthor;
