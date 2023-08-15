/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import PageTitle from "../../components/pageTitle";
import { Preloader } from "../../components/pageloader";
import Loader from "../../components/loader";
import Layout from "../../components/layout";
import axiosInstance from "../../config/axios";
import { Controller, useForm } from "react-hook-form";
import { tokenValidSuccess } from "../../store/slices/authSlice";
import { ErrorMessage } from "../../components/error";
import { Textinput } from "../../components/input/textinput";
import {
  customStyles,
  generateTermOptions,
  schoolTerms,
  schoolYears,
} from "../../config";
import Button from "../../components/button";
import { Table, TableWrapper, TableRow } from "../../components/table";
import CustomModal from "../../components/modals/modal";
import { Closeicon } from "../../assets/icons/closeicon";
import { ArrowdownIcon } from "../../assets/icons/arrowdown";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";
import { ReactComponent as StarIcon } from "../../assets/icons/star.svg";
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";
import { Select } from "../../components/input/select";
import { Placeholder } from "../../components/placeholder";
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

const TermCurriculums = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);
  const [allVisible, setAllVisible] = useState([]);

  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [staffDetails, setStaffDetails] = useState(null);
  const [stats, setStats] = useState({
    currs: 0,
    goals: 0,
    targets: 0,
  });

  const { handleSubmit, control, reset, setValue } = useForm({
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const [allStudents, setAllStudents] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clickAddTarget, setClickAddTarget] = useState(false);
  const [isUpdateTargetModalOpen, setIsUpdateTargetModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [curriculumSelect, setCurriculumSelect] = useState({
    val: "",
    label: "",
    curr: "",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentCurriculums, setSelectedStudentCurriculums] =
    useState(null);
  const [assignedGoal, setAssignedGoal] = useState({
    val: "",
    label: "",
  });
  const [newCurrDetails, setNewCurrDetails] = useState({
    year: "",
    term: "",
    curr: "",
  });

  const [selectedCurr, setSelectedCurr] = useState(null);
  const [currTarget, setCurrTarget] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
  });

  const [formError, setFormError] = useState(null);

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
    if (isUpdateTargetModalOpen && currTarget) {
      setValue("title", currTarget?.title);
      setValue("success_rating", currTarget?.success_rating);
      setValue("notes", currTarget?.notes);
    }
  }, [isUpdateTargetModalOpen, currTarget, setValue]);

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

  const resetVisible = (data) => {
    let arr = [];
    // eslint-disable-next-line no-unused-vars
    for (let _ in data) {
      arr.push(false);
    }
    setAllVisible(arr);
  };

  //For toggling the clicked goal
  const toggleVisible = (key) => {
    const arr = [...allVisible];
    arr[key] = !arr[key];
    setAllVisible(arr);
  };

  const showStudentsIEP = (data) => {
    setIsLoading(true);
    axiosInstance
      .get(`/curriculums/${data?.student_id}`)
      .then((res) => {
        setIsLoading(false);
        setSelectedStudent(data);
        setSelectedStudentCurriculums(res.data.data?.curriculums);
        let allCurr = res.data.data?.curriculums;
        if (allCurr.length > 0) {
          setCurriculumSelect({
            val: allCurr[allCurr.length - 1]?.curriculum_id,
            label:
              allCurr[allCurr.length - 1]?.academic_year +
              ", " +
              allCurr[allCurr.length - 1]?.term,
          });
          setSelectedCurr(allCurr[allCurr.length - 1]);
          // set curriculum ratings data
          plotChart(allCurr);
          resetVisible(allCurr[allCurr.length - 1]);
        } else setSelectedCurr(null);
        setStats({
          currs: allCurr.length,
          goals: data?.goalCount,
          targets: data?.targetCount,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setPageError("An error occurred: " + err.response?.data?.message);
        setSelectedStudentCurriculums(null);
        setSelectedStudent(null);
      });
  };

  const plotChart = (allCurr) => {
    let labelArr = [];
    let dataArr = [];
    allCurr.forEach((curr) => {
      dataArr.push(curr.progress_rating);
      labelArr.push(curr?.academic_year.split("/")[0] + curr.term);
    });
    setChartData({ labels: labelArr, data: dataArr });
  };

  const switchCurriculum = (curr) => {
    setCurriculumSelect({
      val: curr?.curriculum_id,
      label: curr?.academic_year + ", " + curr?.term,
    });
    setSelectedCurr(curr);
    plotChart(curr);
    resetVisible(curr);
  };

  const addGoal = (data) => {
    setModalLoading(true);
    setFormError(false);
    const details = {
      ...data,
      success_rating:
        data?.success_rating != "" ? parseInt(data?.success_rating) : 0,
      curriculumId: selectedCurr?.curriculum_id,
    };
    axiosInstance
      .post(`/goal/new`, details)
      .then(() => {
        setModalLoading(false);
        toast.success(`New goal added successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setModalLoading(false);
        setFormError("An error occurred: " + err.response?.data?.message);
      });
  };

  const onClickAddTarget = () => {
    setClickAddTarget(true);
  };

  const addNewTarget = (data) => {
    setIsLoading(true);
    setFormError(false);
    let details = {
      ...data,
      goalId: assignedGoal?.val,
      success_rating:
        data?.success_rating != "" ? parseInt(data?.success_rating) : 0,
    };
    axiosInstance
      .post(`/target/new`, details)
      .then(() => {
        setIsLoading(false);
        toast.success(`New target added successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setIsLoading(false);
        setFormError("An error occurred: " + err.response?.data?.message);
      });
  };

  const openUpdateTargetModal = (target) => {
    setIsUpdateTargetModalOpen(true);
    setCurrTarget(target);
  };

  const updateTarget = (data) => {
    setModalLoading(true);
    setFormError(false);
    let details = {
      ...data,
      success_rating:
        data?.success_rating != "" ? parseInt(data?.success_rating) : 0,
    };
    axiosInstance
      .put(`/target/${currTarget?.target_id}`, details)
      .then(() => {
        setModalLoading(false);
        toast.success(`Target updated successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setModalLoading(false);
        setFormError("An error occurred: " + err.response?.data?.message);
      });
  };

  const createNewCurr = () => {
    setModalLoading(true);
    setFormError(false);
    const details = {
      studentId: selectedStudent?.student_id,
      academic_year: newCurrDetails?.year,
      term: newCurrDetails?.term,
    };
    axiosInstance
      .post(`/curriculum/new`, details)
      .then((res) => {
        if (
          newCurrDetails?.curr != "" &&
          newCurrDetails?.curr?.goals.length > 0
        ) {
          let goalIds = newCurrDetails?.curr?.goals.map((item) => item.goal_id);
          const data = {
            curriculumId: res.data?.data?.curriculum_id,
            goalIds,
          };
          axiosInstance
            .post("/goals", data)
            .then(() => {
              setModalLoading(false);
              toast.success(`New curriculum added successfully`);
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            })
            .catch((err) => {
              setModalLoading(false);
              setFormError(err.response?.data?.message);
            });
        } else {
          setModalLoading(false);
          toast.success(`New curriculum added successfully`);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      })
      .catch((err) => {
        setModalLoading(false);
        setFormError("An error occurred: " + err.response?.data?.message);
      });
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Completion rate",
        data: chartData.data,
        backgroundColor: "#ecc52c",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <PageTitle title="Term Curriculums" />
      {initialLoad ? (
        <Preloader />
      ) : (
        <Layout
          userType="staff"
          userDetails={{
            schoolName: staffDetails?.schoolDetails?.name,
            role: staffDetails?.position,
          }}
        >
          {isLoading ? (
            <Preloader />
          ) : modalLoading ? (
            <div className="p-8 mt-20">
              <Loader />
            </div>
          ) : pageError ? (
            <p className="w-full text-center my-4 p-5">
              Could not complete the request.
            </p>
          ) : (
            <div className="grid grid-cols-10 relative">
              <div className="col-span-1 h-screen border-r border-solid border-gray-200">
                <div className="py-24">
                  <h1 className="text-sm font-medium pb-5 px-2">
                    Students List
                  </h1>
                  <ul className="text-xs">
                    {allStudents &&
                      allStudents.map((student, i) => (
                        <li
                          key={`student-${i}`}
                          className={`px-2 py-5 cursor-pointer  ${
                            student.grade_color == "blue"
                              ? " bg-rating-blue"
                              : student.grade_color == "green"
                              ? " bg-rating-green"
                              : student.grade_color == "yellow"
                              ? " bg-rating-yellow"
                              : student.grade_color == "red"
                              ? " bg-rating-red"
                              : "bg-zinc-200"
                          }`}
                          onClick={() => showStudentsIEP(student)}
                        >
                          {student.first_name} {student.last_name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <div className="col-span-9">
                {selectedStudentCurriculums ? (
                  <div className="p-8">
                    <h1 className="head-text text-3xl font-medium mb-2">
                      {selectedStudent?.first_name} {selectedStudent?.last_name}
                    </h1>
                    {selectedCurr ? (
                      <>
                        <div className="flex justify-between items-center">
                          <div className="flex items-start justify-start">
                            <div
                              className="cursor-pointer has-svg mr-3 underline"
                              onClick={() => setIsViewModalOpen(true)}
                            >
                              View Details
                            </div>
                            <div
                              className="cursor-pointer has-svg mr-3 underline"
                              onClick={() => setIsAddModalOpen(true)}
                            >
                              Add New Goal
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Select
                              selectText="Select curriculum:"
                              label="Showing for:"
                              selected={curriculumSelect?.label}
                              rowType
                            >
                              {selectedStudentCurriculums.map((curr, i) => (
                                <div
                                  key={`curriculum-${i}`}
                                  onClick={() => switchCurriculum(curr)}
                                  className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                                >
                                  {curr?.academic_year}, {curr?.term}
                                </div>
                              ))}
                            </Select>
                            <Button
                              click={() => setIsCreateModalOpen(true)}
                              type="primary"
                              id="open-create-new"
                              extraClasses="w-auto ml-2"
                              size="big"
                            >
                              <span className="text-p1">
                                Add New Curriculum
                              </span>
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3">
                          <div className="col-span-2 pt-8">
                            <h3 className="text-lg font-medium mb-4 flex justify-between items-center">
                              Goals &amp; Targets
                              <Button
                                click={onClickAddTarget}
                                type="secondary"
                                id="open-add-target"
                                extraClasses="w-auto mr-4"
                                size="small"
                              >
                                <span className="text-p1">Add New Target</span>
                              </Button>
                            </h3>
                            {selectedCurr?.goals.length > 0 ? (
                              selectedCurr?.goals.map((goal, index) => (
                                <>
                                  <div
                                    className="w-full bg-neutral-200 flex p-5 justify-between items-center cursor-pointer"
                                    onClick={() => toggleVisible(index)}
                                    key={`curr-${index}`}
                                  >
                                    <span>{goal?.focus_area}</span>
                                    <div
                                      className={`w-5 h-5 cursor-pointer has-svg ${
                                        allVisible[index] ? "rotate-180" : ""
                                      }`}
                                    >
                                      <ArrowdownIcon />
                                    </div>
                                  </div>
                                  {allVisible[index] ? (
                                    <TableWrapper>
                                      <div className="scroll-table">
                                        {goal?.targets.length > 0 ? (
                                          <Table className="w-full min-w-700px">
                                            <thead>
                                              <tr className="row">
                                                <th>S/N</th>
                                                <th>Target</th>
                                                <th className="flex items-center">
                                                  Rating
                                                  <span
                                                    className="w-5 h-5 cursor-pointer has-svg ml-1 lowercase"
                                                    data-tooltip-id="info"
                                                    data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                                                      <div>
                                                        **% success rating based
                                                        on 3-star framework
                                                      </div>
                                                    )}
                                                    data-tooltip-place="right"
                                                  >
                                                    <InfoIcon />
                                                    <Tooltip id="info" />
                                                  </span>
                                                </th>
                                                <th></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {goal?.targets.map(
                                                (target, i) => (
                                                  <TableRow
                                                    className="p-2 row"
                                                    key={`target-${i}`}
                                                  >
                                                    <td>{i + 1}</td>
                                                    <td>{target.title}</td>
                                                    <td className=" w-28">
                                                      <div
                                                        className="flex items-start justify-start"
                                                        data-tooltip-id="rating"
                                                        data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                                                          <div>
                                                            {
                                                              target.success_rating
                                                            }
                                                            %
                                                          </div>
                                                        )}
                                                        data-tooltip-place="top"
                                                      >
                                                        <Tooltip id="rating" />
                                                        <div
                                                          className={`w-7 h-7 has-svg mr-5 ${
                                                            target.success_rating >
                                                            0
                                                              ? "fill-svg"
                                                              : null
                                                          }`}
                                                        >
                                                          <StarIcon />
                                                        </div>
                                                        <div
                                                          className={`w-7 h-7 has-svg mr-5 ${
                                                            target.success_rating >
                                                            34
                                                              ? "fill-svg"
                                                              : null
                                                          }`}
                                                        >
                                                          <StarIcon />
                                                        </div>
                                                        <div
                                                          className={`w-7 h-7 has-svg mr-5 ${
                                                            target.success_rating >
                                                            68
                                                              ? "fill-svg"
                                                              : null
                                                          }`}
                                                        >
                                                          <StarIcon />
                                                        </div>
                                                      </div>
                                                    </td>

                                                    <td className=" w-8">
                                                      <div
                                                        className=" w-5 h-5 cursor-pointer has-svg mr-3"
                                                        onClick={() =>
                                                          openUpdateTargetModal(
                                                            target
                                                          )
                                                        }
                                                      >
                                                        <EditIcon />
                                                      </div>
                                                    </td>
                                                  </TableRow>
                                                )
                                              )}
                                            </tbody>
                                          </Table>
                                        ) : (
                                          <div className="no-data">
                                            No Targets for this goal.
                                          </div>
                                        )}
                                      </div>
                                    </TableWrapper>
                                  ) : null}
                                </>
                              ))
                            ) : (
                              <div className=" my-10 text-center">
                                No goals in this curriculum
                              </div>
                            )}
                          </div>
                          <div className="col-span-1 h-screen border-l border-solid border-gray-200 pt-8">
                            {clickAddTarget ? (
                              <div className="p-6">
                                <h2 className="text-lg font-bold">
                                  Add New Target
                                </h2>
                                <div className="border-b border-neutral-200 mb-4"></div>
                                <div className="mt-6">
                                  <form onSubmit={handleSubmit(addNewTarget)}>
                                    <ErrorMessage
                                      style={{ marginBottom: "30px" }}
                                      message={formError}
                                    />
                                    <div className="mb-6">
                                      <Select
                                        selectText="Select goal:"
                                        label="Select goal to add target:"
                                        selected={assignedGoal?.label}
                                      >
                                        {selectedCurr &&
                                          selectedCurr?.goals.map((goal, i) => (
                                            <div
                                              key={`goal-${i}`}
                                              onClick={() => {
                                                setAssignedGoal({
                                                  val: goal?.goal_id,
                                                  label: goal?.focus_area,
                                                });
                                              }}
                                              className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                                            >
                                              {goal?.focus_area}
                                            </div>
                                          ))}
                                      </Select>
                                    </div>
                                    <div className="mb-2">
                                      <Controller
                                        name="title"
                                        defaultValue=""
                                        rules={{ required: true }}
                                        control={control}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => (
                                          <Textinput
                                            onChange={onChange}
                                            value={value}
                                            label="Target title:"
                                            inputid="title"
                                            name="title"
                                            type="text"
                                            iserror={error}
                                          />
                                        )}
                                      />
                                    </div>
                                    <div className="mb-2">
                                      <Controller
                                        name="success_rating"
                                        defaultValue=""
                                        control={control}
                                        rules={{ min: 0, max: 100 }}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => (
                                          <Textinput
                                            onChange={onChange}
                                            value={value}
                                            label="% Progress:"
                                            inputid="success_rating"
                                            name="success_rating"
                                            type="number"
                                            iserror={error}
                                            placeholder="0"
                                            message={
                                              "please enter a value between 0 and 100"
                                            }
                                          />
                                        )}
                                      />
                                    </div>
                                    <div className="mb-2">
                                      <span className="text-p2 font-medium text-type capitalize mr-2">
                                        Notes:
                                      </span>
                                      <Controller
                                        name="notes"
                                        defaultValue=""
                                        control={control}
                                        render={({
                                          field: { onChange, value },
                                          fieldState: { error },
                                        }) => (
                                          <textarea
                                            onChange={onChange}
                                            value={value}
                                            className={`form-input rounded mt-1 mb-0 ${
                                              error
                                                ? "border-red-500"
                                                : "border-neutral-200"
                                            } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                                            id="notes"
                                            name="notes"
                                            rows={3}
                                          />
                                        )}
                                      />
                                    </div>
                                  </form>
                                </div>
                                <div className="flex flex-row-reverse items-end mt-6">
                                  <Button
                                    click={() => {
                                      setClickAddTarget(false);
                                      setAssignedGoal({
                                        val: "",
                                        label: "",
                                      });
                                      reset();
                                    }}
                                    type="secondary"
                                    extraClasses="w-auto ml-3"
                                    size="big"
                                  >
                                    <span className="text-p1">Cancel</span>
                                  </Button>
                                  <Button
                                    click={() => handleSubmit(addNewTarget)()}
                                    type={type ? type : "primary"}
                                    extraClasses="w-auto"
                                    size="big"
                                    disabled={isLoading}
                                  >
                                    <span className="text-p1">Submit</span>
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-8">
                                <h3 className="text-lg font-medium mb-4">
                                  Overview
                                </h3>
                                <table className="overview w-full border-collapse border-spacing-0 my-5 mx-auto">
                                  <tbody className=" bg-transparent">
                                    <tr>
                                      <td className="text-bold">Curriculums</td>
                                      <td className="text-2xl">
                                        {stats.currs}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-bold">Goals</td>
                                      <td className="text-2xl">
                                        {stats.goals}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-bold">Targets</td>
                                      <td className="text-2xl">
                                        {stats.targets}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                {selectedCurr?.goals.length > 0 && (
                                  <>
                                    <h3 className="text-lg font-medium my-4">
                                      Curriculum Progress Chart
                                    </h3>
                                    <div>
                                      <Bar
                                        data={data}
                                        height={"300px"}
                                        width={"100%"}
                                        options={{
                                          responsive: true,
                                          maintainAspectRatio: false,
                                          scales: {
                                            y: {
                                              beginAtZero: true,
                                            },
                                          },
                                        }}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="my-20 text-center">
                        <div className="mb-3">
                          No Curriculum for this student
                        </div>

                        <Button
                          click={() => setIsCreateModalOpen(true)}
                          type="primary"
                          id="open-create-new"
                          extraClasses="w-auto ml-2"
                          size="big"
                        >
                          <span className="text-p1">Add New Curriculum</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Placeholder message={"Select a student to view the IEPs"} />
                )}
              </div>
            </div>
          )}
        </Layout>
      )}

      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={() => {
          setIsViewModalOpen(false);
        }}
        shouldCloseOnOverlayClick={false}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className=" modal-header">
          <div className="flex items-center justify-between">
            <h2 className=" text-h3 font-bold">
              Goals for {selectedCurr?.academic_year}, {selectedCurr?.term}
            </h2>
            <button
              onClick={() => {
                setIsViewModalOpen(false);
              }}
              className=" text-gray-500 hover:text-gray-700 cursor-pointer w-8 h-8 has-svg"
            >
              <Closeicon />
            </button>
          </div>
          <div className="flex items-center ml-2 mt-4">
            <Textinput
              value=""
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
        </div>
        <div className="border-b border-neutral-200 mb-4"></div>
        <div className="modal-content">
          <div className="p-3">
            {selectedCurr?.goals &&
              (selectedCurr?.goals.length > 0 ? (
                selectedCurr?.goals.map((goal, i) => {
                  return (
                    <div key={`view-goal-${i}`}>
                      <div className="border-b border-neutral-200 mb-4"></div>
                      <div className="grid grid-cols-12 gap-1 items-start">
                        <p className="col-span-1 text-2xl text-bold">{i + 1}</p>
                        <div className="col-span-11">
                          <div className="mb-2">
                            <span className="text-bold">Focus Area: </span>
                            {goal.focus_area}
                          </div>
                          <div className="mb-2">
                            <span className="text-bold">Target: </span>
                            {goal.target}
                          </div>
                          <div className="mb-2">
                            <span className="text-bold">Strategy: </span>
                            {goal.strategy}
                          </div>
                          <div className="mb-2">
                            <span className="text-bold">
                              Success Criteria:{" "}
                            </span>
                            {goal.success_criteria != ""
                              ? goal.success_criteria
                              : "Not Available"}
                          </div>
                          <div className="mb-2">
                            <span className="text-bold">
                              Latest Evaluation:{" "}
                            </span>
                            {goal.latest_eval
                              ? goal.latest_eval
                              : "Not Available"}
                          </div>
                          <div className="mb-2">
                            <span className="text-bold">Status: </span>
                            {goal.success_rating}% Achieved
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="my-5 text-center">No goals</p>
              ))}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => {
          setIsAddModalOpen(false);
          reset();
        }}
        shouldCloseOnOverlayClick={false}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="flex items-center justify-between modal-header">
          <h2 className=" text-h3 font-bold">Add New Goal</h2>
          <button
            onClick={() => {
              setIsAddModalOpen(false);
              reset();
            }}
            className=" text-gray-500 hover:text-gray-700 cursor-pointer w-8 h-8 has-svg"
          >
            <Closeicon />
          </button>
        </div>
        <div className="modal-content p-3 mt-4">
          <form onSubmit={handleSubmit(addGoal)}>
            <ErrorMessage
              style={{ marginBottom: "30px" }}
              message={formError}
            />
            <div className="mb-2">
              <span className="text-p2 font-medium text-type capitalize mr-2">
                Focus Area:
              </span>
              <Controller
                name="focus_area"
                defaultValue=""
                rules={{ required: true }}
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <textarea
                    onChange={onChange}
                    value={value}
                    className={`form-input rounded mt-1 mb-0 ${
                      error ? "border-red-500" : "border-neutral-200"
                    } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                    id="focus_area"
                    name="focus_area"
                    rows={1}
                  />
                )}
              />
            </div>
            <div className="mb-2">
              <span className="text-p2 font-medium text-type capitalize mr-2">
                Target:
              </span>
              <Controller
                name="target"
                defaultValue=""
                rules={{ required: true }}
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <textarea
                    onChange={onChange}
                    value={value}
                    className={`form-input rounded mt-1 mb-0 ${
                      error ? "border-red-500" : "border-neutral-200"
                    } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                    id="target"
                    name="target"
                    rows={2}
                  />
                )}
              />
            </div>
            <div className="mb-2">
              <span className="text-p2 font-medium text-type capitalize mr-2">
                Strategy:
              </span>
              <Controller
                name="strategy"
                defaultValue=""
                rules={{ required: true }}
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <textarea
                    onChange={onChange}
                    value={value}
                    className={`form-input rounded mt-1 mb-0 ${
                      error ? "border-red-500" : "border-neutral-200"
                    } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                    id="strategy"
                    name="strategy"
                    rows={2}
                  />
                )}
              />
            </div>
            <div className="mb-2">
              <span className="text-p2 font-medium text-type capitalize mr-2">
                Success Criteria:
              </span>
              <Controller
                name="success_criteria"
                defaultValue=""
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <textarea
                    onChange={onChange}
                    value={value}
                    className={`form-input rounded mt-1 mb-0 ${
                      error ? "border-red-500" : "border-neutral-200"
                    } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                    id="success_criteria"
                    name="success_criteria"
                    rows={2}
                  />
                )}
              />
            </div>
            <div className="mb-2">
              <span className="text-p2 font-medium text-type capitalize mr-2">
                Latest Evaluation:
              </span>
              <Controller
                name="latest_eval"
                defaultValue=""
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <textarea
                    onChange={onChange}
                    value={value}
                    className={`form-input rounded mt-1 mb-0 ${
                      error ? "border-red-500" : "border-neutral-200"
                    } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                    id="latest_eval"
                    name="latest_eval"
                    rows={2}
                  />
                )}
              />
            </div>
          </form>
        </div>
        <div className="flex flex-row-reverse items-end modal-footer">
          <Button
            click={() => {
              setIsAddModalOpen(false);
              reset();
            }}
            type="secondary"
            extraClasses="w-auto ml-3"
            size="big"
          >
            <span className="text-p1">Cancel</span>
          </Button>
          <Button
            click={() => handleSubmit(addGoal)()}
            type={type ? type : "primary"}
            extraClasses="w-auto"
            size="big"
            disabled={isLoading}
          >
            <span className="text-p1">Submit</span>
          </Button>
        </div>
      </Modal>

      <CustomModal
        isOpen={isUpdateTargetModalOpen}
        onRequestClose={() => {
          setIsUpdateTargetModalOpen(false);
          reset();
        }}
        modalLoading={isLoading}
        confirmAction={() => handleSubmit(updateTarget)()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">Update Target</h2>
          <div className="border-b border-neutral-200 mb-4"></div>
          <div className=" p-3">
            <form onSubmit={handleSubmit(updateTarget)}>
              <ErrorMessage
                style={{ marginBottom: "30px" }}
                message={formError}
              />
              <div className="mb-2">
                <Controller
                  name="title"
                  defaultValue={currTarget?.title}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      value={value}
                      label="Target title:"
                      inputid="title"
                      name="title"
                      type="text"
                      iserror={error}
                    />
                  )}
                />
              </div>
              <div className="mb-2">
                <Controller
                  name="success_rating"
                  defaultValue={currTarget?.success_rating}
                  rules={{ min: 0, max: 100 }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      value={value}
                      label="% Progress:"
                      inputid="success_rating"
                      name="success_rating"
                      type="number"
                      iserror={error}
                      placeholder="0"
                      message={"please enter a value between 0 and 100"}
                    />
                  )}
                />
              </div>
              <div className="mb-2">
                <span className="text-p2 font-medium text-type capitalize mr-2">
                  Notes:
                </span>
                <Controller
                  name="notes"
                  defaultValue={currTarget?.notes}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <textarea
                      onChange={onChange}
                      value={value}
                      className={`form-input rounded mt-1 mb-0 ${
                        error ? "border-red-500" : "border-neutral-200"
                      } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                      id="notes"
                      name="notes"
                      rows={3}
                    />
                  )}
                />
              </div>
            </form>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isCreateModalOpen}
        modalLoading={isLoading}
        onRequestClose={() => {
          setIsCreateModalOpen(false);
          setNewCurrDetails({
            year: "",
            term: "",
            curr: "",
          });
        }}
        confirmAction={() => handleSubmit(createNewCurr)()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">Add New Curriculum</h2>
          {!selectedCurr && (
            <p className="pb-2 ml-2 text-xs">You can add goals later</p>
          )}
          <div className="border-b border-neutral-200 mb-4"></div>
          <div className=" p-3">
            <form onSubmit={handleSubmit(createNewCurr)}>
              <ErrorMessage
                style={{ marginBottom: "30px" }}
                message={formError}
              />
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Select
                  selectText="Select year:"
                  label="School Year:"
                  selected={newCurrDetails?.year}
                >
                  {schoolYears().map((year, i) => (
                    <div
                      key={`school-year-${i}`}
                      onClick={() => {
                        setNewCurrDetails((val) => ({ ...val, year: year }));
                      }}
                      className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                    >
                      {year}
                    </div>
                  ))}
                </Select>

                {staffDetails?.schoolDetails?.type == "school" && (
                  <Select
                    selectText="Select term:"
                    label="Term:"
                    selected={newCurrDetails?.term}
                  >
                    {schoolTerms.map((term, i) => (
                      <div
                        key={`school-term-${i}`}
                        onClick={() => {
                          setNewCurrDetails((val) => ({
                            ...val,
                            term: term?.label,
                          }));
                        }}
                        className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                      >
                        {term?.label}
                      </div>
                    ))}
                  </Select>
                )}
                {staffDetails?.schoolDetails?.type == "private" && (
                  <Select
                    selectText="Select term:"
                    label="Term:"
                    selected={newCurrDetails?.term}
                  >
                    {generateTermOptions(
                      staffDetails?.schoolDetails?.terms_private
                    ).map((term, i) => (
                      <div
                        key={`school-term-${i}`}
                        onClick={() => {
                          setNewCurrDetails((val) => ({
                            ...val,
                            term: term,
                          }));
                        }}
                        className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                      >
                        {term}
                      </div>
                    ))}
                  </Select>
                )}
              </div>

              {selectedCurr && (
                <>
                  <h2 className="text-p1 font-extrabold mt-6 mb-2">
                    Goals
                    <span className="pb-2 ml-2 text-xs">
                      (Import goals from existing curriculums or add new goals
                      later)
                    </span>
                  </h2>
                  <div className="border-b border-neutral-200 mb-4"></div>
                  <div className="mb-4">
                    <Select
                      selectText="Select Curriculum:"
                      label="Curriculum to import from:"
                      selected={
                        newCurrDetails?.curr == ""
                          ? newCurrDetails?.curr
                          : `${newCurrDetails?.curr?.academic_year}, ${newCurrDetails?.curr?.term}`
                      }
                    >
                      {selectedStudentCurriculums &&
                        selectedStudentCurriculums.map((curr, i) => (
                          <div
                            key={`import-curriculum-${i}`}
                            onClick={() => {
                              setNewCurrDetails((val) => ({ ...val, curr }));
                            }}
                            className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                          >
                            {curr?.academic_year}, {curr?.term}
                          </div>
                        ))}
                    </Select>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default TermCurriculums;
