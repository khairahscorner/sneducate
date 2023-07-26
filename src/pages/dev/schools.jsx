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
import Button from "../../components/button";
import { Table, TableRow, TableWrapper } from "../../components/table";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import CustomModal from "../../components/modals/modal";
import ConfirmationModal from "../../components/modals/confirmModal";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "../../components/error";
import { Textinput } from "../../components/input/textinput";
import { Select } from "../../components/input/select";
import { getShortCode, schoolTerms, validEmailRegex } from "../../config";

const maxStaffCount = 20;

const Schools = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);
  const { handleSubmit, control, reset } = useForm({
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState(type);
  const [allSchools, setAllSchools] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSchoolDetails, setCurrentSchoolDetails] = useState(null);
  const [currentId, setCurrentId] = useState(null);

  const [schoolType, setSchoolType] = useState({
    type: "school",
    label: "School",
  });
  const [formLoading, setFormLoading] = useState(false);
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

    getAllSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [error, setError] = useState(false);

  const getAllSchools = () => {
    setIsLoading(true);
    axiosInstance
      .get("/schools")
      .then((res) => {
        setIsLoading(false);
        setAllSchools(res.data.data?.schools);
      })
      .catch(() => {
        setIsLoading(false);
        setError(true);
        setAllSchools(null);
      });
  };

  const deleteSchool = () => {
    setIsLoading(true);
    axiosInstance
      .delete(`/school/${currentId}`)
      .then(() => {
        setIsLoading(false);
        toast.success(
          "Successfully deleted school and all associated accounts"
        );
        window.location.reload();
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response?.data?.message);
      });
  };

  const createNewSchool = (data) => {
    setFormError(false);
    let details = {
      name: data?.school_name,
      type: schoolType?.type,
      staff_count: data?.staff_count,
      shortcode: getShortCode(data?.school_name),
      terms_private: schoolType?.type === "private" ? "quarterly" : null,
      terms_school: schoolType?.type === "school" ? schoolTerms : null,
    };
    let adminDetails = {
      email: data?.email,
      firstName: data?.first_name,
      lastName: data?.last_name,
      role: data?.role,
    };
    setFormLoading(true);
    axiosInstance
      .post("/school/new", details)
      .then((res) => {
        let schoolId = res.data.data?.school_id;
        adminDetails.schoolId = schoolId;

        axiosInstance
          .post("/admin/new", adminDetails)
          .then(() => {
            setFormLoading(false);
            toast.success(`New ${schoolType?.type} setup successfully`);
            window.location.reload();
          })
          .catch((err) => {
            axiosInstance.delete(`/school/${schoolId}`).then(() => {
              setFormLoading(false);
            });
            setFormError(
              "Error setting up admin details: " + err.response?.data?.message
            );
          });
      })
      .catch((err) => {
        setFormLoading(false);
        setFormError(err.response?.data?.message);
      });
  };

  const openEditModal = (data) => {
    setIsEditModalOpen(true);
    setCurrentSchoolDetails(data);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentSchoolDetails(null);
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
      <PageTitle title="All Schools" />
      {initialLoad ? (
        <Preloader />
      ) : (
        <Layout userType={userType}>
          <div className="flex flex-wrap justify-between items-center mb-8">
            <h1 className="head-text text-3xl font-medium"> All Schools</h1>
            <Button
              click={() => {
                setIsCreateModalOpen(true);
              }}
              type="primary"
              id="open-create-new"
              extraClasses="w-auto mb-4"
              size="big"
            >
              <span className="text-p1">Setup New school</span>
            </Button>
          </div>
          {isLoading ? (
            <div className="p-8 mt-20">
              <Loader />
            </div>
          ) : allSchools ? (
            <TableWrapper>
              <div className="scroll-table">
                {allSchools &&
                  (allSchools.length > 0 ? (
                    <Table className="w-full min-w-700px">
                      <thead>
                        <tr className="row">
                          <th>S/N</th>
                          <th>School Name</th>
                          <th>Type</th>
                          <th>Admin Name</th>
                          <th>Admin Email</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allSchools.map((data, i) => (
                          <TableRow className="p-2 row" key={`school-${i}`}>
                            <td>{i + 1}</td>
                            <td>{data.name}</td>
                            <td>{data.type.toUpperCase()}</td>
                            <td>
                              {data.adminDetails
                                ? `${data.adminDetails?.first_name} ${data.adminDetails?.last_name}`
                                : "--"}
                            </td>
                            <td>
                              {data.adminDetails?.email
                                ? data.adminDetails?.email
                                : "--"}
                            </td>
                            <td className="flex items-start justify-start">
                              <div
                                className=" w-5 h-5 cursor-pointer has-svg mr-3"
                                onClick={() => openEditModal(data)}
                              >
                                <EditIcon />
                              </div>
                              <div
                                className="w-5 h-5 cursor-pointer has-svg"
                                onClick={() => openConfirmModal(data.school_id)}
                              >
                                <DeleteIcon />
                              </div>
                            </td>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="no-data">No Users.</div>
                  ))}
              </div>
            </TableWrapper>
          ) : (
            error && (
              <div className="p-8 mt-20">
                <p className="text-center font-bold">Error fetching request.</p>
              </div>
            )
          )}
        </Layout>
      )}

      <CustomModal
        isOpen={isCreateModalOpen}
        modalLoading={formLoading}
        onRequestClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        confirmAction={() => handleSubmit(createNewSchool)()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">Set Up New School</h2>
          <p className="pb-4 text-xs">
            Add the basic required information. School/Private practice
            administrator can update the other details.
          </p>
          <div className="border-b border-neutral-200 mb-4"></div>
          <div className=" p-3">
            <form onSubmit={handleSubmit(createNewSchool)}>
              <ErrorMessage
                style={{ marginBottom: "30px" }}
                message={formError}
              />
              <div className="mb-4">
                <Controller
                  name="school_name"
                  defaultValue={null}
                  rules={{ required: true }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      checked={value}
                      label="School Name"
                      inputid="school_name"
                      name="school_name"
                      type="text"
                      iserror={error}
                      placeholder="School name"
                      message={"Please provide a school name."}
                    />
                  )}
                />
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <Select
                  selectText="Select school type:"
                  label="School Type:"
                  selected={schoolType?.label}
                >
                  <div
                    onClick={() => {
                      setSchoolType({ type: "school", label: "School" });
                    }}
                    className="p-2 text-sm border-b border-b-gray-200 cursor-pointer"
                  >
                    School
                  </div>
                  <div
                    onClick={() => {
                      setSchoolType({
                        type: "private",
                        label: "Private Practice",
                      });
                    }}
                    className="p-2 text-sm cursor-pointer"
                  >
                    Private Practice
                  </div>
                </Select>
                <Controller
                  name="staff_count"
                  defaultValue={null}
                  rules={{
                    required: true,
                    min: 1,
                    max: maxStaffCount,
                  }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      checked={value}
                      label="Number of Staff:"
                      inputid="staff_count"
                      name="staff_count"
                      type="number"
                      iserror={error}
                      placeholder="0"
                      message={
                        "Please provide the number of staff to provision for the school (at least 1)."
                      }
                    />
                  )}
                />
              </div>
              <h2 className="text-p1 font-extrabold mb-3">Admin Details</h2>
              <div className="border-b border-neutral-200 mb-4"></div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Controller
                  name="first_name"
                  defaultValue={null}
                  rules={{ required: true }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      checked={value}
                      label="First Name:"
                      inputid="first_name"
                      name="first_name"
                      type="text"
                      iserror={error}
                      placeholder="Jane"
                      message={"Please provide the name of the admin."}
                    />
                  )}
                />
                <Controller
                  name="last_name"
                  defaultValue={null}
                  rules={{ required: true }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      checked={value}
                      label="Last Name:"
                      inputid="last_name"
                      name="last_name"
                      type="text"
                      iserror={error}
                      placeholder="Doe"
                      message={"Please provide the name of the admin."}
                    />
                  )}
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Controller
                  name="email"
                  defaultValue={null}
                  rules={{ required: true, pattern: validEmailRegex }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      checked={value}
                      label="Email"
                      inputid="email"
                      name="email"
                      type="email"
                      iserror={error}
                      placeholder="email@email.com"
                      message={"Please provide a valid contact email."}
                    />
                  )}
                />
                <Controller
                  name="role"
                  defaultValue={null}
                  rules={{ required: true }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      checked={value}
                      label="Role:"
                      inputid="role"
                      name="role"
                      type="text"
                      iserror={error}
                      placeholder="School Administrator"
                      message={"Please provide the role of the admin."}
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
        onRequestClose={() => closeEditModal()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">
            Edit {currentSchoolDetails?.name}
          </h2>
        </div>
      </CustomModal>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => closeConfirmModal()}
        confirmAction={() => deleteSchool()}
        type="delete"
        message="This will delete all associated staff and school admin accounts, and all student records!"
      />
    </>
  );
};

export default Schools;
