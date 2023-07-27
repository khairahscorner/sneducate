import { useState } from "react";
import PageTitle from "../../components/pageTitle";
import { Preloader } from "../../components/pageloader";
import { useEffect } from "react";

const Profile = () => {
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    setInitialLoad(false);
  }, []);

  return (
    <>
      <PageTitle title="School Profile" />
      {initialLoad ? <Preloader /> : <></>}
    </>
  );
};
export default Profile;
