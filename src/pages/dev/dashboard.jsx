import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/pageTitle";
import Layout from "../../components/layout";
import { toast } from "react-toastify";
import { Preloader } from "../../components/pageloader";
import axiosInstance from "../../config/axios";
import { tokenValidSuccess } from "../../store/slices/authSlice";
import Loader from "../../components/loader";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);

  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const [statsError, setStatsError] = useState(false);
  const [stats, setStats] = useState({
    staff: 0,
    students: 0,
    schools: 0,
  });

  const getStats = () => {
    setIsLoading(true);
    axiosInstance
      .get("/schools")
      .then((res) => {
        let schoolCount = res.data.data?.count;
        axiosInstance.get("/staffs").then((res) => {
          let staffCount = res.data.data?.count;
          axiosInstance.get("/students").then((res) => {
            let studentCount = res.data.data?.count;
            setStats({
              staff: staffCount,
              students: studentCount,
              schools: schoolCount,
            });
            setIsLoading(false);
          });
        });
      })
      .catch(() => {
        setIsLoading(false);
        setStatsError(true);
      });
  };

  return (
    <>
      <PageTitle title="Dashboard" />
      {initialLoad ? (
        <Preloader />
      ) : (
        <Layout userType={userType}>
          <div className="flex flex-wrap justify-between items-center">
            <h1 className="head-text text-3xl font-medium">
              Hello!
              {/* <span className="name capitalize">User</span> */}
            </h1>
          </div>
          {isLoading ? (
            <div className="p-8 mt-20">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 mt-12">
              <div className="bg-white rounded-md shadow-md">
                <div className="p-6">
                  <div className="text-black-600 font-medium text-sm mb-2">
                    Schools
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    {stats.schools || 0}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-md shadow-md">
                <div className="p-6">
                  <div className="text-black-600 font-medium text-sm mb-2">
                    Staff
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    {stats.staff || 0}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-md shadow-md">
                <div className="p-6">
                  <div className="text-black-600 font-medium text-sm mb-2">
                    Students
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    {stats.students || 0}
                  </div>
                </div>
              </div>
              {statsError && (
                <p className="w-full text-center my-4">
                  Could not complete request.
                </p>
              )}
            </div>
          )}
        </Layout>
      )}
    </>
  );
};

export default Dashboard;
