/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout";
import { Preloader } from "../../components/pageloader";
import axiosInstance from "../../config/axios";
// import { toast } from "react-toastify";
// import { Preloader } from "../../components/pageloader";
// import axiosInstance from "../../config/axios";
// import { tokenValidSuccess } from "../../store/slices/authSlice";
// import Loader from "../../components/loader";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);

  useEffect(() => {
    getAdminProfile();
  }, []);

  const getAdminProfile = () => {
    setIsLoading(true);
    axiosInstance
      .get("/admin")
      .then((res) => {
        console.log(res.data);
        setAdminDetails(res.data?.data);
        axiosInstance
          .get(`/school/${res.data?.data?.school_id}`)
          .then((response) => {
            setIsLoading(false);
            setAdminDetails((details) => ({
              ...details,
              school_name: response.data?.data?.name,
            }));
          });
      })
      .catch(() => {
        setIsLoading(false);
        setPageError(true);
      });
  };

  const openGuide = () => {
    alert("opens");
  };

  return (
    <>
      <Layout userType="school_admin">
        {isLoading ? (
          <Preloader />
        ) : pageError ? (
          <p className="w-full text-center my-4 p-5">
            Could not complete the request.
          </p>
        ) : (
          <>
            <div className="bg-zinc-100 border-b border-gray-200 p-5 flex items-center justify-between flex-row-reverse pr-9">
              <div className=" flex items-center">
                <p className="text-bold mr-2 capitalize">
                  {adminDetails?.school_name}
                </p>
                <span className="px-1.5 py-0.5 rounded-full text-bold text-white text-p4 bg-status-good">
                  {adminDetails?.role}
                </span>
              </div>
              <div>
                <span
                  onClick={() => openGuide()}
                  className="px-3 py-2 cursor-pointer rounded-xl text-bold text-type text-p3 bg-primary-bg"
                >
                  Guide⭐️
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center py-14 px-10">
              <h1 className="head-text text-3xl font-medium">
                Welcome,
                <span className="text-2xl capitalize">
                  {" "}
                  {adminDetails?.first_name} {adminDetails?.last_name}
                </span>
              </h1>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default Dashboard;
