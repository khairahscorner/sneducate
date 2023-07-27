import { useState } from "react";
import PageTitle from "../../components/pageTitle";
import { Preloader } from "../../components/pageloader";
import { useEffect } from "react";

const TermCurriculums = () => {
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    setInitialLoad(false);
  }, []);

  return (
    <>
      <PageTitle title="Term Curriculums" />
      {initialLoad ? <Preloader /> : <></>}
    </>
  );
};

export default TermCurriculums;
