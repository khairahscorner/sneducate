import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactDOMServer from "react-dom/server";
import { Tooltip } from "react-tooltip";
import PageTitle from "../../components/pageTitle";
import { Preloader } from "../../components/pageloader";
import Layout from "../../components/layout";
import axiosInstance from "../../config/axios";
import { Controller, useForm } from "react-hook-form";
import { tokenValidSuccess } from "../../store/slices/authSlice";
import { ErrorMessage } from "../../components/error";
import { Textinput } from "../../components/input/textinput";
import { validEmailRegex } from "../../config";
import Button from "../../components/button";
import Loader from "../../components/loader";
import { Table, TableWrapper, TableRow } from "../../components/table";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as ResetIcon } from "../../assets/icons/reset-password.svg";
import CustomModal from "../../components/modals/modal";
import ConfirmationModal from "../../components/modals/confirmModal";

const Staffs = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);

  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);

  const { handleSubmit, control, reset, setValue } = useForm({
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const [allStaff, setAllStaff] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [currentStaffDetails, setCurrentStaffDetails] = useState(null);
  const [currentId, setCurrentId] = useState(null);
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
    if (isEditModalOpen && currentStaffDetails) {
      setValue("fname", currentStaffDetails?.first_name);
      setValue("lname", currentStaffDetails?.last_name);
      setValue("position", currentStaffDetails?.position);
    }
  }, [isEditModalOpen, currentStaffDetails, setValue]);

  const getAdminProfile = () => {
    setIsLoading(true);
    setPageError(false);
    axiosInstance
      .get("/admin")
      .then((res) => {
        setIsLoading(false);
        setAdminDetails(res.data?.data);
        getAllStaff(res.data?.data?.school_id);
      })
      .catch((err) => {
        setIsLoading(false);
        setPageError("An error occurred: " + err.response?.data?.message);
      });
  };

  const getAllStaff = (schoolId) => {
    setIsLoading(true);
    axiosInstance
      .get(`/staffs/${schoolId}`)
      .then((res) => {
        setIsLoading(false);
        setAllStaff(res.data.data?.staffs);
      })
      .catch((err) => {
        setIsLoading(false);
        setPageError("An error occurred: " + err.response?.data?.message);
        setAllStaff(null);
      });
  };

  const addNewstaff = (data) => {
    setFormError(false);
    let details = {
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      position: data.staff_position,
      schoolId: adminDetails?.school_id,
    };
    setIsLoading(true);
    axiosInstance
      .post("/staff/new", details)
      .then(() => {
        setIsLoading(false);
        toast.success(`New staff added successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setIsLoading(false);
        setFormError(err.response?.data?.message);
      });
  };
  const updateStaff = (data) => {
    setFormError(false);
    let details = {
      first_name: data?.fname,
      last_name: data?.lname,
      position: data?.position,
    };
    setIsLoading(true);
    axiosInstance
      .put(`/staff/${currentStaffDetails?.staff_id}`, details)
      .then(() => {
        setIsLoading(false);
        toast.success(`Details updated successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setIsLoading(false);
        setFormError("Error updating details: " + err.response?.data?.message);
      });
  };

  const deleteStaff = () => {
    setIsLoading(true);
    axiosInstance
      .delete(`/staff/${currentId}`)
      .then(() => {
        setIsLoading(false);
        toast.success("Successfully deleted staff");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response?.data?.message);
      });
  };

  const resetStaffPassword = () => {
    setIsLoading(true);
    axiosInstance
      .get(`/reset-password/${currentId}`)
      .then(() => {
        setIsLoading(false);
        toast.success("Successfully reset staff password");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response?.data?.message);
      });
  };

  const openEditModal = (data) => {
    setIsEditModalOpen(true);
    setCurrentStaffDetails(data);
  };

  const openConfirmModal = (id) => {
    setIsDeleteModalOpen(true);
    setCurrentId(id);
  };
  const closeConfirmModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentId(null);
  };
  // const openResetModal = (id) => {
  //   setIsResetModalOpen(true);
  //   setCurrentId(id);
  // };
  const closeResetModal = () => {
    setIsResetModalOpen(false);
    setCurrentId(null);
  };

  return (
    <>
      <PageTitle title="All Staff" />
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
          <div className="py-20 px-10">
            <div className="flex flex-wrap justify-between items-center mb-8">
              <h1 className="head-text text-3xl font-medium">
                {" "}
                All School Staff
              </h1>
              <Button
                // click={() => {
                //   setIsCreateModalOpen(true);
                // }}
                type="primary"
                id="open-create-new"
                extraClasses="w-auto mb-4"
                size="big"
              >
                <span
                  className="text-p1 py-3"
                  data-tooltip-id="not-allowed"
                  data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                    <div>
                      **Unable to register new staff, email service is currently
                      down.
                    </div>
                  )}
                  data-tooltip-place="left"
                >
                  Register New Staff
                  <Tooltip id="not-allowed" />
                </span>
              </Button>
            </div>
            {allStaff ? (
              <TableWrapper>
                <div className="scroll-table">
                  {allStaff &&
                    (allStaff.length > 0 ? (
                      <Table className="w-full min-w-700px">
                        <thead>
                          <tr className="row">
                            <th>S/N</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Is Activated?</th>
                            <th>No. of Students</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allStaff.map((data, i) => (
                            <TableRow className="p-2 row" key={`staff-${i}`}>
                              <td>{i + 1}</td>
                              <td>
                                {data.first_name} {data.last_name}
                              </td>
                              <td>{data.email}</td>
                              <td>{data.isVerified ? "Yes" : "No"}</td>
                              <td>{data.studentCount}</td>
                              <td className="flex items-start justify-start">
                                <div
                                  className=" w-5 h-5 cursor-pointer has-svg mr-3"
                                  onClick={() => openEditModal(data)}
                                >
                                  <EditIcon />
                                </div>
                                <div
                                  className=" w-5 h-5 cursor-pointer has-svg mr-3"
                                  // onClick={() => openResetModal(data.staff_id)}
                                  data-tooltip-id="info"
                                  data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                                    <div>
                                      **Email service is currently down.
                                    </div>
                                  )}
                                  data-tooltip-place="top"
                                >
                                  <ResetIcon />
                                  <Tooltip id="info" />
                                </div>
                                <div
                                  className="w-5 h-5 cursor-pointer has-svg"
                                  onClick={() =>
                                    openConfirmModal(data.staff_id)
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
                      <div className="no-data">No Staff.</div>
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
        </Layout>
      )}

      <CustomModal
        isOpen={isCreateModalOpen}
        modalLoading={isLoading}
        onRequestClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        confirmAction={() => handleSubmit(addNewstaff)()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">Add New Staff</h2>
          <div className="border-b border-neutral-200 mb-4"></div>
          <div className=" p-3">
            <form onSubmit={handleSubmit(addNewstaff)}>
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
                      message={"Please provide the staff name."}
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
                      message={"Please provide the staff name."}
                    />
                  )}
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Controller
                  name="email"
                  defaultValue=""
                  rules={{ required: true, pattern: validEmailRegex }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      value={value}
                      label="Email"
                      inputid="email"
                      name="email"
                      type="email"
                      iserror={error}
                      placeholder="email@email.com"
                      message={"Please provide a valid email."}
                    />
                  )}
                />
                <Controller
                  name="staff_position"
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
                      label="Position at School:"
                      inputid="staff_position"
                      name="staff_position"
                      type="text"
                      iserror={error}
                      placeholder="Level 1 Educator"
                      message={"Please provide the staff position."}
                    />
                  )}
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
        confirmAction={() => handleSubmit(updateStaff)()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">
            Edit {currentStaffDetails?.first_name}{" "}
            {currentStaffDetails?.last_name}
          </h2>
          {/* <p className="pb-4 text-xs">**Only these fields can be updated</p> */}
          <div className="border-b border-neutral-200 mb-4"></div>
          <div className=" p-3">
            <form onSubmit={handleSubmit(updateStaff)}>
              <ErrorMessage
                style={{ marginBottom: "30px" }}
                message={formError}
              />
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Controller
                  name="fname"
                  defaultValue={currentStaffDetails?.first_name}
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
                      message={"Please provide the staff name."}
                    />
                  )}
                />
                <Controller
                  name="lname"
                  defaultValue={currentStaffDetails?.last_name}
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
                      message={"Please provide the staff name."}
                    />
                  )}
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Textinput
                  value={currentStaffDetails?.email}
                  label="Email"
                  inputid="staff_email"
                  name="staff_email"
                  type="text"
                  disabled={true}
                />
                <Controller
                  name="position"
                  defaultValue={currentStaffDetails?.position}
                  rules={{ required: true }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      value={value}
                      label="Position:"
                      inputid="position"
                      name="position"
                      type="text"
                      iserror={error}
                      placeholder="Level 1 Educator"
                      message={"Please provide the staff role."}
                    />
                  )}
                />
              </div>
            </form>
          </div>
        </div>
      </CustomModal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => closeConfirmModal()}
        confirmAction={() => deleteStaff()}
        type="delete"
        message="This will delete the selected staff profile and all their students will be unassigned unless reassigned to another staff!"
      />

      <ConfirmationModal
        isOpen={isResetModalOpen}
        onRequestClose={() => closeResetModal()}
        confirmAction={() => resetStaffPassword()}
        message="This will reset the password of the selected staff account and send them a reactivation email"
      />

      {isLoading && (
        <div className="p-8 mt-20">
          <Loader />
        </div>
      )}
    </>
  );
};
export default Staffs;
