/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../components/pageTitle";
import { Preloader } from "../../components/pageloader";
import Layout from "../../components/layout";
import axiosInstance from "../../config/axios";
import { tokenValidSuccess } from "../../store/slices/authSlice";
import Button from "../../components/button";
import { captureAndDownloadPDF, formatDate } from "../../config";
import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";
import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg";
import { Textinput } from "../../components/input/textinput";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as chartTooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  chartTooltip,
  Legend
);

const Reports = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);

  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);

  const [reportDetails, setReportDetails] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!type && token) {
      setInitialLoad(true);
      axiosInstance
        .get("/authenticate")
        .then((res) => {
          setInitialLoad(false);
          dispatch(tokenValidSuccess(res.data.user?.userType));
        })
        .catch(() => {
          setInitialLoad(false);
          toast.error("Please login again");
          localStorage.removeItem("token");
          navigate("/");
        });
    }

    getAdminProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reportDetails) {
      setChartData({
        labels: ["Green", "Blue", "Yellow", "Red", "Ungraded"],
        data: [
          reportDetails.groups?.blueGroup.length,
          reportDetails.groups?.greenGroup.length,
          reportDetails.groups?.yellowGroup.length,
          reportDetails.groups?.redGroup.length,
          reportDetails.groups?.ungraded.length,
        ],
      });
    }
  }, [reportDetails]);

  const getAdminProfile = () => {
    setIsLoading(true);
    setPageError(false);
    axiosInstance
      .get("/admin")
      .then((res) => {
        setAdminDetails(res.data?.data);
        generateReport();
      })
      .catch(() => {
        setIsLoading(false);
        setPageError(true);
      });
  };

  const generateReport = () => {
    setIsLoading(true);
    axiosInstance
      .get("/report/school")
      .then((res) => {
        setIsLoading(false);
        setReportDetails(res.data.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setPageError("An error occurred: " + err.response?.data?.message);
      });
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Number of students",
        data: chartData.data,
        backgroundColor: [
          "#4EC043",
          "#0048E8",
          "#ffcb00",
          "#E81010",
          "#899598",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <PageTitle title="School Report" />
      {initialLoad ? (
        <Preloader />
      ) : (
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
                Could not complete request.
              </p>
            ) : (
              <div className="px-10">
                {reportDetails && (
                  <ReportView
                    reportDetails={reportDetails}
                    data={data}
                    chartData={chartData}
                  />
                )}
              </div>
            )}
          </Layout>
        </>
      )}
    </>
  );
};

export default Reports;

const ReportView = ({ reportDetails, data, chartData }) => {
  return (
    <div className="report-container">
      <div className="w-full p-4 my-20 border border-solid border-gray-200">
        <div>
          <div>
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-medium">
                {new Date().getUTCFullYear()} School Report
              </h3>
              <div
                className="w-4 h-4 ml-1.5 cursor-pointer has-svg"
                onClick={() => captureAndDownloadPDF("school-report.pdf")}
              >
                <DownloadIcon />
              </div>
            </div>
            <p className="text-p2 mb-4">
              Created on:{" "}
              <span className="text-bold">
                {formatDate(reportDetails?.generatedAt)}
              </span>
            </p>
            <div className="border-b w-20 border-neutral-400 mb-4"></div>
            <div className="flex justify-around items-start p-10">
              <div className="mx-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {reportDetails?.staffCount}
                </div>
                <div className="text-black-600 font-medium text-sm mb-2">
                  Staff
                </div>
              </div>
              <div className="mx-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {reportDetails?.totalStudentCount}
                </div>
                <div className="text-black-600 font-medium text-sm mb-2">
                  Students
                </div>
              </div>
            </div>
            <div className="border-b border-neutral-200 mb-4"></div>
            <h3 className="text-lg font-medium mb-4 mt-12 flex items-center">
              Students Chart
              <span
                className="w-3 h-3 cursor-pointer has-svg ml-2"
                data-tooltip-id="eval-info"
                data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                  <div>Number of students in each grade category</div>
                )}
                data-tooltip-place="right"
              >
                <InfoIcon />
                <Tooltip id="eval-info" />
              </span>
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="col-span-2">
                <Bar
                  data={data}
                  height={"300px"}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        grid: { display: false },
                        max: Math.max(...chartData.data) * 1.2,
                      },
                    },
                  }}
                />
              </div>
              <div className="col-span-1 mx-5">
                <h4 className="text-bold text-p2 mb-2 mt-12">
                  • Color-coded Categories Explained
                </h4>
                <p className="italic text-p3 text-zinc-400 mb-4">
                  progress level of students in evaluation with goals and
                  targets defined in their IEPs.
                </p>
                <p className="mb-4 w-28 whitespace-nowrap p-4 text-p3 text-bold text-center rounded-md bg-rating-green p-2mx-auto">
                  75% - 100%
                </p>
                <p className="mb-4 w-28 whitespace-nowrap p-4 text-p3 text-bold text-center rounded-md bg-rating-blue text-white p-2mx-auto">
                  50% - 74.99%
                </p>
                <p className="mb-4 w-28 whitespace-nowrap p-4 text-p3 text-bold text-center rounded-md bg-rating-yellow p-2mx-auto">
                  25% - 49.99%
                </p>
                <p className="mb-4 w-28 whitespace-nowrap p-4 text-p3 text-bold text-center rounded-md bg-rating-red text-white p-2mx-auto">
                  0% - 24.99%
                </p>
                <p className="mb-4 w-28 whitespace-nowrap p-4 text-p3 text-bold text-center rounded-md bg-zinc-200 p-2mx-auto">
                  Ungraded
                </p>
              </div>
            </div>
            <div className="flex items-center ml-2 pt-7 mb-8">
              <Textinput
                value=""
                onChange={() => {}}
                label="Send to:"
                inputid="out_email"
                name="out_email"
                type="email"
                placeholder="email@email.com"
                rowType
              />
              <Button type="primary" extraClasses="w-auto ml-3 p-0" size="big">
                <div className=" w-5 h-5 cursor-pointer has-svg">
                  <SendIcon />
                </div>
              </Button>
            </div>
            <div className="border-b border-neutral-200 my-6"></div>
            <p className="text-p4 my-4 text-gray-400">
              Generated by:{" "}
              <span className="italic">{reportDetails?.generatedBy}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
