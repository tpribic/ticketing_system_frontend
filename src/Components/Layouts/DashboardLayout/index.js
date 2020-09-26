import React from "react";
import { Container, Content, FlexboxGrid, Footer, Header, Panel } from "rsuite";
import { useHistory } from "react-router-dom";
import useWindowDimensions from "../../../Hooks/windowDimensionHook";
import { Sidenav, Nav, Icon, Dropdown } from "rsuite";

export default function DashboardLayout(props) {
  const history = useHistory();
  const { height, width } = useWindowDimensions();
  return (
    <>

    </>
  );
}
