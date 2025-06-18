import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import Link from "next/link";
import { FaBalanceScale, FaTruck, FaRupeeSign, FaShieldAlt, FaFileContract } from "react-icons/fa";

const TermsAndConditions = () => {
    return (
        <Wrapper>
            <SEO 
                pageTitle="Terms and Conditions | Sai Suppliers" 
                description="Legal terms governing your use of Sai Suppliers' products and services including ordering, payments, delivery and warranties for gold loan envelopes."
            />
            <HeaderTwo style_2={true} />

            <main className="terms-page py-5 py-lg-6">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="text-center mb-5">
                                <div className="icon-xl bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4">
                                    <FaBalanceScale size={28} />
                                </div>
                                <h1 className="display-5 fw-bold text-primary mb-3">Terms and Conditions</h1>
                                <p className="lead text-muted">
                                    Last Updated: {new Date().toLocaleDateString('en-IN')}
                                </p>
                            </div>

                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-lg-5">
                                    {/* Introduction */}
                                    <section className="mb-5">
                                        <h2 className="h3 fw-bold mb-3">1. Agreement to Terms</h2>
                                        <p className="text-muted">
                                            By accessing or using Sai Suppliers' products and services, you agree to be bound by these Terms. If you disagree, please refrain from using our services.
                                        </p>
                                    </section>

                                    {/* Products */}
                                    <section className="mb-5">
                                        <h2 className="h3 fw-bold mb-3 d-flex align-items-center">
                                           
                                            2. Product Specifications
                                        </h2>
                                        <div className="bg-light px-5 py-3 rounded-3">
                                            <ul className="text-muted">
                                                <li className="mb-2">
                                                    <strong>Gold Loan Envelopes:</strong> Manufactured as per RBI guidelines with tamper-evident features
                                                </li>
                                                <li className="mb-2">
                                                    <strong>Custom Orders:</strong> Require written specifications and advance payment
                                                </li>
                                                <li>
                                                    <strong>Quality Assurance:</strong> Each batch undergoes 3-stage quality checks
                                                </li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Ordering Process */}
                                    <section className="mb-5">
                                        <h2 className="h3 fw-bold mb-3 mt-3">3. Ordering & Payments</h2>
                                        <div className="row g-3 mb-4">
                                            <div className="col-md-6">
                                                <div className="border p-3 rounded-3 h-100">
                                                    <h3 className="h5 fw-bold mb-3 d-flex align-items-center">
                                                        <FaRupeeSign className="me-2 text-primary" />
                                                        Payment Terms
                                                    </h3>
                                                    <ul className="text-muted small px-4">
                                                        <li className="mb-2">50% advance for custom orders</li>
                                                        <li className="mb-2">Balance before shipment</li>
                                                        <li>GST invoice provided</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="border p-3 rounded-3 h-100">
                                                    <h3 className="h5 fw-bold mb-3 d-flex align-items-center">
                                                        <FaShieldAlt className="me-2 text-primary" />
                                                        Pricing
                                                    </h3>
                                                    <ul className="text-muted small px-4">
                                                        <li className="mb-2">Prices in Indian Rupees (₹)</li>
                                                        <li className="mb-2">Valid for 30 days from quote</li>
                                                        <li>Bulk discounts available</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Delivery */}
                                    <section className="mb-5">
                                        <h2 className="h3 fw-bold mb-3 d-flex align-items-center">
                                            <span className="icon-sm bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center me-3">
                                                <FaTruck />
                                            </span>
                                            4. Delivery Policy
                                        </h2>
                                        <div className="alert alert-warning bg-warning bg-opacity-10">
                                            <strong>Important:</strong> Customers must inspect products within 48 hours of delivery and report any discrepancies immediately.
                                        </div>
                                        <div className="row g-2 mt-3">
                                            <div className="col-md-4">
                                                <div className="border p-2 rounded-2 text-center">
                                                    <small className="d-block fw-bold">Standard Delivery</small>
                                                    <span className="text-primary">7-10 working days</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="border p-2 rounded-2 text-center">
                                                    <small className="d-block fw-bold">Shipping</small>
                                                    <span className="text-primary">Pan-India via FedEx</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="border p-2 rounded-2 text-center">
                                                    <small className="d-block fw-bold">Custom Orders</small>
                                                    <span className="text-primary">+3-5 days</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Returns */}
                                    <section className="mb-5">
                                        <h2 className="h3 fw-bold mb-3 mt-3">5. Returns & Warranty</h2>
                                        <div className="bg-light p-3 rounded-3">
                                            <h3 className="h5 fw-bold mb-2">Defective Products</h3>
                                            <p className="text-muted small">
                                                We replace manufacturing defects reported within 7 days with photographic evidence. Does not cover damage from improper use.
                                            </p>
                                            <h3 className="h5 fw-bold mb-2 mt-3">Wrong Shipments</h3>
                                            <p className="text-muted small">
                                                We'll arrange return shipping for incorrect items and dispatch correct products within 3 working days.
                                            </p>
                                        </div>
                                    </section>

                                    {/* Intellectual Property */}
                                    <section className="mb-5">
                                        <h2 className="h3 fw-bold mb-3 mt-3">6. Intellectual Property</h2>
                                        <p className="text-muted">
                                            All product designs, specifications, and proprietary information remain the exclusive property of Sai Suppliers. Unauthorized reproduction is prohibited under Indian copyright laws.
                                        </p>
                                    </section>

                                    {/* Limitation of Liability */}
                                    <section className="mb-5">
                                        <h2 className="h3 fw-bold mb-3 mt-3">7. Limitation of Liability</h2>
                                        <div className="bg-light p-3 rounded-3">
                                            <p className="text-muted mb-2">
                                                Sai Suppliers shall not be liable for:
                                            </p>
                                            <ul className="text-muted">
                                                <li className="mb-2">Consequential damages from product use</li>
                                                <li className="mb-2">Delays due to force majeure (natural disasters, strikes, etc.)</li>
                                                <li>Misuse or unauthorized alterations</li>
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Governing Law */}
                                    <section className="mb-5">
                                        <h2 className="h3 fw-bold mb-3 mt-3">8. Governing Law</h2>
                                        <p className="text-muted">
                                            These Terms shall be governed by Indian law. Any disputes shall be subject to the exclusive jurisdiction of courts in <strong>Satara, Maharashtra</strong>.
                                        </p>
                                    </section>

                                    {/* Contact */}
                                    <section className="bg-light bg-opacity-05 p-4 rounded-3">
                                        <h2 className="h3 fw-bold mb-3">Contact Us</h2>
                                        <p className="text-muted mb-1">
                                            <strong>Email:</strong> <Link href="mailto:Kiran.mahamuni@saisuppliers.com">Kiran.mahamuni@saisuppliers.com</Link>
                                        </p>
                                        <p className="text-muted">
                                            <strong>Address:</strong> 
                                            <p>
                            <Link href="https://maps.google.com?q=265+Kasba+Peth+Shankar+Market+road,+Phaltan+Dist.+Satara+415523" target="_blank">
                              265 Kasba Peth,<br />
                              Shankar Market Road,<br />
                              Phaltan, Dist. Satara – 415523
                            </Link>
                          </p>
                                        </p>
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

export default TermsAndConditions;