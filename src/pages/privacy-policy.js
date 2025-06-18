import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import Link from "next/link";
import { FaLock, FaShieldAlt, FaCookieBite, FaUserCog, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Location } from "@/svg";

const PrivacyPolicy = () => {
    return (
        <Wrapper>
            <SEO pageTitle="Privacy Policy | Sai Suppliers" description="Learn how Sai Suppliers protects your personal data and privacy with our comprehensive security measures and transparent policies." />
            <HeaderTwo style_2={true} />

            <main className="privacy-policy-page py-5   bg-light">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="text-center mb-5">
                                <div className="icon-xl bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                                    <FaLock size={28} />
                                </div>
                                <h1 className="display-5 fw-bold text-primary mb-3">Your Privacy Matters</h1>
                                <p className="lead text-muted">
                                    Transparent. Secure. Respectful of your data.
                                </p>
                            </div>

                            <div className="card border-0 shadow-sm overflow-hidden">
                                <div className="card-header bg-white text-white py-3">
                                    <h2 className="h4 mb-0">Privacy Policy</h2>
                                    <small className="text-dark">Last Updated: {new Date().toLocaleDateString('en-IN')}</small>
                                </div>
                                <div className="card-body p-4 p-lg-5">
                                    <section className="mb-5 pb-3 border-bottom">
                                        <h2 className="h3 fw-bold mb-3 d-flex align-items-center">
                                            <span className="icon-sm bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center me-3">
                                                <FaShieldAlt />
                                            </span>
                                            Introduction
                                        </h2>
                                        <p className="text-muted">
                                            At <strong>Sai Suppliers</strong>, we treat your personal data with the same care we'd expect for our own. This policy explains what information we collect when you use <Link href="/" className="text-primary">Saisuppliers</Link>, why we need it, and how you can control it.
                                        </p>
                                    </section>

                                    <div className="row g-4 mb-5">
                                        <div className="col-md-6">
                                            <section className="h-100">
                                                <h2 className="h3 fw-bold mt-3 mb-3">Information We Collect</h2>
                                                <div className="bg-light p-3 rounded-3">
                                                    <ul className="text-muted list-unstyled">
                                                        <li className="mb-2 d-flex">
                                                            <span className="text-primary me-2">•</span>
                                                            <div>
                                                                <strong>Contact Details:</strong> Name, email, phone when you inquire or order
                                                            </div>
                                                        </li>
                                                        <li className="mb-2 d-flex">
                                                            <span className="text-primary me-2">•</span>
                                                            <div>
                                                                <strong>Usage Patterns:</strong> Pages visited, time spent (via secure analytics)
                                                            </div>
                                                        </li>
                                                        <li className="d-flex">
                                                            <span className="text-primary me-2">•</span>
                                                            <div>
                                                                <strong>Transaction Records:</strong> Order history (processed through PCI-compliant systems)
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </section>
                                        </div>
                                        <div className="col-md-6">
                                            <section className="h-100">
                                                <h2 className="h3 fw-bold mb-3 mt-3">How We Use Data</h2>
                                                <div className="bg-light p-3 rounded-3">
                                                    <ul className="text-muted list-unstyled">
                                                        <li className="mb-2 d-flex">
                                                            <span className="text-primary me-2">•</span>
                                                            <div>To process your gold loan envelope orders</div>
                                                        </li>
                                                        <li className="mb-2 d-flex">
                                                            <span className="text-primary me-2">•</span>
                                                            <div>To improve our products and website experience</div>
                                                        </li>
                                                        <li className="mb-2 d-flex">
                                                            <span className="text-primary me-2">•</span>
                                                            <div>To respond to your service inquiries</div>
                                                        </li>
                                                        <li className="d-flex">
                                                            <span className="text-primary me-2">•</span>
                                                            <div>To comply with financial regulations</div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </section>
                                        </div>
                                    </div>

                                    <section className="mb-5 pb-3 border-bottom">
                                        <h2 className="h3 fw-bold mb-3 d-flex align-items-center">
                                            <span className="icon-sm bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center me-3">
                                                <FaCookieBite />
                                            </span>
                                            Cookies & Tracking
                                        </h2>
                                        <div className="alert alert-info  bg-opacity-05 border-primary border-opacity-25">
                                            <p className="mb-2">
                                                <strong>We use minimal, necessary cookies:</strong>
                                            </p>
                                            <div className="row g-2">
                                                <div className="col-sm-6">
                                                    <div className="p-2 bg-white rounded-2">
                                                        <strong className="d-block">Essential</strong>
                                                        <small>Session management, security</small>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="p-2 bg-white rounded-2">
                                                        <strong className="d-block">Analytical</strong>
                                                        <small>Anonymous usage statistics</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="mt-3 mb-0">
                                                <small>You can manage preferences in your browser settings.</small>
                                            </p>
                                        </div>
                                    </section>

                                    <section className="mb-5 mt-3">
                                        <h2 className="h3 fw-bold mb-3 d-flex align-items-center">
                                            <span className="icon-sm bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center me-3">
                                                <FaUserCog />
                                            </span>
                                            Your Control Options
                                        </h2>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className="border p-3 rounded-3 h-100 text-center">
                                                    <div className="icon-lg bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-3">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                    </div>
                                                    <h3 className="h5 fw-bold mb-2">Access</h3>
                                                    <p className="text-muted small mb-0">Request a copy of your data</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="border p-3 rounded-3 h-100 text-center">
                                                    <div className="icon-lg bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-3">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                        </svg>
                                                    </div>
                                                    <h3 className="h5 fw-bold mb-2">Correct</h3>
                                                    <p className="text-muted small mb-0">Update inaccurate information</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="border p-3 rounded-3 h-100 text-center">
                                                    <div className="icon-lg bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-3">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </div>
                                                    <h3 className="h5 fw-bold mb-2">Delete</h3>
                                                    <p className="text-muted small mb-0">Remove your personal data</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="bg-  bg-opacity-05 p-4 mt-3 rounded-3">
                                        <h2 className="h3 fw-bold mb-3">Need Help or Have Questions?</h2>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="d-flex">
                                                    <div className="icon-md bg-white text-primary rounded-circle flex-shrink-0 me-3">
                                                        <FaEnvelope />
                                                    </div>
                                                    <div>
                                                        <h3 className="h5 fw-bold mb-1">Email Us</h3>
                                                        <p>
                                                            <Link href="mailto:Kiran.mahamuni@saisuppliers.com" className="text-primary">Kiran.mahamuni@saisuppliers.com</Link>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mt-3">
                                                <div className="d-flex">
                                                    <div className="icon-md bg-white text-primary rounded-circle flex-shrink-0 me-3">
                                                        <Location />
                                                    </div>
                                                    <div>
                                                        <h3 className="h5 fw-bold mb-1">Visit Us</h3>
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
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer primary_style={true} />
        </Wrapper>
    );
};

export default PrivacyPolicy;