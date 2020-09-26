import React from "react";
import { Container, Content, FlexboxGrid, Footer, Header, Panel } from "rsuite";
import { useHistory } from "react-router-dom";
import useWindowDimensions from "../../../Hooks/windowDimensionHook";
import Register from "../../RegisterForm";
import Login from "../../LoginForm";

export default function AuthLayout(props) {
  const history = useHistory();
  const { height, width } = useWindowDimensions();
  return (
    <Container style={{ height: "calc(100vh - 56px)" }}>
      <FlexboxGrid
        style={{ height: "inherit" }}
        justify="center"
        align="middle"
      >
        <FlexboxGrid.Item
          style={width > 767 ? {minWidth: 450} : {minWidth: 300}}
          colspan={8}
        >
          <Content style={{ padding: "10px 30px" }}>
            <Panel
              header={
                history.location.pathname === "/register" ? (
                  <h3>Register</h3>
                ) : (
                  <h3>Login</h3>
                )
              }
              bordered
            >
              {history.location.pathname === "/register" ? (
                <Register />
              ) : (
                <Login />
              )}
            </Panel>
          </Content>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Container>
  );
}
