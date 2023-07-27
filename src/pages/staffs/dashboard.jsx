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
  const [staffDetails, setStaffDetails] = useState(null);

  useEffect(() => {
    getStaffProfile();
  }, []);

  const getStaffProfile = () => {
    setIsLoading(true);
    axiosInstance
      .get("/staff")
      .then((res) => {
        console.log(res.data);
        setStaffDetails(res.data?.data);
        axiosInstance
          .get(`/school/${res.data?.data?.school_id}`)
          .then((response) => {
            setIsLoading(false);
            setStaffDetails((details) => ({
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
  return (
    <>
      <Layout userType="staff">
        {isLoading ? (
          <Preloader />
        ) : pageError ? (
          <p className="w-full text-center my-4 p-5">
            Could not complete request.
          </p>
        ) : (
          <>
            <div className="bg-zinc-100 border-b border-gray-200 p-5 flex items-center justify-end pr-9">
              <p className="text-bold mr-2 capitalize">
                {staffDetails?.school_name}
              </p>
              <span className="px-1.5 py-0.5 rounded-full text-bold text-white text-p4 bg-status-good">
                {staffDetails?.role}
              </span>
            </div>

            <div className="flex flex-wrap justify-between items-center py-14 px-10">
              <h1 className="head-text text-3xl font-medium">
                Welcome,
                <span className="text-2xl capitalize">
                  {" "}
                  {staffDetails?.first_name} {staffDetails?.last_name}
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
