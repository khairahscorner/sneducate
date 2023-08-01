/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as LogoIcon } from "../assets/icons/logo.svg";

const Layout = (props) => {
  const { children, userType, userDetails } = props;

  const logOut = () => {
    localStorage.removeItem("token");
    toast.info("Successfully logged out");
    window.location.reload();
  };

  const openGuide = () => {
    if (userType === "school_admin") {
      console.log("Admin");
    } else if (userType === "staff") {
      console.log(" Staff");
    }
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 bottom-0 left-0 w-52 bg-zinc-100">
        <div className="h-full py-20 border-r border-solid border-gray-200">
          <div className="flex justify-between items-center -mt-6">
            <div className="w-full has-svg">
              <LogoIcon />
            </div>
          </div>
          <ul className="space-y-4 text-sm">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "active nav-link px-10 py-3"
                    : "nav-link px-10 py-3"
                }
              >
                <div className="text-lg">Dashboard</div>
              </NavLink>
            </li>
            {userType === "dev" ? (
              <li>
                <NavLink
                  to="/schools"
                  className={({ isActive }) =>
                    isActive
                      ? "active nav-link px-10 py-3"
                      : "nav-link px-10 py-3"
                  }
                >
                  <div className="text-lg">Schools</div>
                </NavLink>
              </li>
            ) : userType === "school_admin" ? (
              <>
                <li>
                  <NavLink
                    to="/school/profile"
                    className={({ isActive }) =>
                      isActive
                        ? "active nav-link px-10 py-3"
                        : "nav-link px-10 py-3"
                    }
                  >
                    <div className="text-lg">School Profile</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/school/staffs"
                    className={({ isActive }) =>
                      isActive
                        ? "active nav-link px-10 py-3"
                        : "nav-link px-10 py-3"
                    }
                  >
                    <div className="text-lg">Staff Directory</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/school/students"
                    className={({ isActive }) =>
                      isActive
                        ? "active nav-link px-10 py-3"
                        : "nav-link px-10 py-3"
                    }
                  >
                    <div className="text-lg">Student Directory</div>
                  </NavLink>
                </li>
              </>
            ) : userType === "staff" ? (
              <>
                <li>
                  <NavLink
                    to="/students"
                    className={({ isActive }) =>
                      isActive
                        ? "active nav-link px-10 py-3"
                        : "nav-link px-10 py-3"
                    }
                  >
                    <div className="text-lg">Students</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/term-curriculums"
                    className={({ isActive }) =>
                      isActive
                        ? "active nav-link px-10 py-3"
                        : "nav-link px-10 py-3"
                    }
                  >
                    <div className="text-lg">IEPs</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assessments"
                    className={({ isActive }) =>
                      isActive
                        ? "active nav-link px-10 py-3"
                        : "nav-link px-10 py-3"
                    }
                  >
                    <div className="text-lg">Assessments</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                      isActive
                        ? "active nav-link px-10 py-3"
                        : "nav-link px-10 py-3"
                    }
                  >
                    <div className="text-lg">Reports</div>
                  </NavLink>
                </li>
              </>
            ) : null}
            <li>
              <a className="nav-link px-10 py-3" onClick={() => logOut()}>
                <div className="text-lg">Logout</div>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      {/* Main Content */}
      <main className="ml-52">
        {userType !== "dev" && (
          <div className="bg-zinc-100 border-b border-gray-200 p-5 flex items-center justify-between flex-row-reverse pr-9">
            <div className=" flex items-center">
              <p className="text-bold mr-2 capitalize">
                {userDetails?.schoolName}
              </p>
              <span className="px-1.5 py-0.5 rounded-full text-bold text-white text-p4 bg-status-good">
                {userDetails?.role}
              </span>
            </div>
            <div>
              <span
                onClick={openGuide}
                className="px-3 py-2 cursor-pointer rounded-xl text-bold text-type text-p3 bg-primary-bg"
              >
                Guide⭐️
              </span>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
