import React, { useState } from "react";

const RoleContext = React.createContext();

const RoleProvider = (props) => {
  const [roles, setRoles] = useState(null);

  return (
    <RoleContext.Provider value={{ roles: roles, setRoles: setRoles }}>
      {props.children}
    </RoleContext.Provider>
  );
};

const RoleConsumer = RoleContext.Consumer;

export { RoleProvider, RoleConsumer, RoleContext };
