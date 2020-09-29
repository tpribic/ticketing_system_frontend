import Axios from 'axios';
import React, { useState, useRef, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { Container, Form, Button, ButtonToolbar, Schema, FormGroup, FormControl, ControlLabel, InputPicker, Panel, Loader } from 'rsuite'
import useWindowDimensions from '../../../Hooks/windowDimensionHook';
import authHeader from '../../../Services/AuthHeader';
import { TextField } from '../../RegisterForm/TextField';


export default function NewIssueForm() {

    const form = useRef(null);
    const [formValue, setFormValue] = useState(null);
    const [formError, setFormError] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);
    const [userProducts, setUserProducts] = useState(null);

    useEffect(() => {
        getUserProducts()
    }, [])

    const { StringType, NumberType } = Schema.Types;
    const issueModel = Schema.Model({
        name: StringType().minLength(2, 'Name too short.').maxLength(40, 'Too many characters.').isRequired('Name is required.'),
        description: StringType().minLength(10, 'Description too short.').maxLength(255, 'Too many characters.').isRequired('Description is required.'),
    });

    const getUserProducts = async () => {
        const response = await Axios.get(process.env.REACT_APP_API_URL + 'api/user/products', { headers: authHeader() })
        let userProducts = [];
        response.data.products.forEach(product => {
            userProducts.push(
                {
                    label: product.name,
                    value: product.serialNumber,
                    role: product.name,
                }
            )
        });
        setUserProducts(userProducts)
    }

    const createIssue = (event) => {
        if (!form.current.check()) {
            return;
        }
        Axios.post(
            process.env.REACT_APP_API_URL + 'api/user/issue/create',
            {
                name: formValue.name,
                description: formValue.description,
                priority: 2,
                serialNumber: formValue.serialNumber
            },
            { headers: authHeader() })
            .then(() => {
                setMessage('Success')
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
                <h4>Create a new issue</h4>
                <Form
                    style={{ width: '30vw', minWidth: 280 }}
                    model={issueModel}
                    onCheck={formError => {
                        setFormError(formError);
                    }}
                    ref={form}
                    fluid
                >
                    <TextField name="name" label="Name" type="text" onChange={value => setFormValue({ ...formValue, name: value })} />
                    <FormGroup>
                        <ControlLabel>Description</ControlLabel>
                        <FormControl style={{minWidth: 200}} placeholder='Describe your issue...' rows={4} name="description" componentClass="textarea" onChange={(value) => setFormValue({ ...formValue, description: value })} />
                    </FormGroup>
                    <FormGroup>
                        {userProducts ?
                            <>
                                <InputPicker name="serialNumber" cleanable={false} onSelect={(value) => setSelectedKey(value)} onChange={value => setFormValue({ ...formValue, serialNumber: value })} data={userProducts} />
                                {selectedKey ?
                                    <div style={{ padding: '10px 0' }}>
                                        <p>Selected Product Serial Key:</p>
                                        <p style={{ fontWeight: 600 }}>{selectedKey}</p>
                                    </div>
                                    :
                                    null
                                }
                            </>
                            :
                            <Loader />
                        }
                    </FormGroup>
                    <FormGroup>
                        <ButtonToolbar style={{ padding: '10px 0' }}>
                            <Button disabled={selectedKey ? false : true} appearance="primary" onClick={(event) => createIssue(event)}>Submit</Button>
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
