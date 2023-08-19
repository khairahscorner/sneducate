import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import PageTitle from "../../components/pageTitle";
import { Preloader } from "../../components/pageloader";
import Layout from "../../components/layout";
import axiosInstance from "../../config/axios";
import { Controller, useForm } from "react-hook-form";
import { tokenValidSuccess } from "../../store/slices/authSlice";
import { ErrorMessage } from "../../components/error";
import { Textinput } from "../../components/input/textinput";
import { validateEmail } from "../../config";
import Button from "../../components/button";
import { Table, TableWrapper, TableRow } from "../../components/table";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";
import CustomModal from "../../components/modals/modal";
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  Tooltip as chartTooltip,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, chartTooltip, Legend);

const Students = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);

  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [staffDetails, setStaffDetails] = useState(null);
  const [chartData, setChartData] = useState(null);

  const { handleSubmit, control, reset, setValue } = useForm({
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const [allStudents, setAllStudents] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudentDetails, setCurrentStudentDetails] = useState(null);

  const [otherDetails, setOtherDetails] = useState({
    contact_email: "",
    contact_phone: "",
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

  //for update forms
  useEffect(() => {
    if (isEditModalOpen && currentStudentDetails) {
      setValue("fname", currentStudentDetails?.first_name);
      setValue("lname", currentStudentDetails?.last_name);
      setValue("cname", currentStudentDetails?.contact_name);
    }
  }, [isEditModalOpen, currentStudentDetails, setValue]);

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

  const getAllStudents = (schoolId, staffId) => {
    setIsLoading(true);
    axiosInstance
      .get(`/students/${schoolId}/${staffId}`)
      .then((res) => {
        setIsLoading(false);
        setAllStudents(res.data.data?.students);
        // stats
        setChartData(res.data?.data?.stats);
      })
      .catch((err) => {
        setIsLoading(false);
        setPageError("An error occurred: " + err.response?.data?.message);
        setAllStudents(null);
      });
  };

  const createNewStudent = (data) => {
    if (otherDetails.contact_email == "" && otherDetails.contact_phone == "") {
      setFormError("A contact email or phone number is required");
    } else if (
      otherDetails.contact_email != "" &&
      validateEmail(otherDetails.contact_email)
    ) {
      setFormError(validateEmail(otherDetails.contact_email));
    } else {
      setFormError(false);
      setIsLoading(true);
      let details = {
        ...data,
        staffId: staffDetails?.staff_id,
        schoolId: staffDetails?.school_id,
        contact_email: otherDetails.contact_email,
        contact_phone: otherDetails.contact_phone,
        year_enrolled: new Date().getFullYear(),
      };

      axiosInstance
        .post("/student/new", details)
        .then(() => {
          setIsLoading(false);
          toast.success("Successfully registered new student");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((err) => {
          setIsLoading(false);
          setFormError("An error occurred: " + err.response?.data?.message);
        });
    }
  };

  const updateStudentDetails = (data) => {
    if (otherDetails.contact_email == "" && otherDetails.contact_phone == "") {
      setFormError("A contact email or phone number is required");
    } else if (
      otherDetails.contact_email != "" &&
      validateEmail(otherDetails.contact_email)
    ) {
      setFormError(validateEmail(otherDetails.contact_email));
    } else {
      setFormError(false);
      setIsLoading(true);
      let details = {
        first_name: data.fname,
        last_name: data.lname,
        contact_name: data.cname,
        contact_email: otherDetails.contact_email,
        contact_phone: otherDetails.contact_phone,
      };

      axiosInstance
        .put(`/student/${currentStudentDetails?.student_id}`, details)
        .then(() => {
          setIsLoading(false);
          toast.success("Successfully updated student details");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((err) => {
          setIsLoading(false);
          setFormError("An error occurred: " + err.response?.data?.message);
        });
    }
  };

  const openEditModal = (data) => {
    setIsEditModalOpen(true);
    setCurrentStudentDetails(data);
    setOtherDetails({
      contact_email: data?.contact_email,
      contact_phone: data?.contact_phone,
    });
  };

  return (
    <>
      <PageTitle title="Students" />
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
          ) : (
            <>
            <div className="w-fit mx-7 my-5 bg-zinc-100 rounded-md border border-solid border-zinc-200 p-3">
              <p className="text-xl text-bold text-gray-800 mb-3">
              Manage your assigned students
              </p>
              <ul className="list-disc pl-6">
                <li className="mb-1">
                  Update students records.
                </li>
                <li className="mb-1">
                Add new students.
                </li>
                <li className="mb-1">
                  Get an overview of your students progress levels.
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-7 relative border-t border-solid border-gray-200">
              <div className="pb-20 pt-6 px-7 col-span-5">
                <div className="flex flex-wrap justify-between items-center mb-8">
                  <h1 className="head-text text-3xl font-medium">
                    {" "}
                    All Students
                  </h1>
                  <Button
                    click={() => {
                      setIsCreateModalOpen(true);
                    }}
                    type="primary"
                    id="open-create-new"
                    extraClasses="w-auto mb-4"
                    size="big"
                  >
                    <span className="text-p1">Add New Student</span>
                  </Button>
                </div>
                {allStudents ? (
                  <TableWrapper>
                    <div className="scroll-table">
                      {allStudents &&
                        (allStudents.length > 0 ? (
                          <Table className="w-full min-w-700px">
                            <thead>
                              <tr className="row">
                                <th>S/N</th>
                                <th>StudentID</th>
                                <th>Name</th>
                                <th>Year Enrolled</th>
                                <th className="flex items-center">
                                  Current Level
                                  <span
                                    className="w-3 h-3 cursor-pointer has-svg ml-1 lowercase"
                                    data-tooltip-id="info"
                                    data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                                      <div>
                                        **Indicates students overall progress
                                        level based on their goals &amp;
                                        targets.
                                      </div>
                                    )}
                                    data-tooltip-place="top"
                                  >
                                    <InfoIcon />
                                    <Tooltip id="info" />
                                  </span>
                                </th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {allStudents.map((data, i) => (
                                <TableRow
                                  className="p-2 row"
                                  key={`student-${i}`}
                                >
                                  <td>{i + 1}</td>
                                  <td>
                                    {staffDetails?.schoolDetails?.shortcode}
                                    {data.student_id
                                      .toString()
                                      .padStart(4, "0")}
                                  </td>
                                  <td>
                                    {data.first_name} {data.last_name}
                                  </td>
                                  <td>{data.year_enrolled}</td>
                                  <td>
                                    <span
                                      className={`p-1 rounded text-bold text-type text-p4 uppercase
                                  ${
                                    data.grade_color == "blue"
                                      ? " bg-rating-blue"
                                      : data.grade_color == "green"
                                      ? " bg-rating-green"
                                      : data.grade_color == "yellow"
                                      ? " bg-rating-yellow"
                                      : data.grade_color == "red"
                                      ? " bg-rating-red"
                                      : "bg-zinc-200"
                                  }`}
                                    >
                                      {data.grade_color != "null"
                                        ? data.grade_color
                                        : "Not Graded"}
                                    </span>
                                  </td>
                                  <td className="flex items-start justify-start">
                                    <div
                                      className=" w-5 h-5 cursor-pointer has-svg mr-3"
                                      onClick={() => openEditModal(data)}
                                    >
                                      <EditIcon />
                                    </div>
                                  </td>
                                </TableRow>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <div className="no-data">No Students.</div>
                        ))}
                    </div>
                  </TableWrapper>
                ) : (
                  pageError && (
                    <div className="p-8 mt-20">
                      <p className="text-center font-bold">
                        Error fetching request.
                      </p>
                    </div>
                  )
                )}
              </div>
              <div className="col-span-2 h-fit border-l border-solid border-gray-200">
                <div className="pb-20 pt-6 px-5">
                  <h1 className="head-text text-xl font-medium pb-5">
                    Overview
                  </h1>
                  <div className="bg-white rounded-md shadow-md w-fit">
                    <div className="p-6 mb-10">
                      <div className="text-4xl font-bold text-type mb-2">
                        {allStudents?.length}
                      </div>
                      <div className="text-black-600 font-medium text-sm">
                        Assigned Students
                      </div>
                    </div>
                  </div>
                  {allStudents && allStudents.length > 0 && <Pie data={data} />}
                </div>
              </div>
            </div>
            </>
          )}
        </Layout>
      )}

      <CustomModal
        isOpen={isCreateModalOpen}
        modalLoading={isLoading}
        onRequestClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        confirmAction={() => handleSubmit(createNewStudent)()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">Add New Student</h2>
          <div className="border-b border-neutral-200 mb-4"></div>
          <div className=" p-3">
            <form onSubmit={handleSubmit(createNewStudent)}>
              <ErrorMessage
                style={{ marginBottom: "30px" }}
                message={formError}
              />
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Controller
                  name="first_name"
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
                      label="First Name:"
                      inputid="first_name"
                      name="first_name"
                      type="text"
                      iserror={error}
                      placeholder="Jane"
                      message={"Please provide the name."}
                    />
                  )}
                />
                <Controller
                  name="last_name"
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
                      label="Last Name:"
                      inputid="last_name"
                      name="last_name"
                      type="text"
                      iserror={error}
                      placeholder="Doe"
                      message={"Please provide the name."}
                    />
                  )}
                />
              </div>
              <div className="mb-4">
                <Controller
                  name="contact_name"
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
                      label="Contact Name:"
                      inputid="contact_name"
                      name="contact_name"
                      type="text"
                      iserror={error}
                      placeholder="Jane Doe"
                      message={"Please provide the contact/guardian's name."}
                    />
                  )}
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Textinput
                  onChange={(e) =>
                    setOtherDetails({
                      ...otherDetails,
                      contact_email: e.target.value,
                    })
                  }
                  value={otherDetails?.contact_email}
                  label="Contact Email"
                  inputid="contact_email"
                  name="contact_email"
                  type="text"
                  placeholder="email@email.com"
                />
                <Textinput
                  onChange={(e) =>
                    setOtherDetails({
                      ...otherDetails,
                      contact_phone: e.target.value,
                    })
                  }
                  value={otherDetails?.contact_phone}
                  label="Contact Phone"
                  inputid="contact_phone"
                  name="contact_phone"
                  type="number"
                  placeholder="012345678"
                />
              </div>
            </form>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isEditModalOpen}
        onRequestClose={() => {
          setIsEditModalOpen(false);
          reset();
        }}
        modalLoading={isLoading}
        confirmAction={() => handleSubmit(updateStudentDetails)()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">
            Edit {currentStudentDetails?.first_name}{" "}
            {currentStudentDetails?.last_name}
          </h2>
          <p className="pb-4 text-xs">**Only these fields can be updated.</p>
          <div className="border-b border-neutral-200 mb-4"></div>
          <div className=" p-3">
            <form onSubmit={handleSubmit(updateStudentDetails)}>
              <ErrorMessage
                style={{ marginBottom: "30px" }}
                message={formError}
              />
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Controller
                  name="fname"
                  defaultValue={currentStudentDetails?.first_name}
                  rules={{ required: true }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      value={value}
                      label="First Name:"
                      inputid="fname"
                      name="fname"
                      type="text"
                      iserror={error}
                      placeholder="Jane"
                      message={"Please provide the name."}
                    />
                  )}
                />
                <Controller
                  name="lname"
                  defaultValue={currentStudentDetails?.last_name}
                  rules={{ required: true }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      value={value}
                      label="Last Name:"
                      inputid="lname"
                      name="lname"
                      type="text"
                      iserror={error}
                      placeholder="Doe"
                      message={"Please provide the name."}
                    />
                  )}
                />
              </div>
              <div className="mb-4">
                <Controller
                  name="cname"
                  defaultValue={currentStudentDetails?.contact_name}
                  rules={{ required: true }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      value={value}
                      label="Contact Name:"
                      inputid="cname"
                      name="cname"
                      type="text"
                      iserror={error}
                      placeholder="Jane Doe"
                      message={"Please provide the contact/guardian's name."}
                    />
                  )}
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Textinput
                  onChange={(e) =>
                    setOtherDetails({
                      ...otherDetails,
                      contact_email: e.target.value,
                    })
                  }
                  value={otherDetails?.contact_email}
                  label="Contact Email"
                  inputid="contact_email"
                  name="contact_email"
                  type="text"
                  placeholder="email@email.com"
                />
                <Textinput
                  onChange={(e) =>
                    setOtherDetails({
                      ...otherDetails,
                      contact_phone: e.target.value,
                    })
                  }
                  value={otherDetails?.contact_phone}
                  label="Contact Phone"
                  inputid="contact_phone"
                  name="contact_phone"
                  type="number"
                  placeholder="012345678"
                />
              </div>
            </form>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Students;
