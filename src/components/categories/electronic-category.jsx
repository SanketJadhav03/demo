import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
// internal
import noImage from '@assets/extra/img/category_no.png';
import ErrorMsg from '../common/error-msg';
import { useGetProductTypeCategoryQuery } from '@/redux/features/categoryApi';
import HomeCateLoader from '../loader/home/home-cate-loader';
import AuthUser from '@/auth/authuser';
import { IMG_URL } from '@/url_helper';
import Link from "next/link";
const ElectronicCategory = () => {
  const { data: categorie, isLoading, isError } = useGetProductTypeCategoryQuery('electronics');
  const router = useRouter()

  const [categories, setcategories] = useState([]);
  const { http } = AuthUser();


  const getAllCategories = async () => {
    await http.get("/category/list").then((res) => {
      setcategories(res.data);

    }).catch((error) => {
      console.log(error);

    })
  }
  useEffect(() => {
    getAllCategories();
  }, [])


  // handle category route
  const handleCategoryRoute = (title) => {
    router.push(`/shop?category=${title.toLowerCase().replace("&", "").split(" ").join("-")}`)
  }
  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <HomeCateLoader loading={isLoading} />
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError) {
    const category_items = categories;
    content = category_items.map((item) => (
      <div className="col" key={item._id}>
        <div className="tp-product-category-item text-center mb-40">
          <div className="tp-product-category-thumb fix">
            <Link href={"#"} className='cursor-pointer'
             onClick={() => handleCategoryRoute(item.category_name)} 
             >
              <Image  src={item.category_img ? `${IMG_URL}/category/${item.category_img}`:noImage} alt="product-category" width={100} height={98} />
            </Link>
          </div>
          <div className="tp-product-category-content">
            <h3 className="tp-product-category-title">
              <Link href={"#"} className='cursor-pointer'
               onClick={() => handleCategoryRoute(item.category_name)}

              >
                {item.category_name}
              </Link>
            </h3>
            <p>{item.products.length} Products</p>
          </div>
        </div>
      </div>
    ))
  }
  return (
    <section className="tp-product-category pt-60 pb-15">
      <div className="container">
        <div className="row row-cols-xl-5 row-cols-lg-5 row-cols-md-4">
          {content}
        </div>
      </div>
    </section>
  );
};

export default ElectronicCategory;