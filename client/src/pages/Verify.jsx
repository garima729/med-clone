import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Verify = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`/auth/verify/${id}`);
        setMessage(res.data);
      } catch (err) {
        setMessage("Verification failed or already verified.");
      }
    };
    verifyEmail();
  }, [id]);

  return <div>{message}</div>;
};

export default Verify;
