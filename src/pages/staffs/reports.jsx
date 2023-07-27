import { useState } from "react";
import PageTitle from "../../components/pageTitle";
import { Preloader } from "../../components/pageloader";
import { useEffect } from "react";

const Reports = () => {
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    setInitialLoad(false);
  }, []);

  return (
    <>
      <PageTitle title="Reports" />
      {initialLoad ? <Preloader /> : <></>}
    </>
  );
};

export default Reports;
