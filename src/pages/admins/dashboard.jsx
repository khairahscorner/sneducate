/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import { Preloader } from "../../components/pageloader";
import axiosInstance from "../../config/axios";

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
        setIsLoading(false);
        setAdminDetails(res.data?.data);
      })
      .catch(() => {
        setIsLoading(false);
        setPageError(true);
      });
  };

  return (
    <>
      <Layout
        userType="school_admin"
        userDetails={{
          schoolName: adminDetails?.schoolDetails?.name,
          role: adminDetails?.role,
        }}
      >
        {isLoading ? (
          <Preloader />
        ) : pageError ? (
          <p className="w-full text-center my-4 p-5">
            Could not complete the request.
          </p>
        ) : (
          <>
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
