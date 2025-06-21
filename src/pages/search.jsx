import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import ErrorMsg from "@/components/common/error-msg";
import SearchPrdLoader from "@/components/loader/search-prd-loader";
import ProductItem from "@/components/products/fashion/product-item";
import SEO from "@/components/seo";
import ShopTopLeft from "@/components/shop/shop-top-left";
import Footer from "@/layout/footers/footer";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import NiceSelect from "@/ui/nice-select";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SearchPage({ query }) {
  const router = useRouter();
  const { searchText: initialSearchText, productType } = query;
  const [searchText, setSearchText] = useState(initialSearchText || "");
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [shortValue, setShortValue] = useState("");
  const perView = 8;
  const [next, setNext] = useState(perView);

  // Update URL when search text changes
  useEffect(() => {
    if (searchText !== initialSearchText) {
      router.push({
        pathname: "/search",
        query: { ...query, searchText },
      }, undefined, { shallow: true });
    }
  }, [searchText]);

  // selectShortHandler
  const shortHandler = (e) => {
    setShortValue(e.value);
  };

  // handleLoadMore
  const handleLoadMore = () => {
    setNext((value) => value + 4);
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    if (!products?.data) return [];

    let filteredProducts = [...products.data];

    // Apply search text filter
    if (searchText) {
      filteredProducts = filteredProducts.filter((prd) =>
        prd.product_english_name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply product type filter if exists
    if (productType) {
      filteredProducts = filteredProducts.filter(
        (prd) => prd.productType?.toLowerCase() === productType.toLowerCase()
      );
    }

    // Apply sorting
    if (shortValue === "Price low to high") {
      filteredProducts.sort((a, b) => Number(a.price_sales) - Number(b.price_sales));
    } else if (shortValue === "Price high to low") {
      filteredProducts.sort((a, b) => Number(b.price_sales) - Number(a.price_sales));
    }

    return filteredProducts;
  };

  const filteredProducts = getFilteredProducts();

  // decide what to render
  let content = null;
  if (isLoading) {
    content = <SearchPrdLoader loading={isLoading} />;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No products found!" />;
  }

  if (!isLoading && !isError && products?.data?.length > 0) {
    if (filteredProducts.length === 0) {
      content = (
        <div className="text-center pt-80 pb-80">
          <h3>
            Sorry, nothing matched <span style={{ color: '#0989FF' }}>{searchText}</span> search terms
          </h3>
          <p className="mt-3">Try different or more general keywords</p>
        </div>
      );
    } else {
      content = ( 
        <>
          <section className="tp-shop-area pb-120">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 col-lg-12">
                  <div className="tp-shop-main-wrapper">
                    <div className="tp-shop-top mb-45">
                      <div className="row">
                        <div className="col-xl-6">
                          <div className="tp-shop-top-left d-flex align-items-center">
                            <div className="tp-shop-top-result">
                              <p>Showing 1–{Math.min(next, filteredProducts.length)} of {filteredProducts.length} results</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="tp-shop-top-right d-sm-flex align-items-center justify-content-xl-end">
                            <div className="tp-shop-top-select">
                              <NiceSelect
                                options={[
                                  { value: "Short By Price", text: "Sort By" },
                                  { value: "Price low to high", text: "Price: Low to High" },
                                  { value: "Price high to low", text: "Price: High to Low" },
                                ]}
                                defaultCurrent={0}
                                onChange={shortHandler}
                                name="Sort By"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="tp-shop-items-wrapper tp-shop-item-primary">
                      <div className="row">
                        {filteredProducts.slice(0, next).map((item) => (
                          <div
                            key={item.product_id}
                            className="col-xl-3 col-lg-4 col-md-6 col-sm-6"
                          >
                            <ProductItem product={item} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* load more btn start */}
                    {next < filteredProducts.length && (
                      <div className="load-more-btn text-center pt-50">
                        <button 
                          onClick={handleLoadMore} 
                          className="tp-btn tp-btn-2 tp-btn-blue"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                    {/* load more btn end */}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      );
    }
  }

  return (
    <Wrapper>
      <SEO pageTitle={`Search: ${searchText}`} />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb 
        title={`Search Results for "${searchText}"`} 
        subtitle="Search Products" 
      />
      
      {/* Search input at the top of the page */}
      <div className="container mb-50">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="tp-search-page-input">
              <input
                type="text"
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
}

export const getServerSideProps = async (context) => {
  const { query } = context;
  return {
    props: {
      query,
    },
  };
};