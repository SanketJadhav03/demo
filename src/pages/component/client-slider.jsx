import AuthUser from '@/auth/authuser'
import { ShapeLineSm } from '@/svg'
import React, { useEffect, useState } from 'react' 
import Link from "next/link";
import { IMG_URL } from '@/url_helper';
const ClientSlider = () => { 

  const { http } = AuthUser();
  const [ClientData, setClientData] = useState([]);
  

  const getAllClients = async () => {
    try {
      const res = await http.get("/ourClient/list");
      setClientData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllClients();
  }, []);

  return (
    <div>
      <div className="container tp-product-area pd-10 pt-10">
        <div className="row align-items-end">
          <div className="col-xl-4 col-md-6">
            <div className="tp-section-title-wrapper mb-50">
              <h3 className="tp-section-title">
                Our Clients
                <ShapeLineSm />
              </h3>
            </div>
          </div>
        </div>

        <div className="row">
          <marquee behavior="scroll" direction="left" scrollamount={10}>
            {ClientData?.map((client, index) => (
              <Link href={client.ourClient_img || "#"} target="_blank" key={index}>
                <img
                  src={`${IMG_URL}/ourClients/${client.ourClient_img}`}
                  alt={`client-${index}`}
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

export default ClientSlider;
