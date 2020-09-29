import Axios from 'axios';
import React, { useState, useRef, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { Container, Form, Button, ButtonToolbar, Schema, FormGroup, FormControl, ControlLabel, InputPicker, Panel, Loader } from 'rsuite'
import useWindowDimensions from '../../../Hooks/windowDimensionHook';
import authHeader from '../../../Services/AuthHeader';
import { TextField } from '../../RegisterForm/TextField';


export default function RegisterProductForm(props) {

    const form = useRef(null);
    const [formValue, setFormValue] = useState(null);
    const [formError, setFormError] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);


    const { StringType } = Schema.Types;
    const issueModel = Schema.Model({
        serialNumber: StringType().minLength(24, 'Serial number is too short.').maxLength(30, 'Too many characters.').isRequired('Serial number is required.'),
        activationKey: StringType().minLength(10, 'Activation key is too short.').maxLength(13, 'Too many characters.').isRequired('Activation key is required.'),
    });

    const registerProduct = (event) => {
        if (!form.current.check()) {
            return;
        }
        Axios.post(
            process.env.REACT_APP_API_URL + 'api/user/product/activate',
            {
                serialNumber: formValue.serialNumber,
                activationKey: formValue.activationKey
            },
            { headers: authHeader() })
            .then(() => {
                setMessage('Product has been activated')
            })
            .catch((err) => {
                setMessage(err.message)
            })

    }

    return (
        <Container
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Panel bordered>
                <h4>Activate new product</h4>
                <Form
                    style={{ width: '30vw', minWidth: 280 }}
                    model={issueModel}
                    onCheck={formError => {
                        setFormError(formError);
                    }}
                    ref={form}
                    fluid
                >
                    <TextField name="serialNumber" label="Serial number" type="text" onChange={value => setFormValue({ ...formValue, serialNumber: value })} />
                    <TextField name="activationKey" label="Activation key" type="text" onChange={value => setFormValue({ ...formValue, activationKey: value })} />

                    <FormGroup>
                        <ButtonToolbar style={{ padding: '10px 0' }}>
                            <Button appearance="primary" onClick={(event) => registerProduct(event)}>Submit</Button>
                        </ButtonToolbar>
                    </FormGroup>
                    <FormGroup>
                        {message}
                    </FormGroup>
                </Form >
            </Panel>
        </Container>
    )
}
