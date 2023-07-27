import { useState } from "react";
import PageTitle from "../../components/pageTitle";
import { Preloader } from "../../components/pageloader";
import { useEffect } from "react";

const Students = () => {
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    setInitialLoad(false);
  }, []);

  return (
    <>
      <PageTitle title="All Students" />
      {initialLoad ? <Preloader /> : <></>}
    </>
  );
};

export default Students;
