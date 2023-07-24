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

const Schools = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);

  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState(type);
  const [allSchools, setAllSchools] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSchoolDetails, setCurrentSchoolDetails] = useState(null);
  const [currentId, setCurrentId] = useState(null);

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
      });
  };
  const deleteSchool = () => {
    setIsLoading(true);
    axiosInstance
      .get(`/school/${currentId}`)
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

  const openCreateNewModal = () => {
    setIsCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
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
              click={() => openCreateNewModal()}
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
                              {data.adminDetails?.first_name}{" "}
                              {data.adminDetails?.last_name}
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
        onRequestClose={() => closeCreateModal()}
      >
        <div>
          <h2 className=" text-h3 font-bold mb-3">Set Up New School</h2>
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
