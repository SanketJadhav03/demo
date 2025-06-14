import Image from "next/image";
import { useState } from "react";
import PopupVideo from "../../common/popup-video";
import noImage from '@assets/extra/img/no.jpg';

import AuthUser from "@/auth/authuser";
import Link from "next/link";
import { IMG_URL } from "@/url_helper";

const DetailsThumbWrapper = ({
  imageURLs,
  handleImageActive,
  activeImg,
  imgWidth = 100,
  imgHeight = 100,
  videoId = false,
  status
}) => { 
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Determine image source
  const imageSrc = imageURLs ? `${IMG_URL}/products/${imageURLs}` : noImage;

  return (
    <>
      <div className="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
        <nav>
          <div className="nav nav-tabs flex-sm-column">
            {/* Additional thumbnails (if needed) */}
          </div>
        </nav>
        <div className="tab-content m-img">
          <div className="tab-pane fade show active">
            <div className="tp-product-details-nav-main-thumb p-relative">
              <div style={{ width: imgWidth, height: imgHeight, position: "relative" }}>
                <Image
                  src={imageSrc}
                  alt="product img"
                  width={imgWidth}
                  height={imgHeight}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </div>

              <div className="tp-product-badge">
                {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
              </div>

              {videoId && (
                <div
                  onClick={() => setIsVideoOpen(true)}
                  className="tp-product-details-thumb-video"
                >
                  <Link href={"#"} className="tp-product-details-thumb-video-btn cursor-pointer popup-video">
                    <i className="fas fa-play"></i>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* modal popup start */}
      {videoId && (
        <PopupVideo
          isVideoOpen={isVideoOpen}
          setIsVideoOpen={setIsVideoOpen}
          videoId={videoId}
        />
      )}
      {/* modal popup end */}
    </>
  );
};

export default DetailsThumbWrapper;
