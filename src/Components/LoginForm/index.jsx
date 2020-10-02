import React, { useState } from "react";
import { Form, Button, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonToolbar } from 'rsuite';
import AuthService from "../../Services/AuthService";
import { useHistory, Link } from 'react-router-dom';

const Login = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const history = useHistory();

    const onChangeUsername = (e) => {
        setUsername(e);
    };

    const onChangePassword = (e) => {
        setPassword(e);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        AuthService.login(username, password).then(
            () => {
                setLoading(false);
                history.push("/dashboard");
                window.location.reload();
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                console.log(error)
                setLoading(false);
                setMessage(resMessage);
            }
        );
    };

    return (
        <>
            <Form fluid>
                <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl name="email" type="email" onChange={onChangeUsername} />
                    <HelpBlock tooltip>Required</HelpBlock>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl name="password" type="password" onChange={onChangePassword} />
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                        <Button appearance="primary" onClick={handleLogin}>Submit</Button>
                    </ButtonToolbar>
                </FormGroup>
                <FormGroup>
                    <p style={{color: 'red'}}>{message}</p>
                </FormGroup>
                <p>Don't have an account?</p>
                <Link to="/register">Register here</Link>
            </Form>
        </>
    );
};

export default Login;