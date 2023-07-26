import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import PageTitle from "../components/pageTitle";
import { ReactComponent as Logo } from "../assets/icons/logo.svg";
import { ErrorMessage } from "../components/error";
import { TextinputwithLeftIcon } from "../components/input/textinputwithicon";
import Button from "../components/button";
import axiosInstance from "../config/axios";
import { Preloader } from "../components/pageloader";

const ActivateAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userToken = searchParams.get("token");

  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { handleSubmit, control } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  useEffect(() => {
    setInitialLoad(true);
    localStorage.clear();
    axiosInstance
      .post("/validate-token", { token: userToken })
      .then((res) => {
        setInitialLoad(false);
        if (res.data.user?.isVerified) {
          toast.warning("Account already activated, kindly log in");
          navigate("/");
        } else {
          localStorage.setItem("token", userToken);
        }
      })
      .catch((err) => {
        setInitialLoad(false);
        toast.error("An error occured: " + err.response?.data?.message);
        navigate("/");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await axiosInstance.post("/change-password", data);
      setLoading(false);
      toast.success("Successfully activated account, you can now login");
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response?.data?.message);
    }
  };

  return (
    <>
      <PageTitle title="Activate Account" />
      {initialLoad ? (
        <Preloader />
      ) : (
        <div className="container mx-auto flex justify-center items-center h-screen">
          <div className="bg-slate-50 w-1/3 border rounded p-6">
            <div className="h-24 flex justify-center items-center">
              <Logo />
            </div>
            <p className="text-center text-h5 mb-4">Activate Account</p>
            <p className="text-p3 font-extrabold mb-4">
              Please enter the password sent to you via email and set a new
              password to activate your account
            </p>
            <div className="border-b border-neutral-200 mb-6"></div>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ErrorMessage
                  style={{ marginBottom: "30px" }}
                  message={errorMessage}
                />
                <div className="mb-4">
                  <Controller
                    name="oldPassword"
                    defaultValue={null}
                    rules={{ required: true }}
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextinputwithLeftIcon
                        onChange={onChange}
                        onclickicon={() => {
                          setShowOldPassword(!showOldPassword);
                        }}
                        checked={value}
                        label="Current Password(from email)"
                        name="oldPassword"
                        inputid="oldPassword"
                        type={showOldPassword ? "text" : "password"}
                        iserror={error}
                        placeholder="........"
                        message={"please enter a valid password"}
                      />
                    )}
                  />
                </div>
                <div className="mb-4">
                  <Controller
                    name="newPassword"
                    defaultValue={null}
                    rules={{ required: true, minLength: 8 }}
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextinputwithLeftIcon
                        onChange={onChange}
                        onclickicon={() => setShowNewPassword(!showNewPassword)}
                        checked={value}
                        label="New Password"
                        name="newPassword"
                        inputid="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        iserror={error}
                        placeholder="........"
                        message={
                          "please enter a valid password(at least 8 characters)"
                        }
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Button
                    click={handleSubmit(onSubmit)}
                    type="primary"
                    id="activate-submit"
                    extraClasses="w-full mb-4"
                    size="big"
                    disabled={loading}
                  >
                    <span className="text-p1">Activate Account</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivateAccount;
