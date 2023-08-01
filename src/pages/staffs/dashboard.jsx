/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout";
import { Preloader } from "../../components/pageloader";
import axiosInstance from "../../config/axios";

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
        setIsLoading(false);
        setStaffDetails(res.data?.data);
      })
      .catch(() => {
        setIsLoading(false);
        setPageError(true);
      });
  };

  return (
    <>
      <Layout
        userType="staff"
        userDetails={{
          schoolName: staffDetails?.schoolDetails?.name,
          role: staffDetails?.position,
        }}
      >
        {isLoading ? (
          <Preloader />
        ) : pageError ? (
          <p className="w-full text-center my-4 p-5">
            Could not complete request.
          </p>
        ) : (
          <>
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
