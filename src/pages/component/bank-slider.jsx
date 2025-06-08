import AuthUser from '@/auth/authuser'
import { ArrowRightLong, ShapeLine, ShapeLineSm } from '@/svg'
import React, { useEffect, useState } from 'react'
import Link from "next/link"; 
const BankSlider = () => {
  const IMG_URL = process.env.NEXT_PUBLIC_IMG_URL;
  
  const { http } = AuthUser();
  const [ClientData, setClientData] = useState([]);
  

  const getAllClients = async () => {
    try {
      const res = await http.get("/ourBank/list");
      setClientData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllClients();
  }, []);

  return (
    <div className='pt-10'>
      <div className="container tp-product-area pd-10 pt-10">
        <div className="row align-items-end">
          <div className="col-xl-4 col-md-6">
            <div className="tp-section-title-wrapper mb-50">
              <h3 className="tp-section-title">
                Our Banks
                <ShapeLineSm />
              </h3>
            </div>
          </div>
        </div>

        <div className="row">
          <marquee behavior="scroll" direction="right" scrollamount={10}>
            {ClientData?.map((client, index) => (
              <Link href={client.link || "#"} target="_blank" key={index}>
                <img
                  src={`${IMG_URL}/ourBanks/${client.ourBank_img}`}
                  alt={`bank-${index}`}
                  height="150px"
                  width="300px"
                  className="ms-5"
                />
              </Link>
            ))}
          </marquee>
        </div>
      </div>
    </div>
  );
};

export default BankSlider;
