import { Helmet } from "react-helmet-async";

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | GarmentTrack</title>
    </Helmet>
  );
};

export default PageTitle;
