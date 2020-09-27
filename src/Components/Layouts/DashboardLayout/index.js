import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import useWindowDimensions from "../../../Hooks/windowDimensionHook";
import NavigationInstance from "../../Navigation/index";

export default function DashboardLayout(props) {
  // const history = useHistory();
  const { height, width } = useWindowDimensions();
  const [activeKey, setActiveKey] = useState(null);

  return (
    <NavigationInstance
      appearance="inverse"
      activeKey={activeKey}
      onSelect={(e) => setActiveKey(e)}
    />
  );
}
