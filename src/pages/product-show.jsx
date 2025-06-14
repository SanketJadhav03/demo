import AuthUser from '@/auth/authuser'
import DOMPurify from 'dompurify'
import SEO from '@/components/seo'
import Footer from '@/layout/footers/footer'
import HeaderTwo from '@/layout/headers/header-2'
import Wrapper from '@/layout/wrapper'
import { set } from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { use, useEffect, useState, useRef } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import sanitize from '@/lib/sanitize'
import { IMG_URL } from '@/url_helper'
import ProductItem from '@/components/products/electronics/product-item'
import { notifyError, notifySuccess } from '@/utils/toast'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const Productshow = () => {
    const router = useRouter();
    const { id } = router.query;
    const { http, user } = AuthUser();
    const [product, setProduct] = useState({});
    const [textMore, setTextMore] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef(null);

    const getSingleProductToShow = async () => {
        try {
            await http.get(`/products/find/product/singal/${id}`).then((res) => {
                setProduct(res.data[0]);
            }).catch((e) => {
                console.log(e);
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (id) {
            getSingleProductToShow();
        }
    }, [id]);
    const [products, setProducts] = useState([]);
    useEffect(() => {
        if (product.category_id) {
            http.get(`/category/show/${product.category_id}`).then((res) => {
                if (res.data.products.length > 0) {
                    setProducts(res.data.products);
                }
            }).catch((e) => {
                console.log(e);
            })
        }
    }, [product?.category_id])

    const images = [product.img, ...(product.product_multiple_image?.split(',') || [])].filter(Boolean);

    // Auto-slide functionality
    useEffect(() => {
        if (images.length > 1) {
            startAutoSlide();
            return () => stopAutoSlide();
        }
    }, [images.length]);

    const startAutoSlide = () => {
        intervalRef.current = setInterval(() => {
            if (!isHovered) {
                setActiveIndex(prev => (prev + 1) % images.length);
            }
        }, 3000); // Change every 3 seconds
    };

    const stopAutoSlide = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const handleThumbClick = (index) => {
        setActiveIndex(index);
        // Reset timer on manual navigation
        stopAutoSlide();
        startAutoSlide();
    };
    const [cartQty, setCartQty] = useState(1);
    const handleAddProduct = async (prd) => {
        if (user) {
            await http.post("/cart/store", { cart_name: "", cart_quantity: cartQty, cart_product_id: prd.product_id, user_id: user.user_id })
                .then((res) => {
                    notifySuccess(res.data.message);
                }).catch((res) => {
                    notifyError(res);
                });
        } else {
            notifyError("Please Login to add Cart");
        }
    };

    const handleWishlistProduct = async (prd) => {
        if (user) {
            await http.post("/wishlist/store", { wishlist_name: "", wishlist_quantity: 1, wishlist_product_id: prd.product_id, user_id: user.user_id })
                .then((res) => {
                    notifySuccess(res.data.message);
                }).catch((res) => {
                    notifyError(res);
                });
        } else {
            notifyError("Please login to add product to wishlist");
        }
    };
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <Wrapper>
            <SEO pageTitle={product.product_english_name || "Product"} />
            <HeaderTwo style_2={true} />
            <div className='p-5'>
                <section className="tp-product-details-area">
                    <div className="tp-product-details-top pb-25">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-7 col-lg-6">
                                    <div
                                        className="tp-product-details-thumb-wrapper tp-tab d-sm-flex"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        <nav>
                                            <div className="nav nav-tabs flex-sm-column" id="productDetailsNavThumb" role="tablist">
                                                {images[0] != '[]' && images.map((img, index) => (
                                                    <button
                                                        key={index}
                                                        className={`nav-link ${activeIndex === index ? 'active' : ''}`}
                                                        onClick={() => handleThumbClick(index)}
                                                        type="button"
                                                        role="tab"
                                                        aria-selected={activeIndex === index}
                                                    >
                                                        <img
                                                            src={`${IMG_URL}/products/${img.trim()}`}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="img-thumbnail"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </nav>

                                        <div className="tab-content m-img" id="productDetailsNavContent">
                                            <div className="tp-product-details-nav-main-thumb position-relative">
                                                <Zoom>
                                                    {images[activeIndex] != '[]' ? <img
                                                        src={`${IMG_URL}/products/${images[activeIndex]?.trim()}`}
                                                        alt={`Product view ${activeIndex + 1}`}
                                                        className="img-fluid main-product-image"
                                                        style={{
                                                            transition: 'transform 0.3s ease',
                                                            cursor: 'zoom-in',
                                                            width: '100%',
                                                            height: 'auto'
                                                        }}
                                                    /> : <div className='p-5'>
                                                        Image Not Available
                                                    </div>}
                                                </Zoom>
                                            </div>
                                        </div>

                                        {/* Navigation arrows */}
                                        {(images[0] != '[]' && images.length > 1) && (
                                            <>
                                                <button
                                                    className="carousel-control-prev"
                                                    onClick={() => handleThumbClick((activeIndex - 1 + images.length) % images.length)}
                                                    style={{
                                                        position: 'absolute',
                                                        left: '10px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        zIndex: 1,
                                                        background: 'rgba(0,0,0,0.2)',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '40px',
                                                        height: '40px',
                                                        color: 'white'
                                                    }}
                                                >
                                                    &lt;
                                                </button>
                                                <button
                                                    className="carousel-control-next"
                                                    onClick={() => handleThumbClick((activeIndex + 1) % images.length)}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '10px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        zIndex: 1,
                                                        background: 'rgba(0,0,0,0.2)',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '40px',
                                                        height: '40px',
                                                        color: 'white'
                                                    }}
                                                >
                                                    &gt;
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="col-xl-5 col-lg-6">
                                    <div className="tp-product-details-wrapper " >
                                        <div className="tp-product-details-category">
                                            <span>{product.category_name}</span>
                                        </div>
                                        <h5 className="">
                                            {product.product_english_name}/{product.product_marathi_name}
                                        </h5>

                                        <div className="tp-product-details-price-wrapper mb-20">
                                            <span className="tp-product-details-price old-price">Rs{product.price_mrp}</span>
                                            <span className="tp-product-details-price new-price">Rs{product.price}</span>
                                        </div>

                                        <div className="tp-product-details-action-wrapper">
                                            <h3 className="tp-product-details-action-title">Quantity</h3>
                                            <div className="tp-product-details-action-item-wrapper d-flex align-items-center">
                                                <div className="tp-product-details-quantity">
                                                    <div className="tp-product-quantity mb-15 mr-15">
                                                        <span className="tp-cart-minus" onClick={() => setCartQty(cartQty > 1 ? cartQty - 1 : 1)}>
                                                            <svg width={11} height={2} viewBox="0 0 11 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M1 1H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </span>
                                                        <input className="tp-cart-input" type="text" value={cartQty} />
                                                        <span className="tp-cart-plus" onClick={() => setCartQty(cartQty + 1)}>
                                                            <svg width={11} height={12} viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M1 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M5.5 10.5V1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="tp-product-details-add-to-cart mb-15 w-100">
                                                    <button type='button' onClick={() => handleAddProduct(product)} className="tp-product-details-add-to-cart-btn w-100">Add To Cart</button>
                                                </div>
                                            </div>
                                            <button onClick={() => handleWishlistProduct(product)} type="button" className="rounded tp-product-details-buy-now-btn w-100">
                                                <svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.33541 7.54172C3.36263 10.6766 7.42094 13.2113 8.49945 13.8387C9.58162 13.2048 13.6692 10.6421 14.6635 7.5446C15.3163 5.54239 14.7104 3.00621 12.3028 2.24514C11.1364 1.8779 9.77578 2.1014 8.83648 2.81432C8.64012 2.96237 8.36757 2.96524 8.16974 2.81863C7.17476 2.08487 5.87499 1.86999 4.69024 2.24514C2.28632 3.00549 1.68259 5.54167 2.33541 7.54172ZM8.50115 15C8.4103 15 8.32018 14.9784 8.23812 14.9346C8.00879 14.8117 2.60674 11.891 1.29011 7.87081C1.28938 7.87081 1.28938 7.8701 1.28938 7.8701C0.462913 5.33895 1.38316 2.15812 4.35418 1.21882C5.7492 0.776121 7.26952 0.97088 8.49895 1.73195C9.69029 0.993159 11.2729 0.789057 12.6401 1.21882C15.614 2.15956 16.5372 5.33966 15.7115 7.8701C14.4373 11.8443 8.99571 14.8088 8.76492 14.9332C8.68286 14.9777 8.592 15 8.50115 15Z" fill="currentColor" />
                                                    <path d="M12.8384 6.93209C12.5548 6.93209 12.3145 6.71865 12.2911 6.43693C12.2427 5.84618 11.8397 5.34743 11.266 5.1656C10.9766 5.07361 10.8184 4.76962 10.9114 4.48718C11.0059 4.20402 11.3129 4.05023 11.6031 4.13934C12.6017 4.45628 13.3014 5.32371 13.3872 6.34925C13.4113 6.64606 13.1864 6.90622 12.8838 6.92993C12.8684 6.93137 12.8538 6.93209 12.8384 6.93209Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3" />
                                                </svg>
                                                &nbsp;
                                                Add Wishlist
                                            </button>
                                        </div>



                                        <div className="tp-product-details-social">
                                            <span>Share: </span>
                                            <Link href="#"><i className="fa-brands fa-facebook-f" /></Link>
                                            <Link href="#"><i className="fa-brands fa-twitter" /></Link>
                                            <Link href="#"><i className="fa-brands fa-linkedin-in" /></Link>
                                            <Link href="#"><i className="fa-brands fa-vimeo-v" /></Link>
                                        </div>

                                        <div className="tp-product-details-payment d-flex align-items-center flex-wrap justify-content-between">
                                            <p>Guaranteed safe <br /> &amp; secure checkout</p>
                                            <img src="assets/img/product/icons/payment-option.png" alt />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tp-product-details-bottom pt-50 ">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="tp-product-details-tab-nav tp-tab ">
                                        <nav>
                                            <div className="nav nav-tabs justify-content-center p-relative tp-product-tab" id="navPresentationTab" role="tablist">
                                                <button className="nav-link active" id="nav-description-tab" data-bs-toggle="tab" data-bs-target="#nav-description" type="button" role="tab" aria-controls="nav-description" aria-selected="true">Description</button>
                                            </div>
                                        </nav>
                                        <div className="tab-content " id="navPresentationTabContent">
                                            <p className='pt-15' style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                wordBreak: "break-word",
                                                whiteSpace: "pre-wrap",
                                                maxHeight: textMore ? 'none' : '100px',
                                            }}>
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: sanitize(
                                                            (textMore || !product.description)
                                                                ? product.description || 'No description available.'
                                                                : `${product.description?.slice(0, 100)}...`
                                                        ),
                                                    }}
                                                />
                                                {product.description && product.description.length > 100 && (
                                                    <div
                                                        onClick={() => setTextMore(!textMore)}
                                                        style={{ cursor: 'pointer', color: '#007bff', marginLeft: 5 }}
                                                    >
                                                        {textMore ? 'See less' : 'See more'}
                                                    </div>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </section>
                <section className="tp-related-product pt-50 pb-35">
                    <div className="container">
                        <div className="row">
                            <div className="tp-section-title-wrapper-6 text-center mb-15">
                                <span className="tp-section-title-pre-6">{product.category_name}</span>
                                <h3 className="tp-section-title-6">Related Products</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <Slider {...sliderSettings}>
                                    {products.length > 0 &&
                                        products
                                            .filter(item => item.product_id != product.product_id)
                                            .map((prd, i) => (
                                                <div key={i} className="px-2"> {/* Added padding between items */}
                                                    <ProductItem product={prd} />
                                                </div>
                                            ))
                                    }
                                </Slider>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            <Footer primary_style={true} />
        </Wrapper>
    )
}

export default Productshow