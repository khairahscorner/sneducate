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
import { Controller, useForm } from "react-hook-form";
import { tokenValidSuccess } from "../../store/slices/authSlice";
import { ErrorMessage } from "../../components/error";
import Button from "../../components/button";
import { ReactComponent as BackIcon } from "../../assets/icons/arrow-left.svg";
import { Select } from "../../components/input/select";
import Loader from "../../components/loader";
import { formatDate } from "../../config";
import { Table, TableRow, TableWrapper } from "../../components/table";
import { ReactComponent as StarIcon } from "../../assets/icons/star.svg";
import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";
import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg";
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";
import { Textinput } from "../../components/input/textinput";

const reportTypes = ["student", "metrics"];

const Reports = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);

  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [innerLoading, setInnerLoading] = useState(false);
  const [switchView, setSwitchView] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [staffDetails, setStaffDetails] = useState(null);

  const { handleSubmit, control, reset, setValue } = useForm({
    criteriaMode: "all",
    mode: "onSubmit",
  });
  const [formError, setFormError] = useState(null);

  const [allStudents, setAllStudents] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState({
    value: "",
    label: "",
  });
  const [studentCurriculums, setStudentCurriculums] = useState(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState({
    value: "",
    label: "",
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

    getStaffProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedStudent.value != "") {
      setInnerLoading(true);
      setSelectedCurriculum({
        value: "",
        label: "",
      });
      axiosInstance
        .get(`/curriculums/${selectedStudent?.value}`)
        .then((res) => {
          setInnerLoading(false);
          setStudentCurriculums(res.data.data?.curriculums);
        })
        .catch((err) => {
          setInnerLoading(false);
          setPageError("An error occurred: " + err.response?.data?.message);
          setStudentCurriculums(null);
        });
    }
  }, [selectedStudent]);

  const getStaffProfile = () => {
    setIsLoading(true);
    setPageError(false);
    axiosInstance
      .get("/staff")
      .then((res) => {
        setIsLoading(false);
        setStaffDetails(res.data?.data);
        getAllStudents(res.data?.data?.school_id, res.data?.data?.staff_id);
      })
      .catch((err) => {
        setIsLoading(false);
        setPageError("An error occurred: " + err.response?.data?.message);
      });
  };

  const getAllStudents = (schoolId, staffId) => {
    setIsLoading(true);
    axiosInstance
      .get(`/students/${schoolId}/${staffId}`)
      .then((res) => {
        setIsLoading(false);
        setAllStudents(res.data.data?.students);
      })
      .catch((err) => {
        setIsLoading(false);
        setPageError("An error occurred: " + err.response?.data?.message);
        setAllStudents(null);
      });
  };

  const generateReport = (data) => {
    if (data.type == "student") {
      let details = {
        curriculumId: data.curr,
      };
      setInnerLoading(true);
      axiosInstance
        .post(`/report/student/${data.student}`, details)
        .then((res) => {
          setInnerLoading(false);
          setSwitchView(true);
          setReportDetails(res.data.data);
        })
        .catch((err) => {
          setInnerLoading(false);
          setFormError("An error occurred: " + err.response?.data?.message);
        });
    } else if (data.type == "metrics") {
      setInnerLoading(true);
      axiosInstance
        .get("/report/staff")
        .then((res) => {
          setInnerLoading(false);
          setSwitchView(true);
          setReportDetails(res.data.data);
        })
        .catch((err) => {
          setInnerLoading(false);
          setFormError("An error occurred: " + err.response?.data?.message);
        });
    }
  };

  const restart = () => {
    setSwitchView(false);
    reset();
    setReportDetails(null);
    setSelectedReportType(null);
    setSelectedStudent({
      value: "",
      label: "",
    });
    setSelectedCurriculum({
      value: "",
      label: "",
    });
  };

  return (
    <>
      <PageTitle title="Reports" />
      {initialLoad ? (
        <Preloader />
      ) : (
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
              <div className="px-10">
                <div className="flex flex-wrap justify-between items-center py-14">
                  <h1 className="head-text text-3xl font-medium">Reports</h1>
                </div>
                <div className="grid grid-cols-9 gap-4 mb-20">
                  <div className="col-span-2 py-4 px-6 border border-solid border-gray-200">
                    <h3 className="text-lg font-medium mb-4 flex justify-between items-center">
                      Choose Options
                    </h3>
                    <div className="mt-6">
                      <form onSubmit={handleSubmit(generateReport)}>
                        <ErrorMessage
                          style={{ marginBottom: "30px" }}
                          message={formError}
                        />
                        <div className="mb-4">
                          <Controller
                            name="type"
                            defaultValue=""
                            rules={{ required: true }}
                            control={control}
                            render={({ fieldState: { error } }) => (
                              <>
                                <Select
                                  selectText="Select type:"
                                  label="Report type"
                                  selected={
                                    selectedReportType == "student"
                                      ? "Student Report"
                                      : selectedReportType == "metrics"
                                      ? "Metrics Report"
                                      : ""
                                  }
                                  error={error}
                                  message="Select a type"
                                >
                                  {reportTypes.map((type, i) => (
                                    <div
                                      key={`report-type-${i}`}
                                      onClick={() => {
                                        setSelectedReportType(type);
                                        setValue("type", type);
                                        setSwitchView(false);
                                      }}
                                      className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                                    >
                                      {type == "student"
                                        ? "Student Report"
                                        : "Metrics Report"}
                                    </div>
                                  ))}
                                </Select>
                              </>
                            )}
                          />
                        </div>
                        {selectedReportType == "student" && (
                          <>
                            <div className="mb-4">
                              <Controller
                                name="student"
                                defaultValue=""
                                rules={{ required: true }}
                                control={control}
                                render={({ fieldState: { error } }) => (
                                  <>
                                    <Select
                                      selectText="Select:"
                                      label="Choose student:"
                                      selected={selectedStudent?.label}
                                      error={error}
                                      message="Select a student"
                                    >
                                      {allStudents &&
                                        allStudents.map((student, i) => (
                                          <div
                                            key={`student-${i}`}
                                            onClick={() => {
                                              setSelectedStudent({
                                                value: student.student_id,
                                                label:
                                                  student.first_name +
                                                  " " +
                                                  student.last_name,
                                              });
                                              setValue(
                                                "student",
                                                student.student_id
                                              );
                                              setSwitchView(false);
                                            }}
                                            className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                                          >
                                            {student.first_name +
                                              " " +
                                              student.last_name}
                                          </div>
                                        ))}
                                    </Select>
                                  </>
                                )}
                              />
                            </div>
                            <div className="mb-4">
                              <Controller
                                name="curr"
                                defaultValue=""
                                rules={{ required: true }}
                                control={control}
                                render={({ fieldState: { error } }) => (
                                  <>
                                    <Select
                                      selectText="Select:"
                                      label="Generate for:"
                                      selected={selectedCurriculum?.label}
                                      error={error}
                                      message="Select one"
                                    >
                                      {studentCurriculums &&
                                        studentCurriculums.map((curr, i) => (
                                          <div
                                            key={`student-curr-${i}`}
                                            onClick={() => {
                                              setSelectedCurriculum({
                                                val: curr?.curriculum_id,
                                                label:
                                                  curr.academic_year +
                                                  " " +
                                                  curr.term,
                                              });
                                              setValue(
                                                "curr",
                                                curr.curriculum_id
                                              );
                                              setSwitchView(false);
                                            }}
                                            className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                                          >
                                            {curr.academic_year +
                                              " " +
                                              curr.term}
                                          </div>
                                        ))}
                                    </Select>
                                  </>
                                )}
                              />
                            </div>
                          </>
                        )}
                        <Button
                          click={handleSubmit(generateReport)}
                          extraClasses="w-auto mt-3"
                          size="small"
                        >
                          <span className="text-p1">Generate</span>
                        </Button>
                      </form>
                    </div>
                  </div>
                  <div className="col-span-7 p-4 border border-solid border-gray-200">
                    {switchView ? (
                      <div>
                        <div
                          className="flex cursor-pointer items-center mb-4"
                          onClick={() => restart()}
                        >
                          <div className=" w-5 h-5 has-svg mr-3">
                            <BackIcon />
                          </div>
                          <p className="text-xs text-bold">Back</p>
                        </div>
                        {selectedReportType == "student" ? (
                          <StudentReport reportDetails={reportDetails} />
                        ) : (
                          <GroupReport reportDetails={reportDetails} />
                        )}
                      </div>
                    ) : (
                      <div className="my-20 text-center">
                        Reports generated will appear here
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Layout>

          {innerLoading && (
            <div className="fixed top-0 bottom-0 left-0 right-0 z-20">
              <Loader />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Reports;

const StudentReport = ({ reportDetails }) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-medium">
          Term Report for {reportDetails?.generatedFor}
        </h3>
        <div className="w-4 h-4 ml-1.5 cursor-pointer has-svg">
          <DownloadIcon />
        </div>
      </div>
      <p className="text-p2 mb-4">
        For: <span className="text-bold">{reportDetails?.session}</span>
      </p>
      <div className="border-b w-20 border-neutral-400 mb-4"></div>
      <div className="flex justify-around items-start p-10">
        <div className="mx-6 text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {reportDetails?.stats.goalCount}
          </div>
          <div className="text-black-600 font-medium text-sm mb-2">Goals</div>
        </div>
        <div className="mx-6 text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {reportDetails?.stats.targetCount}
          </div>
          <div className="text-black-600 font-medium text-sm mb-2">Targets</div>
        </div>
        <div className="mx-6 text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {reportDetails?.stats.assessmentCount}
          </div>
          <div className="text-black-600 font-medium text-sm mb-2">
            Assessments
          </div>
        </div>
      </div>
      <div className="border-b border-neutral-200 mb-4"></div>
      {reportDetails?.targets && (
        <div className="grid grid-cols-7 gap-4 my-10">
          <div className="col-span-5">
            {reportDetails?.targets.length > 0 ? (
              <TableWrapper>
                <div className="scroll-table">
                  {reportDetails?.targets.length > 0 ? (
                    <Table className="w-full min-w-700px">
                      <thead>
                        <tr className="row">
                          <th>Focus Area</th>
                          <th>Target</th>
                          <th className="flex items-center">Progress Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportDetails?.targets.map((target, i) => (
                          <TableRow className="p-2 row" key={`target-${i}`}>
                            <td>{target.goalName}</td>
                            <td>{target.title}</td>
                            <td className=" w-28">
                              <div
                                className="flex items-start justify-start"
                                data-tooltip-id="star-rating"
                                data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                                  <div>
                                    {target.success_rating}
                                    %,
                                    {target.success_rating > target.prev_rating
                                      ? ` up from ${target.prev_rating}%`
                                      : target.success_rating <
                                          target.prev_rating &&
                                        ` down from ${target.prev_rating}%`}
                                  </div>
                                )}
                                data-tooltip-place="top"
                              >
                                <Tooltip id="star-rating" />
                                <div
                                  className={`w-7 h-7 has-svg mr-5 ${
                                    target.success_rating > 0
                                      ? "fill-svg"
                                      : null
                                  }`}
                                >
                                  <StarIcon />
                                </div>
                                <div
                                  className={`w-7 h-7 has-svg mr-5 ${
                                    target.success_rating > 34
                                      ? "fill-svg"
                                      : null
                                  }`}
                                >
                                  <StarIcon />
                                </div>
                                <div
                                  className={`w-7 h-7 has-svg mr-5 ${
                                    target.success_rating > 68
                                      ? "fill-svg"
                                      : null
                                  }`}
                                >
                                  <StarIcon />
                                </div>
                              </div>
                            </td>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="no-data">No Targets for this goal.</div>
                  )}
                </div>
              </TableWrapper>
            ) : (
              <div className="p-6 text-center text-bold text-p2">
                No goals and targets in this period.
              </div>
            )}
          </div>
          <div className="border-l border-solid border-gray-200 col-span-2 flex flex-wrap items-center">
            <div className="w-full flex justify-center mb-4">
              <span
                className="w-7 h-7 cursor-pointer has-svg"
                data-tooltip-id="rating-info"
                data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                  <div>
                    **Green: 75% - 100% <br />
                    **Blue: 50% - 74.99%
                    <br />
                    **Yellow: 25% - 49.99%
                    <br />
                    **Red: less than 25% <br />
                    **Grey: ungraded
                  </div>
                )}
                data-tooltip-place="top"
              >
                <InfoIcon />
                <Tooltip id="rating-info" />
              </span>
            </div>
            <div className="text-center mx-auto">
              <div
                className={`text-4xl font-bold mb-3 mx-auto py-2.5 px-3 w-fit ${
                  reportDetails?.currentGrade == "green"
                    ? "bg-rating-green text-black"
                    : reportDetails?.currentGrade == "blue"
                    ? "bg-rating-blue text-white"
                    : reportDetails?.currentGrade == "yellow"
                    ? "bg-rating-yellow text-black"
                    : reportDetails?.currentGrade == "red"
                    ? "bg-rating-red text-white"
                    : "bg-zinc-200 text-black"
                }`}
              >
                {reportDetails?.currentRating}%
              </div>
              <p className="text-black-600 text-xl mb-2">Current Level</p>
            </div>
          </div>
        </div>
      )}
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
        <span className="italic">
          {reportDetails?.generatedBy} at{" "}
          {formatDate(reportDetails?.generatedAt)}
        </span>
      </p>
    </div>
  );
};

const GroupReport = ({ reportDetails }) => {
  const getFraction = (arr) => {
    return Math.round((arr.length / reportDetails.studentCount) * 100);
  };
  return (
    <div>
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-medium">Students Report</h3>
        <div className="w-4 h-4 ml-1.5 cursor-pointer has-svg">
          <DownloadIcon />
        </div>
      </div>
      <p className="text-p2 mb-4">
        For:{" "}
        <span className="text-bold">
          {reportDetails?.studentCount} students
        </span>
      </p>
      <p className="text-p3 my-4 text-gray-400">
        Generated on:{" "}
        <span className="text-bold">
          {formatDate(reportDetails?.generatedAt)}
        </span>
      </p>
      <div className="border-b w-20 border-neutral-400 mb-4"></div>

      <h3 className="text-lg font-medium mb-4 mt-12 flex items-center">
        Evaluation Against IEPs
        <span
          className="w-3 h-3 cursor-pointer has-svg ml-2"
          data-tooltip-id="eval-info"
          data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
            <div>% of students in each category</div>
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
          <div>
            <div className="grid grid-cols-5 border border-t-0 border-solid border-zinc-500">
              <div className="p-4 text-bold bg-rating-green text-black py-2 px-3 border-r last:border-0 border-solid border-zinc-500">
                {getFraction(reportDetails.groups?.greenGroup)}%
              </div>
              <div className="p-4 text-bold bg-rating-blue text-white py-2 px-3 border-r last:border-0 border-solid border-zinc-500">
                {getFraction(reportDetails.groups?.blueGroup)}%
              </div>
              <div className="p-4 text-bold bg-rating-yellow text-black py-2 px-3 border-r last:border-0 border-solid border-zinc-500">
                {getFraction(reportDetails.groups?.yellowGroup)}%
              </div>
              <div className="p-4 text-bold bg-rating-red text-white py-2 px-3 border-r last:border-0 border-solid border-zinc-500">
                {getFraction(reportDetails.groups?.redGroup)}%
              </div>
              <div className="p-4 text-bold bg-zinc-400 text-white py-2 px-3 border-r last:border-0 border-solid border-zinc-500">
                {getFraction(reportDetails.groups?.ungraded)}%
              </div>
            </div>
          </div>
        </div>
      </TableWrapper>

      {reportDetails.studentCount > 0 && (
        <>
          <div className="grid grid-cols-4 gap-8 mt-16 mb-8">
            {reportDetails.groups?.greenGroup.length > 0 && (
              <div>
                <p className="w-fit text-p3 text-bold rounded bg-rating-green p-2 mb-4 mx-auto">
                  75% - 100%
                </p>
                <table className="overview w-full border-collapse border-spacing-0">
                  <tbody className=" bg-transparent">
                    {reportDetails.groups?.greenGroup.map((student, i) => (
                      <tr key={i}>
                        <td className="text-bold whitespace-nowrap">
                          {student.studentName}
                        </td>
                        <td>{student.rating}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {reportDetails.groups?.blueGroup.length > 0 && (
              <div>
                <p className="w-fit text-p3 text-bold rounded bg-rating-blue text-white p-2 mb-4 mx-auto">
                  50% - 74.99%
                </p>
                <table className="overview w-full border-collapse border-spacing-0">
                  <tbody className=" bg-transparent">
                    {reportDetails.groups?.blueGroup.map((student, i) => (
                      <tr key={i}>
                        <td className="text-bold whitespace-nowrap">
                          {student.studentName}
                        </td>
                        <td>{student.rating}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {reportDetails.groups?.yellowGroup.length > 0 && (
              <div>
                <p className="w-fit text-p3 text-bold rounded bg-rating-yellow p-2 mb-4 mx-auto">
                  25% - 49.99%
                </p>
                <table className="overview w-full border-collapse border-spacing-0">
                  <tbody className=" bg-transparent">
                    {reportDetails.groups?.yellowGroup.map((student, i) => (
                      <tr key={i}>
                        <td className="text-bold whitespace-nowrap">
                          {student.studentName}
                        </td>
                        <td>{student.rating}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {reportDetails.groups?.redGroup.length > 0 && (
              <div>
                <p className="w-fit text-p3 text-bold rounded bg-rating-red text-white p-2 mb-4 mx-auto">
                  0% - 24.99%
                </p>
                <table className="overview w-full border-collapse border-spacing-0">
                  <tbody className=" bg-transparent">
                    {reportDetails.groups?.redGroup.map((student, i) => (
                      <tr key={i}>
                        <td className="text-bold whitespace-nowrap">
                          {student.studentName}
                        </td>
                        <td>{student.rating}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
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
      <div className="border-b border-neutral-200"></div>
      <p className="text-p4 mt-2 mb-4 text-gray-400">
        Generated by:{" "}
        <span className="italic">{reportDetails?.generatedBy}</span>
      </p>
    </div>
  );
};
