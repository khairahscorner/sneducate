/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/pageTitle";
import { toast } from "react-toastify";
import { Preloader } from "../components/pageloader";
import axiosInstance from "../config/axios";
import { tokenValidSuccess } from "../store/slices/authSlice";
import AdminDashboard from "./admins/dashboard";
import StaffDashboard from "./staffs/dashboard";
import DevDashboard from "./dev/dashboard";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);

  const [initialLoad, setInitialLoad] = useState(false);
  const [userType, setUserType] = useState(type);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!type && token) {
      setInitialLoad(true);
      axiosInstance
        .get("/authenticate")
        .then((res) => {
          setInitialLoad(false);
          setUserType(res.data.user?.userType);
          dispatch(tokenValidSuccess(res.data.user?.userType));
        })
        .catch(() => {
          setInitialLoad(false);
          toast.error("Please login again");
          localStorage.removeItem("token");
          navigate("/");
        });
    }
  }, [type]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <PageTitle title="Dashboard" />
      {initialLoad ? (
        <Preloader />
      ) : (
        <>
          {userType === "school_admin" && <AdminDashboard />}
          {userType === "staff" && <StaffDashboard />}
          {userType === "dev" && <DevDashboard />}
        </>
      )}
    </>
  );
};

export default Dashboard;
