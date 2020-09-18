import React, { useState, useEffect } from "react";
import "rsuite/dist/styles/rsuite-default.css";

import NavBarInstance from "./Components/Navbar";
import MainRoutes from "./MainRoutes";

const App = () => {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <>
      <NavBarInstance
        appearance="inverse"
        activeKey={activeKey}
        onSelect={(e) => setActiveKey(e)}
      />
      <MainRoutes />
    </>
  );
};

export default App;
