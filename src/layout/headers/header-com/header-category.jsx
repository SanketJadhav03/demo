import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
// internal
import { useGetProductTypeCategoryQuery } from "@/redux/features/categoryApi";
import ErrorMsg from "@/components/common/error-msg";
import Loader from "@/components/loader/loader";
import Link from "next/link";
import { IMG_URL } from "@/url_helper";
const HeaderCategory = ({ isCategoryActive, categoryType = "electronics" }) => {
  const {
    data: categories,
    isError,
    isLoading,
  } = useGetProductTypeCategoryQuery(categoryType);
  const router = useRouter();

  // handle category route
  const handleCategoryRoute = (title, route) => {
    if (route === "parent") {
      router.push(
        `/shop?category=${title
          .toLowerCase()
          .replace("&", "")
          .split(" ")
          .join("-")}`
      );
    }
  };
  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <div className="py-5">
        <Loader loading={isLoading} />
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && categories?.length > 0) {
    const category_items = categories;
    content = category_items.map((item) => (

      <li className="has-" key={item.category_id}>
        <Link
          href={'#'}
          className="cursor-pointer"
          onClick={() => handleCategoryRoute(item.category_name, "parent")}
        >
          {item.category_img && (
            <span>
              <Image src={IMG_URL + "/category/" + item.category_img} style={{ width: "50px", height: "30px" }} alt="cate img" width={50} height={50} />
            </span>
          )}
          {item.category_name}
          {item.parent}
        </Link> 
      </li>
    ));
  }
  return <ul className={isCategoryActive ? "active" : ""}>{content}</ul>;
};

export default HeaderCategory;
