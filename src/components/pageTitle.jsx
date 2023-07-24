/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet";

const appName = "SNEducate";

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{appName} - {title}</title>
    </Helmet>
  );
};

export default PageTitle;
