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
import { Select } from "../../components/input/select";
import { Textinput } from "../../components/input/textinput";
import { starFrameworks, privateTerms, maxStaffCount } from "../../config";
import Button from "../../components/button";
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";

const matchForValue = (arr, val) => {
  let match = arr.find((item) => item.val == val);
  return match.label;
};

const Profile = () => {
  const token = localStorage.getItem("token");
  const type = useSelector((state) => state.auth.userType);

  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);
  const [framework, setFramework] = useState({
    val: "",
    label: "",
  });
  const [termsPrivate, setTermsPrivate] = useState({
    val: "",
    label: "",
  });
  const { handleSubmit, control } = useForm({
    criteriaMode: "all",
    mode: "onSubmit",
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

  const getAdminProfile = () => {
    setIsLoading(true);
    setPageError(false);
    axiosInstance
      .get("/admin")
      .then((res) => {
        setIsLoading(false);
        setAdminDetails(res.data?.data);

        if (res.data?.data?.schoolDetails?.type == "private") {
          setTermsPrivate({
            val: res.data?.data?.schoolDetails?.terms_private,
            label: matchForValue(
              privateTerms,
              res.data?.data?.schoolDetails?.terms_private
            ),
          });
        }
        setFramework({
          val: res.data?.data?.schoolDetails?.framework,
          label: matchForValue(
            starFrameworks,
            res.data?.data?.schoolDetails?.framework
          ),
        });
      })
      .catch(() => {
        setIsLoading(false);
        setPageError(true);
      });
  };

  const saveSchoolUpdates = (data) => {
    setFormLoading(true);
    setFormError(false);
    let details = {
      address: data.address,
      website: data.website,
      staff_count: data.staff_count,
      framework: framework.val,
      terms_private: termsPrivate.val,
    };
    axiosInstance
      .put(`/school/${adminDetails?.school_id}`, details)
      .then(() => {
        setFormLoading(false);
        toast.success("Successfully updated school profile");
      })
      .catch((err) => {
        setFormLoading(false);
        setFormError(err.response?.data?.message);
      });
  };

  const saveAdminUpdates = (data) => {
    setFormLoading(true);
    setFormError(false);
    let details = {
      first_name: data.fname,
      last_name: data.lname,
    };
    axiosInstance
      .put(`/admin/${adminDetails?.admin_id}`, details)
      .then(() => {
        setFormLoading(false);
        toast.success("Successfully updated admin profile");
      })
      .catch((err) => {
        setFormLoading(false);
        setFormError(err.response?.data?.message);
      });
  };

  return (
    <>
      <PageTitle title="All Reports" />
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
          ) : pageError ? (
            <p className="w-full text-center my-4 p-5">
              Could not complete the request.
            </p>
          ) : (
            <div className="py-14 px-10">
              <div className="flex items-baseline mb-8">
                <h1 className="head-text text-3xl font-medium">
                  School Profile Details
                </h1>
                <div
                  className="w-5 h-5 cursor-pointer ml-2.5 has-svg"
                  onClick={() => alert()}
                  data-tooltip-id="info"
                  data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                    <div>
                      Only fields editable/viewable by school admins are shown.{" "}
                      <br /> For more changes, please contact
                      sneducate@outlook.com.
                    </div>
                  )}
                  data-tooltip-place="right"
                >
                  <InfoIcon />
                  <Tooltip id="info" />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4 my-8 bg-zinc-50">
                <div className="col-span-4 self-start border border-gray-200 rounded-md p-4">
                  <form onSubmit={handleSubmit(saveSchoolUpdates)}>
                    <ErrorMessage
                      style={{ marginBottom: "30px" }}
                      message={formError}
                    />
                    <div className="mb-4">
                      <Textinput
                        value={adminDetails?.schoolDetails?.name}
                        label="School Name"
                        inputid="school_name"
                        name="school_name"
                        type="text"
                        disabled={true}
                        rowType
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-5">
                      <Textinput
                        value={adminDetails?.schoolDetails?.shortcode}
                        label="Shortcode"
                        inputid="shortcode"
                        name="shortcode"
                        type="text"
                        disabled={true}
                        rowType
                        labelClasses="col-span-2"
                        inputClasses="col-span-3"
                      />
                      <Textinput
                        value={adminDetails?.schoolDetails?.type.toUpperCase()}
                        label="School Type"
                        inputid="type"
                        name="type"
                        type="text"
                        disabled={true}
                        rowType
                        labelClasses="col-span-2"
                        inputClasses="col-span-3"
                      />
                    </div>
                    {adminDetails?.schoolDetails?.type === "school" && (
                      <div className="mb-4">
                        <Textinput
                          value="3 Terms (National school calendar)"
                          label="School Terms"
                          inputid="school_terms"
                          name="school_terms"
                          type="text"
                          disabled={true}
                          rowType
                        />
                      </div>
                    )}
                    <div className="mb-4">
                      <Controller
                        name="address"
                        defaultValue={adminDetails?.schoolDetails?.address}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Textinput
                            onChange={onChange}
                            value={value}
                            label="Address"
                            inputid="address"
                            name="address"
                            type="text"
                            placeholder="Address"
                            rowType
                          />
                        )}
                      />
                    </div>
                    <div className="mb-4">
                      <Controller
                        name="website"
                        defaultValue={adminDetails?.schoolDetails?.website}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Textinput
                            onChange={onChange}
                            value={value}
                            label="Website"
                            inputid="website"
                            name="website"
                            type="text"
                            placeholder="https://www.school.com"
                            rowType
                          />
                        )}
                      />
                    </div>

                    {adminDetails?.schoolDetails?.type === "private" && (
                      <div className="mt-8 mb-4">
                        <Select
                          selectText="Select frequency:"
                          label="Students' Review Schedule:"
                          selected={termsPrivate?.label}
                        >
                          {privateTerms.map((term, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setTermsPrivate({
                                  val: term?.val,
                                  label: term?.label,
                                });
                              }}
                              className="p-2 text-sm border-b border-b-gray-200 cursor-pointer last:border-none"
                            >
                              {term?.label}
                            </div>
                          ))}
                        </Select>
                      </div>
                    )}
                    <div className="mb-4 grid grid-cols-2 gap-5">
                      <Controller
                        name="staff_count"
                        defaultValue={adminDetails?.schoolDetails?.staff_count}
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
                            value={value}
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
                      <Select
                        selectText="Select framework:"
                        label="Students' Evaluation Framework:"
                        selected={framework?.label}
                      >
                        {starFrameworks.map((framework, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setFramework({
                                val: framework?.val,
                                label: framework?.label,
                              });
                            }}
                            className="p-2 text-sm border-b border-b-gray-200 last:border-none cursor-pointer"
                          >
                            {framework?.label}
                          </div>
                        ))}
                      </Select>
                    </div>
                    <div className="border-b border-neutral-200 mt-7 mb-4"></div>
                    <div className="mb-4 w-min">
                      <Button
                        click={handleSubmit(saveSchoolUpdates)}
                        type="primary"
                        id="school-update"
                        extraClasses="w-full mb-4"
                        size="big"
                        disabled={formLoading}
                      >
                        <span className="text-p1">Update</span>
                      </Button>
                    </div>
                  </form>
                </div>
                <div className="col-span-3 self-start border border-gray-200 rounded-md p-4">
                  <form onSubmit={handleSubmit(saveAdminUpdates)}>
                    <h2 className="text-p1 font-extrabold mb-3">
                      Admin Details
                    </h2>
                    <div className="border-b border-neutral-200 mb-4"></div>
                    <ErrorMessage
                      style={{ marginBottom: "30px" }}
                      message={formError}
                    />
                    <div className="mb-4">
                      <Textinput
                        value={adminDetails?.email}
                        label="Email"
                        inputid="admin_email"
                        name="admin_email"
                        type="text"
                        disabled={true}
                        rowType
                      />
                    </div>
                    <div className="mb-4">
                      <Controller
                        name="fname"
                        defaultValue={adminDetails?.first_name}
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
                            message={"Please provide your name."}
                            rowType
                          />
                        )}
                      />
                    </div>
                    <div className="mb-4">
                      <Controller
                        name="lname"
                        defaultValue={adminDetails?.last_name}
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
                            message={"Please provide your name."}
                            rowType
                          />
                        )}
                      />
                    </div>
                    <div className="border-b border-neutral-200 mt-7 mb-4"></div>
                    <div className="mb-4 w-min">
                      <Button
                        click={handleSubmit(saveAdminUpdates)}
                        type="primary"
                        id="admin-update"
                        extraClasses="w-full mb-4"
                        size="big"
                        disabled={formLoading}
                      >
                        <span className="text-p1">Update</span>
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </Layout>
      )}
    </>
  );
};

export default Profile;
