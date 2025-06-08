import React from 'react';

const ContactMap = () => {
  return (
    <>
      <section className="tp-map-area pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-map-wrapper">
                <div className="tp-map-hotspot">
                  <span className="tp-hotspot tp-pulse-border">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="6" cy="6" r="6" fill="#821F40" />
                    </svg>
                  </span>
                </div>
                <div className="tp-map-iframe">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d968502.2124057292!2d72.64022827148436!3d18.519330070743504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c10077c230ed%3A0x735448f59ded4a14!2sKasba%20Peth!5e0!3m2!1sen!2sin!4v1748748150574!5m2!1sen!2sin"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactMap;