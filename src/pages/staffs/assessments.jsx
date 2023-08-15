/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MultiSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../components/pageTitle";
import { Preloader } from "../../components/pageloader";
import { Placeholder } from "../../components/placeholder";
import Layout from "../../components/layout";
import axiosInstance from "../../config/axios";
import { Controller, useForm } from "react-hook-form";
import { tokenValidSuccess } from "../../store/slices/authSlice";
import { ErrorMessage } from "../../components/error";
import { Textinput } from "../../components/input/textinput";
import Button from "../../components/button";
import { Table, TableWrapper, TableRow } from "../../components/table";
import { ReactComponent as BackIcon } from "../../assets/icons/arrow-left.svg";
import { Select } from "../../components/input/select";
import { FileIcon } from "../../assets/icons/file";

const Assessments = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);

  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [staffDetails, setStaffDetails] = useState(null);

  const [allStudents, setAllStudents] = useState(null);
  const [switchView, setSwitchView] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentCurriculums, setSelectedStudentCurriculums] =
    useState(null);
  const [allAssessment, setAllAssessment] = useState(null);
  const [allTargets, setAllTargets] = useState(null);

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

  const showStudentAssessments = (student) => {
    setSwitchView(false);
    setIsLoading(true);
    setSelectedStudent(student);
    axiosInstance
      .get(`/assessments/${student?.student_id}`)
      .then((res) => {
        setAllAssessment(res.data?.data?.assessments);
        axiosInstance
          .get(`/curriculums/${student?.student_id}`)
          .then((res) => {
            setSelectedStudentCurriculums(res.data.data?.curriculums);
            axiosInstance
              .get(`/targets/all/${student?.student_id}`)
              .then((res) => {
                setIsLoading(false);
                setAllTargets(res.data?.data?.allTargets);
              });
          })
          .catch((err) => {
            setIsLoading(false);
            setPageError("An error occurred: " + err.response?.data?.message);
            setSelectedStudentCurriculums(null);
            setSelectedStudent(null);
            setAllAssessment(null);
          });
      })
      .catch((err) => {
        setIsLoading(false);
        setPageError("An error occurred: " + err.response?.data?.message);
        setSelectedStudentCurriculums(null);
        setSelectedStudent(null);
        setAllAssessment(null);
      });
  };

  const viewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setSwitchView(true);
    setIsUpdate(true);
  };

  return (
    <>
      <PageTitle title="Assessments" />
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
                          onClick={() => showStudentAssessments(student)}
                        >
                          {student.first_name} {student.last_name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <div className="col-span-9">
                {switchView ? (
                  <AssessComponent
                    isUpdate={isUpdate}
                    goBack={() => setSwitchView(false)}
                    currDetails={selectedAssessment}
                    allStudentCurriculums={selectedStudentCurriculums}
                    allStudentTargets={allTargets}
                    studentId={selectedStudent?.student_id}
                    setCurrDetails={setSelectedAssessment}
                  />
                ) : allAssessment ? (
                  <>
                    <div className="p-8 flex items-center justify-between">
                      <h1 className="head-text text-3xl font-medium mb-2">
                        {selectedStudent?.first_name}{" "}
                        {selectedStudent?.last_name}
                      </h1>
                      <Button
                        click={() => {
                          setSwitchView(true);
                          setIsUpdate(false);
                        }}
                        type="primary"
                        id="open-create-new"
                        extraClasses="w-auto ml-2"
                        size="big"
                      >
                        <span className="text-p1">Add New Assessment</span>
                      </Button>
                    </div>
                    {allAssessment.length > 0 ? (
                      <div className="mt-4 grid grid-cols-5 gap-3 px-8">
                        {allAssessment.map((assessment, i) => (
                          <div
                            className="col-span-1 cursor-pointer p-3 rounded-lg border border-solid border-stone-100 bg-stone-50 box-shadow"
                            key={`assessment-${i}`}
                            onClick={() => viewAssessment(assessment)}
                          >
                            <div className="py-2">
                              <FileIcon />
                            </div>
                            <h3 className="text-lg font-medium mb-1">
                              {assessment?.academic_year}
                            </h3>
                            <p className="text-sm mb-1">{assessment?.term}</p>
                            <p className="italic text-gray-400 text-xs">
                              Week {assessment?.week}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="my-20 text-center">
                        <div className="mb-3">
                          No Assessments recorded yet for this student
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Placeholder
                    message={
                      "Select a student to view all recorded assessments"
                    }
                  />
                )}
              </div>
            </div>
          )}
        </Layout>
      )}
    </>
  );
};
export default Assessments;

const AssessComponent = ({
  isUpdate,
  goBack,
  currDetails,
  allStudentCurriculums,
  allStudentTargets,
  studentId,
  setCurrDetails,
}) => {
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [yearTerm, setYearTerm] = useState({
    year: "",
    term: "",
  });

  const { handleSubmit, control, reset, setValue } = useForm({
    criteriaMode: "all",
    mode: "onSubmit",
  });
  let targetOptions = allStudentTargets.map((target) => {
    return {
      value: target?.target_id,
      label: target?.title,
      prev_rating: target?.success_rating,
    };
  });

  useEffect(() => {
    if (currDetails) {
      setValue("baseline_summary", currDetails?.baseline_summary);
      setValue("improvement", currDetails?.improvement);
      setValue("comments", currDetails?.comments);
      let preloadedOptions = currDetails.targets_ratings.map((target) => {
        const option = targetOptions.find(
          (option) => option.value == target.target_id
        );
        if (option) {
          return { ...option, prev_rating: target.success_rating };
        }
        return null;
      });
      setSelectedTargets(preloadedOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNewAssessment = (data) => {
    let details = {
      week: data.week,
      studentId,
      targets_ratings:
        selectedTargets.length > 0
          ? selectedTargets.map((target, i) => ({
              target_id: target.value,
              prev_rating: target.prev_rating,
              success_rating: parseInt(ratings[i]),
            }))
          : [],
      academic_year: yearTerm.year,
      term: yearTerm.term,
      baseline_summary: data.baseline_summary,
      improvement: data.improvement,
      comments: data.comments,
    };
    setFormLoading(true);
    axiosInstance
      .post("/assessment/new", details)
      .then(() => {
        setFormLoading(false);
        toast.success(`Added successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setFormLoading(false);
        setFormError("An error occurred: " + err.response?.data?.message);
      });
  };

  const updateAssessment = (data) => {
    let details = {
      baseline_summary: data.baseline_summary,
      improvement: data.improvement,
      comments: data.comments,
      targets_ratings: selectedTargets.map((target, i) => ({
        target_id: target.value,
        prev_rating: target.success_rating,
        success_rating: parseInt(ratings[i]),
      })),
    };
    setFormLoading(true);
    axiosInstance
      .put(`/assessment/${currDetails?.id}`, details)
      .then(() => {
        setFormLoading(false);
        toast.success(`Updated successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        setFormLoading(false);
        setFormError("An error occurred: " + err.response?.data?.message);
      });
  };

  const updateRatings = (index, value) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = value;
    setRatings(updatedRatings);
  };

  return (
    <div className="p-8">
      <div
        className="flex cursor-pointer items-center mb-3"
        onClick={() => {
          goBack();
          reset();
          setCurrDetails(null);
        }}
      >
        <div className=" w-5 h-5 has-svg mr-3">
          <BackIcon />
        </div>
        <p className="text-xs text-bold">Back</p>
      </div>
      <h3 className="head-text text-3xl font-medium mb-2">
        {isUpdate ? "Update Assessment" : "Add New Assessment"}
      </h3>
      {!isUpdate && (
        <p className="italic text-p2 mb-5 text-gray-400">
          You cannot edit addressed targets after creation
        </p>
      )}
      <ErrorMessage style={{ marginBottom: "30px" }} message={formError} />
      <form
        onSubmit={
          isUpdate
            ? handleSubmit(updateAssessment)
            : handleSubmit(addNewAssessment)
        }
        className="grid grid-cols-7 gap-4 my-8 bg-zinc-50 border border-gray-200 rounded-md"
      >
        <div className="col-span-4 self-start border-r border-gray-200 p-4 pb-0">
          {isUpdate ? (
            <>
              <div className="mb-2 grid grid-cols-2 gap-4">
                <Textinput
                  value={currDetails?.week}
                  label="Week:"
                  inputid="week"
                  name="week"
                  type="text"
                  disabled={true}
                />
                <Textinput
                  value={`${currDetails?.academic_year}, ${currDetails?.term}`}
                  label="For Curriculum:"
                  inputid="curriculum"
                  name="curriculum"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="mb-2">
                <span className="text-p2 font-medium text-type capitalize mr-2">
                  Baseline Summary:
                </span>
                <Controller
                  name="baseline_summary"
                  defaultValue={currDetails?.baseline_summary}
                  rules={{
                    required: true,
                  }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <textarea
                        onChange={onChange}
                        value={value}
                        className={`form-input rounded mt-1 mb-0 ${
                          error ? "border-red-500" : "border-neutral-200"
                        } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                        id="baseline_summary"
                        name="baseline_summary"
                        rows={3}
                      />
                      {error && (
                        <p className="text-p4 italic text-red-500">
                          Enter some notes
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="mb-2">
                <span className="text-p2 font-medium text-type capitalize mr-2">
                  Improvements:
                </span>
                <Controller
                  name="improvement"
                  defaultValue={currDetails?.improvement}
                  rules={{
                    required: true,
                  }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <textarea
                        onChange={onChange}
                        value={value}
                        className={`form-input rounded mt-1 mb-0 ${
                          error ? "border-red-500" : "border-neutral-200"
                        } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                        id="improvement"
                        name="improvement"
                        rows={3}
                      />
                      {error && (
                        <p className="text-p4 italic text-red-500">
                          Enter some notes
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="mb-2">
                <span className="text-p2 font-medium text-type capitalize mr-2">
                  Comments:
                </span>
                <Controller
                  name="comments"
                  defaultValue={currDetails.comments}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <textarea
                        onChange={onChange}
                        value={value}
                        className={`form-input rounded mt-1 mb-0 ${
                          error ? "border-red-500" : "border-neutral-200"
                        } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                        id="comments"
                        name="comments"
                        rows={3}
                      />
                    </>
                  )}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-2 grid grid-cols-2 gap-5">
                <Controller
                  name="week"
                  defaultValue=""
                  rules={{
                    required: true,
                    min: 1,
                    max: 12,
                  }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Textinput
                      onChange={onChange}
                      value={value}
                      label="Week:"
                      inputid="week"
                      name="week"
                      type="number"
                      iserror={error}
                      placeholder="0"
                      message={"Please enter the week (at least 1)."}
                    />
                  )}
                />
                <Controller
                  name="curr"
                  defaultValue=""
                  rules={{ required: true }}
                  control={control}
                  render={({ fieldState: { error } }) => (
                    <>
                      <Select
                        selectText="Select:"
                        label="Academic Year:"
                        selected={
                          yearTerm?.year && yearTerm?.term
                            ? `${yearTerm?.year}, ${yearTerm?.term}`
                            : ""
                        }
                        error={error}
                        message="Select one"
                      >
                        {allStudentCurriculums.map((curr, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setYearTerm({
                                year: curr?.academic_year,
                                term: curr?.term,
                              });
                              setValue("curr", "curr");
                            }}
                            className="p-2 text-sm border-b border-b-gray-200 last:border-none cursor-pointer"
                          >
                            {curr?.academic_year}, {curr?.term}
                          </div>
                        ))}
                      </Select>
                    </>
                  )}
                />
              </div>
              <div className="mb-2">
                <Controller
                  name="selected_targets"
                  defaultValue=""
                  control={control}
                  render={() => (
                    <>
                      <label className="text-p2 font-medium text-type">
                        Targets addressed:
                      </label>
                      <MultiSelect
                        defaultValue=""
                        isMulti
                        name="selected_targets"
                        options={targetOptions}
                        className="mt-1"
                        classNamePrefix="select"
                        closeMenuOnSelect={true}
                        hideSelectedOptions={true}
                        isClearable={true}
                        onChange={(selected) => {
                          setSelectedTargets(selected);
                        }}
                      />
                    </>
                  )}
                />
              </div>
              <div className="mb-2">
                <span className="text-p2 font-medium text-type capitalize mr-2">
                  Baseline Summary:
                </span>
                <Controller
                  name="baseline_summary"
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <textarea
                        onChange={onChange}
                        value={value}
                        className={`form-input rounded mt-1 mb-0 ${
                          error ? "border-red-500" : "border-neutral-200"
                        } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                        id="baseline_summary"
                        name="baseline_summary"
                        rows={3}
                      />
                      {error && (
                        <p className="text-p4 italic text-red-500">
                          Enter some notes
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="mb-2">
                <span className="text-p2 font-medium text-type capitalize mr-2">
                  Improvements:
                </span>
                <Controller
                  name="improvement"
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <textarea
                        onChange={onChange}
                        value={value}
                        className={`form-input rounded mt-1 mb-0 ${
                          error ? "border-red-500" : "border-neutral-200"
                        } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                        id="improvement"
                        name="improvement"
                        rows={3}
                      />
                      {error && (
                        <p className="text-p4 italic text-red-500">
                          Enter some notes
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="mb-2">
                <span className="text-p2 font-medium text-type capitalize mr-2">
                  Comments:
                </span>
                <Controller
                  name="comments"
                  defaultValue=""
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <textarea
                        onChange={onChange}
                        value={value}
                        className={`form-input rounded mt-1 mb-0 ${
                          error ? "border-red-500" : "border-neutral-200"
                        } focus:border-type focus:ring-0 bg-neutral-300 text-type`}
                        id="comments"
                        name="comments"
                        rows={3}
                      />
                    </>
                  )}
                />
              </div>
            </>
          )}
        </div>
        <div className="col-span-3 p-4 pb-0">
          {selectedTargets && selectedTargets.length > 0 ? (
            <div className="mb-2">
              <label className="text-p2 font-medium text-type">
                Update progress to completion:
              </label>
              <TableWrapper>
                <div className="scroll-table">
                  <Table className="w-full">
                    <thead>
                      <tr className="row">
                        <th>Target</th>
                        <th>Current rating</th>
                        <th>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTargets.map((data, i) => (
                        <TableRow
                          className="p-2 row"
                          key={`target-update-${i}`}
                        >
                          <td>{data.label}</td>
                          <td>{data.prev_rating}%</td>
                          <td className="w-20">
                            <Controller
                              name={`update-rating-[${i}]`}
                              defaultValue=""
                              rules={{ required: true, min: 0, max: 100 }}
                              control={control}
                              render={({
                                field: { onChange, value },
                                fieldState: { error },
                              }) => (
                                <Textinput
                                  onChange={(e) => {
                                    onChange(e);
                                    updateRatings(i, e.target.value);
                                  }}
                                  value={value}
                                  inputid={`update-rating-[${i}]`}
                                  name={`update-rating-[${i}]`}
                                  type="number"
                                  iserror={error}
                                  placeholder="0"
                                  message={"Please enter a valid value"}
                                  rowType
                                />
                              )}
                            />
                          </td>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </TableWrapper>
            </div>
          ) : (
            <div className="text-center my-24">
              {isUpdate ? "No targets" : "Targets added will show here"}
            </div>
          )}
        </div>
        <div className="col-span-7 border-b border-neutral-200 -mt-4 m-4"></div>
        <div className="my-0 w-min mx-4">
          <Button
            click={
              isUpdate
                ? handleSubmit(updateAssessment)
                : handleSubmit(addNewAssessment)
            }
            type="primary"
            id="school-update"
            extraClasses="w-full mb-4"
            size="big"
            disabled={formLoading}
          >
            <span className="text-p1">{isUpdate ? "Save" : "Submit"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
