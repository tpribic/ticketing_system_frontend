import React, { useState, useRef } from "react";
import { Form, Button, FormGroup, ButtonToolbar, Schema } from 'rsuite';
import AuthService from "../../Services/AuthService";
import { useHistory, Link } from 'react-router-dom';
import { TextField } from "./TextField";



const Register = (props) => {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formValue, setFormValue] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        repeatedPassword: ''
    });
    const [formError, setFormError] = useState({});
    const form = useRef(null);
    const history = useHistory();


    const { StringType, NumberType } = Schema.Types;
    const registrationModel = Schema.Model({
        name: StringType().minLength(2, 'Name too short.').maxLength(40, 'Too many characters.').isRequired('Name is required.'),
        surname: StringType().minLength(2, 'Surname too short.').maxLength(40, 'Too many characters.').isRequired('Surname is required.'),
        email: StringType().isEmail('Please enter the correct email.').isRequired().maxLength(255, 'Too many characters.').isRequired('Email is required.'),
        password: StringType().minLength(5, 'Password too short').maxLength(255).isRequired('Password is required.'),
        repeatedPassword: StringType()
            .addRule((value, data) => {

                if (value !== data.password) {
                    return false;
                }

                return true;
            }, 'The two passwords do not match')
            .isRequired('You need to repeat your password.')
    });

    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.current.check()) {
            return console.log('Whoops! Form was submitted invalid!');
        }

        AuthService.register(formValue.name, formValue.surname, formValue.email, formValue.password)
            .then(
                () => {
                    setLoading(false);
                    history.push("/login");
                    window.location.reload();
                }
            ).catch((error) => {
                setLoading(false);
                setMessage(error.response.data);
            }
            );
    };

    return (
        <>
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
                <TextField name="repeatedPassword" label="Repeat Password" type="password" onChange={value => setFormValue({ ...formValue, repeatedPassword: value })} />

                <FormGroup>
                    <ButtonToolbar>
                        <Button appearance="primary" onClick={event => handleRegister(event)}>Submit</Button>
                    </ButtonToolbar>
                </FormGroup>
                <FormGroup>
                    {message}
                </FormGroup>
                <Link to="/login">I have already registered</Link>
            </Form >
        </>
    );
};

export default Register;