import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import Image from "next/image";
import about1 from "@assets/img/about/our_vision.jpg";
import about2 from "@assets/img/about/our_mission.jpg";
import about3 from "@assets/img/about/core_value.jpg";

const AboutPage = () => {
    return (
        <Wrapper>
            <SEO pageTitle="About Us" />
            <HeaderTwo style_2={true} />

            <main className="about-page">
                {/* Hero Section */}
                <section className="py-5 py-lg-6 bg-light bg-gradient">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 text-center">
                                <h1 className="display-4 fw-bold text-primary mb-3">Who We Are</h1>
                                <p className="lead text-muted mb-4">
                                    Welcome to Sai Suppliers
                                </p>
                                <p className="fs-5 text-secondary">
                                    We provide Gold Loan Envelopes designed with high exactness. Our envelopes undergo various quality checks under expert supervision to maintain superior standards. Available at market-leading prices across India with customized solutions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Vision & Mission Section */}
                <section className="py-5 py-lg-6 bg-light">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-lg-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body p-4 p-lg-5">
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="flex-shrink-0 me-3">
                                                <Image
                                                    src={about1}
                                                    alt="Vision"
                                                    width={60}
                                                    height={60}
                                                    className="rounded-circle"
                                                />
                                            </div>
                                            <h2 className="h3 fw-bold mb-0">Our Vision</h2>
                                        </div>
                                        <p className="text-muted mb-0">
                                            To be a leading supplier of high-quality gold loan envelopes and other bank stationery products, recognized for our reliability, innovation, and exceptional customer service. We aim to build lasting relationships with our clients and contribute to their success by providing products that meet their specific needs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body p-4 p-lg-5">
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="flex-shrink-0 me-3">
                                                <Image
                                                    src={about2}
                                                    alt="Mission"
                                                    width={60}
                                                    height={60}
                                                    className="rounded-circle"
                                                />
                                            </div>
                                            <h2 className="h3 fw-bold mb-0">Our Mission</h2>
                                        </div>
                                        <p className="text-muted mb-0">
                                            We are dedicated to providing superior quality products and exceptional service to our customers worldwide. Our mission is to leverage our expertise in gold loan envelopes manufacturing to deliver innovative, reliable, and sustainable solutions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-60 pt-40 py-lg-7">
                    <div className="container">
                        <div className="row justify-content-center mb-5 mb-lg-6">
                            <div className="col-lg-10 text-center ">
                                <h2 className="display-5 fw-bold mb-3">
                                    Why Choose <span className="text-primary">Our Products</span>
                                </h2>
                                <p className="lead pt-20 pb-20  text-muted mb-0">
                                    Engineered for security, designed for efficiency
                                </p>
                            </div>
                        </div>

                        <div className="row g-4 g-lg-5">
                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card p-4 p-lg-5 text-center border rounded-3 h-100">
                                    <div className="icon-xl bg-primary bg-opacity-10 text-primary rounded-3 mx-auto mb-4">
                                        <i className="bi bi-shield-check fs-3"></i>
                                    </div>
                                    <h3 className="h5 fw-bold mb-3">Bank-Grade Security</h3>
                                    <p className="text-muted mb-0">
                                        Tamper-evident designs with multi-layered protection for valuable contents
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card p-4 p-lg-5 text-center border rounded-3 h-100">
                                    <div className="icon-xl bg-primary bg-opacity-10 text-primary rounded-3 mx-auto mb-4">
                                        <i className="bi bi-speedometer2 fs-3"></i>
                                    </div>
                                    <h3 className="h5 fw-bold mb-3">Operational Efficiency</h3>
                                    <p className="text-muted mb-0">
                                        Streamlined designs that integrate seamlessly with banking workflows
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card p-4 p-lg-5 text-center border rounded-3 h-100">
                                    <div className="icon-xl bg-primary bg-opacity-10 text-primary rounded-3 mx-auto mb-4">
                                        <i className="bi bi-cash-coin fs-3"></i>
                                    </div>
                                    <h3 className="h5 fw-bold mb-3">Cost Optimization</h3>
                                    <p className="text-muted mb-0">
                                        Durable materials reduce replacement costs and logistical expenses
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card p-4 p-lg-5 text-center border rounded-3 h-100">
                                    <div className="icon-xl bg-primary bg-opacity-10 text-primary rounded-3 mx-auto mb-4">
                                        <i className="bi bi-gear-wide-connected fs-3"></i>
                                    </div>
                                    <h3 className="h5 fw-bold mb-3">Custom Solutions</h3>
                                    <p className="text-muted mb-0">
                                        Tailored configurations to meet specific institutional requirements
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Core Values Section */}
                <section className="py-5 py-lg-6">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 text-center">
                                <div className="mb-4">
                                    <Image
                                        src={about3}
                                        alt="Core Values"
                                        width={80}
                                        height={80}
                                        className="rounded-circle shadow-sm"
                                    />
                                </div>
                                <h2 className="fw-bold mb-3">Core Values</h2>
                                <p className="lead text-muted mb-0">
                                    We are committed to operational excellence, continuous improvement, and environmental responsibility, ensuring the longevity and success of our business.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer primary_style={true} />
        </Wrapper>
    );
};

export default AboutPage;