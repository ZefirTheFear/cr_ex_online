import type { NextPage } from "next";

import NotFound from "../components/NotFound/NotFound";

const NotFoundPage: NextPage = () => {
  console.log("not found");
  return <NotFound />;
};

export default NotFoundPage;
