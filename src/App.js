import React, { useState, useEffect } from "react";
import "rsuite/dist/styles/rsuite-default.css";

import NavigationInstance from "./Components/Navigation";
import MainRoutes from "./MainRoutes";

const App = () => {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <>
      <NavigationInstance
        appearance="inverse"
        activeKey={activeKey}
        onSelect={(e) => setActiveKey(e)}
      />
      <MainRoutes />
    </>
  );
};

export default App;
