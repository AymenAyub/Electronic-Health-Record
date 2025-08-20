"use client";

import { useEffect, useState, use } from "react";

export default function HospitalHomePage({ params }: { params: Promise<{ hospitalSubdomain: string }> }) {
  const { hospitalSubdomain } = use(params);
  const [hospital, setHospital] = useState<any>(null); 

  useEffect(() => {
    fetch(`http://localhost:5000/api/hospital/getBySubdomain/${hospitalSubdomain}`)
      .then(res => res.json())
      .then(data => setHospital(data.hospital))
      .catch(err => console.error("Error fetching hospital:", err));
  }, [hospitalSubdomain]);

  if (!hospital) return <div>Loading hospital info...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{hospital.name}</h1>
      <p>Email: {hospital.email}</p>
      <p>Address: {hospital.address}</p>
    </div>
  );
}
