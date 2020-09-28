import React, { useState, useRef } from "react";
import { Form, Button, FormGroup, ButtonToolbar, Schema, Panel, InputPicker } from 'rsuite';
import AuthService from "../../Services/AuthService";
import { useHistory, Link } from 'react-router-dom';
import { TextField } from "../RegisterForm/TextField";
import useWindowDimensions from '../../Hooks/windowDimensionHook'
import userRoles from './userRoles.js'

const AddUserForm = (props) => {

    const { width, height } = useWindowDimensions();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formValue, setFormValue] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        role: null
    });
    const [formError, setFormError] = useState({});
    const form = useRef(null);
    const history = useHistory();


    const { StringType, NumberType } = Schema.Types;
    const registrationModel = Schema.Model({
        name: StringType().minLength(2, 'Name too short.').maxLength(40, 'Too many characters.').isRequired('Name is required.'),
        surname: StringType().minLength(2, 'Surname too short.').maxLength(40, 'Too many characters.').isRequired('Surname is required.'),
        email: StringType().isEmail('Please enter the correct email.').isRequired().maxLength(255, 'Too many characters.').isRequired('Email is required.'),
        password: StringType().minLength(5, 'Password too short').maxLength(255).isRequired('Password is required.')
    });

    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.current.check()) {
            return console.log('Whoops! Form was submitted invalid!');
        }

        AuthService.register(formValue.name, formValue.surname, formValue.email, formValue.password, formValue.role)
            .then(
                () => {
                    setLoading(false);
                    setMessage("User created");
                }
            ).catch((error) => {
                setLoading(false);
                setMessage(error.response.data);
            }
            );
    };

    return (
        <Panel bordered style={width > 767 ? { width: 600, height: 520, marginTop: 30 } : { minWidth: 300, maxHeight: 500, marginTop: 15 }}>
            <h2>Add new user</h2>
            <Form
                model={registrationModel}
                onCheck={formError => {
                    setFormError(formError);
                }}
                checkTrigger='none'
                ref={form}
                fluid
            >
                <TextField name="name" label="Name" type="text" onChange={value => setFormValue({ ...formValue, name: value })} />
                <TextField name="surname" label="Surname" type="text" onChange={value => setFormValue({ ...formValue, surname: value })} />
                <TextField name="email" label="Email" type="text" onChange={value => setFormValue({ ...formValue, email: value })} />
                <TextField name="password" label="Password" type="password" onChange={value => setFormValue({ ...formValue, password: value })} />
                <InputPicker data={userRoles} onChange={value => setFormValue({ ...formValue, role: value })} block />

                <FormGroup style={{ marginTop: 20 }}>
                    <ButtonToolbar>
                        <Button appearance="primary" onClick={event => handleRegister(event)}>Submit</Button>
                    </ButtonToolbar>
                </FormGroup>
                <FormGroup>
                    {message}
                </FormGroup>
            </Form >
        </Panel>
    );
};

export default AddUserForm;