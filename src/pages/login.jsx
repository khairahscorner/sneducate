import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import PageTitle from "../components/pageTitle";
import { ReactComponent as Logo } from "../assets/icons/logo.svg";
import { ErrorMessage } from "../components/error";
import { TextinputwithLeftIcon } from "../components/input/textinputwithicon";
import { Textinput } from "../components/input/textinput";
import Button from "../components/button";
import axiosInstance from "../config/axios";
import { useNavigate } from "react-router-dom";
import { Preloader } from "../components/pageloader";

const Login = () => {
  const token = localStorage.getItem("token");
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isPassword, setIsPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { handleSubmit, control } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  useEffect(() => {
    if (token) {
      setInitialLoad(true);
      axiosInstance
        .get("/authenticate")
        .then(() => {
          setInitialLoad(false);
          navigate("/dashboard");
        })
        .catch(() => {
          setInitialLoad(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeinputField = () => {
    setIsPassword(!isPassword);
  };

  const onSubmit = (data) => {
    let details = {
      email: data.email,
      password: data.password,
    };
    loginFunc(details);
  };

  const loginFunc = async (data) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await axiosInstance.post("/login", data);
      setLoading(false);
      toast.success("Login Successful");
      localStorage.setItem("token", response.data.data.token);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response?.data?.message);
    }
  };

  return (
    <>
      <PageTitle title="Login" />
      {initialLoad ? (
        <Preloader />
      ) : (
        <div className="container mx-auto flex justify-center items-center h-screen">
          <div className="bg-slate-50 w-1/3 border rounded p-6">
            <div className="h-24 flex justify-center items-center">
              <Logo />
            </div>
            <p className="text-center text-h5 mb-4">Login</p>
            <div className="border-b border-neutral-200 mb-4"></div>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ErrorMessage
                  style={{ marginBottom: "30px" }}
                  message={errorMessage}
                />
                <div className="mb-4">
                  <Controller
                    name="email"
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
                        label="Email"
                        inputid="email"
                        name="email"
                        type="email"
                        iserror={error}
                        placeholder="name@email.com"
                        message={"Please provide an email address."}
                      />
                    )}
                  />
                </div>
                <div className="mb-4">
                  <Controller
                    name="password"
                    defaultValue={null}
                    rules={{ required: true }}
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextinputwithLeftIcon
                        onChange={onChange}
                        onclickicon={changeinputField}
                        checked={value}
                        label="Password"
                        name="password"
                        inputid="password"
                        type={isPassword ? "password" : "text"}
                        iserror={error}
                        placeholder="password"
                        message={"please enter a password"}
                      />
                    )}
                  />
                </div>
                <div className="">
                  <Button
                    click={handleSubmit(onSubmit)}
                    type="primary"
                    id="login-submit"
                    extraClasses="w-full mb-4"
                    size="big"
                    disabled={loading}
                  >
                    <span className="text-p1">Log In</span>
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

export default Login;
