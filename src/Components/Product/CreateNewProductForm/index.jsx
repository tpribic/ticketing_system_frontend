import Axios from 'axios';
import React, { useState, useRef } from 'react'
import { Container, Form, Button, ButtonToolbar, Schema, FormGroup, FormControl, ControlLabel, InputPicker, Panel, Loader } from 'rsuite'
import authHeader from '../../../Services/AuthHeader';
import { TextField } from '../../RegisterForm/TextField';


export default function CreateNewProductForm(props) {

    const form = useRef(null);
    const [formValue, setFormValue] = useState(null);
    const [formError, setFormError] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);
    const [product, setProduct] = useState(null);


    const { StringType } = Schema.Types;
    const issueModel = Schema.Model({
        name: StringType().minLength(5, 'Product name is too short.').maxLength(45, 'Too many characters.').isRequired('You have to enter product name to generate new data.'),
    });

    const createProduct = (event) => {
        if (!form.current.check()) {
            return;
        }
        Axios.post(
            process.env.REACT_APP_API_URL + 'api/admin/product/create',
            {
                name: formValue.name,
                type: 1 // type will be 1 (software) until refactor
            },
            { headers: authHeader() })
            .then((request) => {
                setProduct(request.data);
                setMessage('Product has been created')
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
                <h4>Generate new product</h4>
                <Form
                    style={{ width: '30vw', minWidth: 280 }}
                    model={issueModel}
                    onCheck={formError => {
                        setFormError(formError);
                    }}
                    ref={form}
                    fluid
                >
                    <TextField name="name" label="Product name" type="text" onChange={value => setFormValue({ ...formValue, name: value })} />
                    {/* can be refactored to use different types of products inside app */}
                    {/* <TextField name="type" label="Product name" type="text" onChange={value => setFormValue({ ...formValue, type: value })} /> */}
                    <FormGroup>
                        <ButtonToolbar style={{ padding: '10px 0' }}>
                            <Button appearance="primary" onClick={(event) => createProduct(event)}>Submit</Button>
                        </ButtonToolbar>
                    </FormGroup>
                </Form >
                {
                    product ?
                        <div>
                            <h4>New product information</h4>
                            <div>
                                <p>Name</p>
                                <b>{product.name}</b>
                            </div>
                            <div>
                                <p>Serial number</p>
                                <b>{product.serialNumber}</b>
                            </div>
                            <div>
                                <p>ActivationKey</p>
                                <b>{product.activationNumber}</b>
                            </div>
                        </div>
                        :
                        message

                }
            </Panel>
        </Container>
    )
}
