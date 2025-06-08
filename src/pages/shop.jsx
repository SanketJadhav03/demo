import React, { useState, useEffect, useMemo } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ErrorMsg from "@/components/common/error-msg";
import Footer from "@/layout/footers/footer";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import ShopLoader from "@/components/loader/shop/shop-loader";

const ShopPage = ({ query }) => {
  const { data: products = [], isError, isLoading } = useGetAllProductsQuery();
  const [priceValue, setPriceValue] = useState([0, 100]); // Initialize with safe defaults
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);

  // Calculate and set initial price range
  useEffect(() => {
    if (!isLoading && !isError && products.length > 0) {
      const validPrices = products
        .map(p => parseInt(p.price_sales))
        .filter(price => !isNaN(price) && price >= 0);

      if (validPrices.length > 0) {
        const minPrice = Math.min(...validPrices);
        const maxPrice = Math.max(...validPrices);

        // Handle edge case where all prices are equal
        const safeMin = minPrice === maxPrice 
          ? Math.max(0, minPrice * 0.9) // 10% below if all prices same
          : minPrice;
        
        const safeMax = minPrice === maxPrice 
          ? maxPrice * 1.1 // 10% above if all prices same
          : maxPrice;

        setPriceValue([safeMin, safeMax]);
      }
    }
  }, [isLoading, isError, products]);

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    if (isLoading || isError) return [];
    
    let result = [...products];
    console.log(result);

    // Apply price filter first
    result = result.filter(p => {
      const price = parseInt(p.price_sales) || 0;
      return price >= priceValue[0] && price <= priceValue[1];
    });

    // Apply status filter
    if (query.status === "on-sale") {
      result = result.filter(p => parseFloat(p.price_mrp) > parseFloat(p.price_sales));
    } else if (query.status === "in-stock") {
      result = result.filter(p => parseFloat(p.price_opening_qty) > 0);
    }

    // Apply category filter
    if (query.category) {
      const normalizedQuery = query.category.toLowerCase().replace("&", "").split(" ").join("-");
      result = result.filter(p => 
        p.category_name.toLowerCase().replace("&", "").split(" ").join("-") === normalizedQuery
      );
    }

    // Apply brand filter
    if (query.brand) {
      const normalizedQuery = query.brand.toLowerCase().replace("&", "").split(" ").join("-");
      result = result.filter(p => 
        p.bank_name.toLowerCase().replace("&", "").split(" ").join("-") === normalizedQuery
      );
    }

    // Apply sorting
    if (selectValue) {
      switch (selectValue) {
        case "Low to High":
          result.sort((a, b) => parseFloat(a.price_sales) - parseFloat(b.price_sales));
          break;
        case "High to Low":
          result.sort((a, b) => parseFloat(b.price_sales) - parseFloat(a.price_sales));
          break;
        case "New Added":
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "On Sale":
          result = result.filter(p => parseFloat(p.price_mrp) > parseFloat(p.price_sales));
          break;
        default:
          break;
      }
    }

    return result;
  }, [products, priceValue, query, selectValue, isLoading, isError]);

  const handlePriceChange = (val) => {
    // Ensure min is always less than max
    const [min, max] = val;
    if (min >= max) return;
    
    setCurrPage(1);
    setPriceValue(val);
  };

  const handleSortChange = (e) => {
    setCurrPage(1);
    setSelectValue(e.value);
  };

  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges: handlePriceChange,
      min: priceValue[0],
      max: priceValue[1],
    },
    selectHandleFilter: handleSortChange,
    currPage,
    setCurrPage,
  };

  // Render content based on state
  let content = null;
  if (isLoading) {
    content = <ShopLoader loading={isLoading} />;
  } else if (isError) {
    content = <div className="pb-80 text-center"><ErrorMsg msg="There was an error loading products" /></div>;
  } else if (products.length === 0) {
    content = <ErrorMsg msg="No products found" />;
  } else {
    content = (
      <>
        <ShopArea
          all_products={products}
          products={filteredProducts}
          otherProps={otherProps}
        />
        <ShopFilterOffCanvas
          all_products={products}
          otherProps={otherProps}
        />
      </>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle="Shop" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Shop Grid" subtitle="Shop Grid" />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopPage;

export const getServerSideProps = async (context) => {
  const { query } = context;
  return { props: { query } };
};