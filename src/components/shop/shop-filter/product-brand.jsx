import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetActiveBrandsQuery } from "@/redux/features/brandApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopBrandLoader from "@/components/loader/shop/shop-brand-loader";
import Link from "next/link";
import noImage from '@assets/extra/img/category_no.png';
import { IMG_URL } from "@/url_helper";
const ProductBrand = ({ setCurrPage, shop_right = false }) => {
  const { data: brands, isError, isLoading } = useGetActiveBrandsQuery();
  const router = useRouter();
  const dispatch = useDispatch();
  // handle brand route 
  const handleBrandRoute = (brand) => {
    setCurrPage(1);
    router.push(
      `/${shop_right ? 'shop-right-sidebar' : 'shop'}?brand=${brand
        .toLowerCase()
        .replace("&", "")
        .split(" ")
        .join("-")}`
    )
    dispatch(handleFilterSidebarClose());
  }
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopBrandLoader loading={isLoading} />;
  } else if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (!isLoading && !isError && brands?.length === 0) {
    content = <ErrorMsg msg="No Brands found!" />;
  } else if (!isLoading && !isError && brands?.length > 0) {
    const all_brands = brands;

    const sortedBrands = all_brands.slice().sort((a, b) => b.products.length - a.products.length);
    const brand_items = sortedBrands.slice(0, 6);

    content = brand_items.map((item) => (
      <li key={item.bank_id}>
        <Link
          href={'#'}
          onClick={() => handleBrandRoute(item.bank_name)}
          style={{ cursor: "pointer" }}
          className={
            router.query.brand ===
              item.bank_name.toLowerCase().replace("&", "").split(" ").join("-")
              ? "active"
              : ""
          }
        >

          {item.bank_name} <span>{item.products.length}</span>
        </Link>
      </li>
    ));
  }
  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title"> Banks</h3>
        <div className="tp-shop-widget-content ">
          <div className="tp-shop-widget-categories">
            <ul>
              {content}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductBrand;
