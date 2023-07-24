/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/pageTitle";
import Layout from "../components/layout";
import { toast } from "react-toastify";
import { Preloader } from "../components/pageloader";
import axiosInstance from "../config/axios";

const Dashboard = () => {
  const [initialLoad, setInitialLoad] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setInitialLoad(true);
    axiosInstance
      .get("/authenticate")
      .then((res) => {
        setInitialLoad(false);
        setUserType(res.data.user?.userType);
      })
      .catch(() => {
        setInitialLoad(false);
        toast.error("Please login again");
        localStorage.removeItem("token");
        navigate("/");
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageTitle title="Dashboard" />
      {initialLoad ? (
        <Preloader />
      ) : (
        <Layout userType={userType}>
          <div className="flex flex-wrap justify-between items-center">
            <h1 className="head-text text-3xl font-medium">
              <span className="text-h3 mr-2.5" role="img">
                🤑
              </span>{" "}
              Hi <span className="name capitalize">User</span>
            </h1>
          </div>
        </Layout>
      )}
    </>
  );
};

export default Dashboard;
