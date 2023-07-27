import { useState } from "react";
import PageTitle from "../../components/pageTitle";
import { Preloader } from "../../components/pageloader";
import { useEffect } from "react";

const Staffs = () => {
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    setInitialLoad(false);
  }, []);

  return (
    <>
      <PageTitle title="All Staff" />
      {initialLoad ? <Preloader /> : <></>}
    </>
  );
};
export default Staffs;
