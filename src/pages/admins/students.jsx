import { useState, useEffect } from "react";
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
import { Textinput } from "../../components/input/textinput";
import { validateEmail } from "../../config";
import Button from "../../components/button";
import Loader from "../../components/loader";
import { Table, TableWrapper, TableRow } from "../../components/table";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as LinkIcon } from "../../assets/icons/link.svg";
import CustomModal from "../../components/modals/modal";
import ConfirmationModal from "../../components/modals/confirmModal";
import { Select } from "../../components/input/select";
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
  const [modalLoading, setModalLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);

  const { handleSubmit, control, reset, setValue } = useForm({
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const [allStudents, setAllStudents] = useState(null);
  const [allStaff, setAllStaff] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [currentStudentDetails, setCurrentStudentDetails] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [assignedStaff, setAssignedStaff] = useState({
    val: "",
    label: "",
  });
  const [otherDetails, setOtherDetails] = useState({
    contact_email: "",
    contact_phone: "",
  });
  const [formError, setFormError] = useState(null);
  const [chartData, setChartData] = useState(null);

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

  //for update forms
  useEffect(() => {
    if (isEditModalOpen && currentStudentDetails) {
      setValue("fname", currentStudentDetails?.first_name);
      setValue("lname", currentStudentDetails?.last_name);
      setValue("cname", currentStudentDetails?.contact_name);
    }
  }, [isEditModalOpen, currentStudentDetails, setValue]);

  const getAdminProfile = () => {
    setIsLoading(true);
    setPageError(false);
    axiosInstance
      .get("/admin")
      .then((res) => {
        setIsLoading(false);
        setAdminDetails(res.data?.data);
        getAllStudents(res.data?.data?.school_id);
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

  const getAllStudents = (schoolId) => {
    setIsLoading(true);
    axiosInstance
      .get(`/students/${schoolId}`)
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

  const linkStudentToStaff = () => {
    setModalLoading(true);
    setFormError(false);
    let data = {
      staffId: assignedStaff?.val,
    };
    axiosInstance
      .post(`/student/assign/${currentStudentDetails?.student_id}`, data)
      .then((res) => {
        setModalLoading(false);
        toast.success(res.data?.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setModalLoading(false);
        setFormError("An error occurred: " + err.response?.data?.message);
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
      setModalLoading(true);
      let details = {
        ...data,
        schoolId: adminDetails?.school_id,
        contact_email: otherDetails.contact_email,
        contact_phone: otherDetails.contact_phone,
        year_enrolled: new Date().getFullYear(),
      };

      axiosInstance
        .post("/student/new", details)
        .then(() => {
          setModalLoading(false);
          toast.success("Successfully registered new student");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((err) => {
          setModalLoading(false);
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
      setModalLoading(true);
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
          setModalLoading(false);
          toast.success("Successfully updated student details");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((err) => {
          setModalLoading(false);
          setFormError("An error occurred: " + err.response?.data?.message);
        });
    }
  };

  const deleteStudent = () => {
    setModalLoading(true);
    axiosInstance
      .delete(`/student/${currentId}`)
      .then(() => {
        setModalLoading(false);
        toast.success("Successfully deleted student");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setModalLoading(false);
        toast.error(err.response?.data?.message);
      });
  };

  const openLinkModal = (data) => {
    setCurrentStudentDetails(data);
    if (data?.staffDetails) {
      setAssignedStaff({
        val: data?.staff_id,
        label:
          data?.staffDetails?.first_name + " " + data?.staffDetails?.last_name,
      });
    }
    setModalLoading(true);
    axiosInstance
      .get(`/staffs/${adminDetails?.school_id}`)
      .then((res) => {
        setModalLoading(false);
        setAllStaff(res.data?.data?.staffs);
        setIsLinkModalOpen(true);
      })
      .catch((err) => {
        setModalLoading(false);
        toast.error("An error occurred: " + err.response?.data?.message);
        setCurrentStudentDetails(null);
        setAssignedStaff({
          val: null,
          label: null,
        });
      });
  };
  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentStudentDetails(null);
    setAssignedStaff({
      val: null,
      label: null,
    });
  };

  const openEditModal = (data) => {
    setIsEditModalOpen(true);
    setCurrentStudentDetails(data);
    setOtherDetails({
      contact_email: data?.contact_email,
      contact_phone: data?.contact_phone,
    });
  };

  const openConfirmModal = (id) => {
    setIsDeleteModalOpen(true);
    setCurrentId(id);
  };
  const closeConfirmModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentId(null);
  };

  return (
    <>
      <PageTitle title="All Students" />
      {initialLoad ? (
        <Preloader />
      ) : (
        <Layout
          userType="school_admin"
          userDetails={{
            schoolName: adminDetails?.schoolDetails?.name,
            role: adminDetails?.role,
          }}
        >
          {isLoading ? (
            <Preloader />
          ) : (
            <div className="grid grid-cols-7 relative">
              <div className="py-20 px-10 col-span-5">
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
                    <span className="text-p1">Register New Student</span>
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
                                <th>Assigned Teacher</th>
                                <th>Progress Level</th>
                                <th>Actions</th>
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
                                    {adminDetails?.schoolDetails?.shortcode}
                                    {data.student_id
                                      .toString()
                                      .padStart(4, "0")}
                                  </td>
                                  <td>
                                    {data.first_name} {data.last_name}
                                  </td>
                                  <td>
                                    {data.staffDetails
                                      ? data.staffDetails?.first_name +
                                        " " +
                                        data.staffDetails?.last_name
                                      : "None"}
                                  </td>
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
                                      onClick={() => openLinkModal(data)}
                                    >
                                      <LinkIcon />
                                    </div>
                                    <div
                                      className=" w-5 h-5 cursor-pointer has-svg mr-3"
                                      onClick={() => openEditModal(data)}
                                    >
                                      <EditIcon />
                                    </div>
                                    <div
                                      className="w-5 h-5 cursor-pointer has-svg"
                                      onClick={() =>
                                        openConfirmModal(data.student_id)
                                      }
                                    >
                                      <DeleteIcon />
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
              <div className="col-span-2 h-screen border-l border-solid border-gray-200">
                <div className="py-20 px-5">
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
                  <Pie data={data} />
                </div>
              </div>
            </div>
          )}
        </Layout>
      )}

      <CustomModal
        isOpen={isLinkModalOpen}
        modalLoading={modalLoading}
        onRequestClose={() => closeLinkModal()}
        confirmAction={() => handleSubmit(linkStudentToStaff)()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">
            {currentStudentDetails?.staffDetails ? "Reassign " : "Assign "}
            {currentStudentDetails?.first_name}{" "}
            {currentStudentDetails?.last_name}
          </h2>
          <p className="pb-4 text-xs">
            {currentStudentDetails?.staffDetails
              ? "Update the staff assigned to "
              : "Assign a staff to "}
            {currentStudentDetails?.first_name}{" "}
            {currentStudentDetails?.last_name}
          </p>
          <div className="border-b border-neutral-200 mb-4"></div>
          <div className=" p-3">
            <form onSubmit={handleSubmit(linkStudentToStaff)}>
              <ErrorMessage
                style={{ marginBottom: "30px" }}
                message={formError}
              />
              <div className="mb-6">
                <Select
                  selectText="Select staff:"
                  label="Select Staff:"
                  selected={assignedStaff?.label}
                  rowType
                >
                  {allStaff &&
                    allStaff.map((staff, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setAssignedStaff({
                            val: staff?.staff_id,
                            label: staff?.first_name + " " + staff?.last_name,
                          });
                        }}
                        className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                      >
                        {staff?.first_name + " " + staff?.last_name}
                      </div>
                    ))}
                </Select>
              </div>
            </form>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isCreateModalOpen}
        modalLoading={modalLoading}
        onRequestClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        confirmAction={() => handleSubmit(createNewStudent)()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">Register New Student</h2>
          <p className="pb-4 text-xs">
            Add the basic required information. A staff can be assigned to the
            student afterwards.
          </p>
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
        modalLoading={modalLoading}
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => closeConfirmModal()}
        confirmAction={() => deleteStudent()}
        type="delete"
        message="This will delete the selected student and ALL of their records!"
      />

      {modalLoading && (
        <div className="p-8 mt-20">
          <Loader />
        </div>
      )}
    </>
  );
};

export default Students;
