/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import { Tooltip } from "react-tooltip";
import Layout from "../../components/layout";
import { Preloader } from "../../components/pageloader";
import axiosInstance from "../../config/axios";
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  Tooltip as chartTooltip,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { TableWrapper } from "../../components/table";

ChartJS.register(ArcElement, chartTooltip, Legend);
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [staffDetails, setStaffDetails] = useState(null);
  const [statsDetails, setStatsDetails] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getStaffProfile();
  }, []);

  const getStaffProfile = () => {
    setIsLoading(true);
    axiosInstance
      .get("/staff")
      .then((res) => {
        // setIsLoading(false);
        setStaffDetails(res.data?.data);
        getStats();
      })
      .catch(() => {
        setIsLoading(false);
        setPageError(true);
      });
  };

  const getStats = () => {
    setIsLoading(true);
    axiosInstance
      .get("/dashboard/staff")
      .then((res) => {
        setIsLoading(false);
        setStatsDetails(res.data?.data);
        let arr = res.data?.data?.gradeCounts;
        setChartData([arr.green, arr.blue, arr.yellow, arr.red, arr.null]);
      })
      .catch(() => {
        setIsLoading(false);
        setPageError(true);
      });
  };

  const data = {
    labels: [
      "Exceeded targets",
      "On target",
      "Just below target",
      "Below target",
      "Not graded",
    ],
    datasets: [
      {
        label: "Student performance",
        data: chartData,
        backgroundColor: [
          "#4EC043",
          "#0048E8",
          "#ecc52c",
          "#E81010",
          "#899598",
        ],
        borderWidth: 1,
      },
    ],
  };

  const getFraction = (val) => {
    return Math.round((val / statsDetails?.studentCount) * 100);
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
            <div className="grid grid-cols-12 gap-4 mb-20 mx-10">
              <div className="col-span-9 p-4 border border-solid border-gray-200">
                <div className="grid grid-cols-4 gap-4 mt-12">
                  <div className="bg-white rounded-md shadow-md">
                    <div className="p-6">
                      <div className="text-black-600 text-medium text-sm mb-2">
                        Students
                      </div>
                      <div className="text-4xl font-bold text-primary">
                        {statsDetails?.studentCount || 0}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md shadow-md">
                    <div className="p-6">
                      <div className="text-black-600 text-medium text-sm mb-2">
                        Term Curriculums
                      </div>
                      <div className="text-4xl font-bold text-primary">
                        {statsDetails?.curriculumCount || 0}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md shadow-md">
                    <div className="p-6">
                      <div className="text-black-600 text-medium text-sm mb-2">
                        Assessments
                      </div>
                      <div className="text-4xl font-bold text-primary">
                        {statsDetails?.assessmentCount || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4 mt-12 flex items-center">
                    Student Performance Evaluation
                    <span
                      className="w-3 h-3 cursor-pointer has-svg ml-2"
                      data-tooltip-id="eval-info"
                      data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                        <div>% number of students in each category</div>
                      )}
                      data-tooltip-place="right"
                    >
                      <InfoIcon />
                      <Tooltip id="eval-info" />
                    </span>
                  </h3>
                  <TableWrapper>
                    <div className="w-full">
                      <div className="border border-solid border-zinc-500 bg-zinc-200 grid grid-cols-5">
                        <div className="p-4 col-span-1 whitespace-nowrap border-r last:border-0 border-solid border-zinc-500">
                          Exceeded Targets
                        </div>
                        <div className="p-4 col-span-1 whitespace-nowrap border-r last:border-0 border-solid border-zinc-500">
                          On Targets
                        </div>
                        <div className="p-4 col-span-1 whitespace-nowrap border-r last:border-0 border-solid border-zinc-500">
                          Just Below Targets
                        </div>
                        <div className="p-4 col-span-1 whitespace-nowrap border-r last:border-0 border-solid border-zinc-500">
                          Below Targets
                        </div>
                        <div className="p-4 col-span-1 whitespace-nowrap border-r last:border-0 border-solid border-zinc-500">
                          Ungraded
                        </div>
                      </div>
                      {statsDetails && (
                        <div>
                          <div className="grid grid-cols-5 border border-t-0 border-solid border-zinc-500">
                            <div className="p-4 text-bold bg-rating-green text-black py-2 px-3 border-r last:border-0 border-solid border-zinc-500">
                              {getFraction(statsDetails?.gradeCounts?.green)}%
                            </div>
                            <div className="p-4 text-bold bg-rating-blue text-white py-2 px-3 border-r last:border-0 border-solid border-zinc-500">
                              {getFraction(statsDetails.gradeCounts?.blue)}%
                            </div>
                            <div className="p-4 text-bold bg-rating-yellow text-black py-2 px-3 border-r last:border-0 border-solid border-zinc-500">
                              {getFraction(statsDetails.gradeCounts?.yellow)}%
                            </div>
                            <div className="p-4 text-bold bg-rating-red text-white py-2 px-3 border-r last:border-0 border-solid border-zinc-500">
                              {getFraction(statsDetails.gradeCounts?.red)}%
                            </div>
                            <div className="p-4 text-bold bg-zinc-400 text-white py-2 px-3 border-r last:border-0 border-solid border-zinc-500">
                              {getFraction(statsDetails.gradeCounts?.null)}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TableWrapper>
                </div>
              </div>
              <div className="col-span-3 py-4 border border-solid border-gray-200">
                <h3 className="text-lg font-medium mb-4 mt-12 px-2 flex items-center">
                  Student Performance Chart
                </h3>
                {statsDetails?.studentCount > 0 && <Pie data={data} />}
              </div>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default Dashboard;
