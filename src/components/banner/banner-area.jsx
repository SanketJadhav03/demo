import React from "react";
import Link from "next/link";
// internal
import { ArrowRight } from "@/svg";
import banner_1 from "@assets/img/banner/become.jpg";
import banner_2 from "@assets/img/banner/bulk-order.jpg";

// banner item
function BannerItem({ sm = false, bg, title }) {
  return (
    <div className="banner-item-wrapper p-relative mb-4 mb-md-30 z-index-1">
      <img
        src={bg.src}
        alt={title || "Banner image"}
        className="banner-image img-fluid"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '10px',
          objectFit: 'cover',
          objectPosition: 'center',
          minHeight: '200px' // fallback for mobile
        }}
      />
    </div>
  );
}

const BannerArea = () => {
  return (
    <section className="tp-banner-area pb-40 pb-md-80">
      <div className="container">
        <div className="row gx-3 gy-4">
          <div className="col-12 col-md-6">
            <BannerItem bg={banner_1} />
          </div>
          <div className="col-12 col-md-6">
            <BannerItem sm={true} bg={banner_2} />
          </div>
        </div>
      </div>

    
    </section>
  );
};

export default BannerArea;