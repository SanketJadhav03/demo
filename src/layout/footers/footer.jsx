import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import logo from '@assets/img/header/img/logo.svg';
import pay from '@assets/img/footer/footer-pay.png';
import social_data from '@/data/social-data';
import { Email, Location } from '@/svg';

const Footer = ({ style_2 = false, style_3 = false, primary_style = false }) => {
  return (
    <footer>
      <div className={`tp-footer-area ${primary_style ? 'tp-footer-style-2 tp-footer-style-primary tp-footer-style-6' : ''} ${style_2 ? 'tp-footer-style-2' : style_3 ? 'tp-footer-style-2 tp-footer-style-3' : ''}`}
        data-bg-color={`${style_2 ? 'footer-bg-white' : 'footer-bg-grey'}`}>
        <div className="tp-footer-top pt-65 pb-30">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-1 ">
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-logo">
                      <Link href="/">
                        <Image src={logo} alt="logo" />
                      </Link>
                    </div>
                    <p className="tp-footer-desc">
                      We provide high-quality packing solutions including Gold Loan, Plain, and Custom Envelopes with reliable service and delivery.
                    </p>
                    <div className="tp-footer-social">
                      {social_data.map(s => <Link href={s?.link || ""} key={s.id} target="_blank">
                        <i className={s.icon}></i>
                      </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-2 ">
                  <h4 className="tp-footer-widget-title">My Account</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      {/* <li><Link href="/profile">Track Orders</Link></li> */}
                      {/* <li><Link href="#">Shipping</Link></li> */}
                      <li><Link href="/profile">My Account</Link></li>

                      <li><Link href="/cart">Cart</Link></li>
                      <li><Link href="/wishlist">Wishlist</Link></li>
                      <li><Link href="/about">About</Link></li>
                      <li><Link href="/contact">Contact</Link></li>
                      {/* <li><Link href="">Order History</Link></li> */}
                      {/* <li><Link href="#">Returns</Link></li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-3 ">
                  <h4 className="tp-footer-widget-title">Information</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      <li><Link href="/profile">My Orders</Link></li>
                      <li><Link href="/gallery">Our Gallery</Link></li>
                      {/* <li><Link href="#">Careers</Link></li> */}
                      <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                      <li><Link href="/terms">Terms & Conditions</Link></li>
                      {/* <li><Link href="#">Contact Us</Link></li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-4 ">
                  <h4 className="tp-footer-widget-title">Talk To Us</h4>
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-talk mb-20">
                      <span>Got Questions? Call us</span>
                      <h4><Link href="tel:+919226439223">+91 92264 39223</Link></h4>
                    </div>
                    <div className="tp-footer-contact">
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Email />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p><Link href="mailto:Kiran.mahamuni@saisuppliers.com">Kiran.mahamuni@saisuppliers.com</Link></p>
                        </div>
                      </div>
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Location />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p>
                            <Link href="https://maps.google.com?q=265+Kasba+Peth+Shankar+Market+road,+Phaltan+Dist.+Satara+415523" target="_blank">
                              265 Kasba Peth,<br />
                              Shankar Market Road,<br />
                              Phaltan, Dist. Satara – 415523
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tp-footer-bottom">
          <div className="container">
            <div className="tp-footer-bottom-wrapper">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="tp-footer-copyright">
                    <p>© {new Date().getFullYear()} All Rights Reserved  by Sai Supplier.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tp-footer-payment text-md-end">
                    <p>
                      <Image src={pay} alt="pay" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;