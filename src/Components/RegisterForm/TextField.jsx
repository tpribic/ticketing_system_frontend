import React from "react";
import { FormGroup, FormControl, ControlLabel } from 'rsuite';

export const TextField = ({name, accepter, label, ...props}) => {
    return (
        <FormGroup>
            <ControlLabel>{label} </ControlLabel>
            <FormControl name={name} accepter={accepter} {...props} />
        </FormGroup>
    );
};