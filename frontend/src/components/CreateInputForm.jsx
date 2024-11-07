import React, { useState } from 'react';
import { Form, Button, Label, FormInput, Grid, Container, Header, Message } from 'semantic-ui-react';
import { deepCopyArrayOfObjects } from '@utils/functions.js';

function InputWLabel({ state, setState, curStateIndex }) {
  const field = state[curStateIndex];

  return (
    <Form.Field error={!!field.error}>
      <Grid>
        <Grid.Row verticalAlign='middle' columns={2}>
          <Grid.Column width={4}>
            <Label basic pointing='right' color='blue' size='large'>
              {field.name}
            </Label>
          </Grid.Column>
          <Grid.Column width={12}>
            <FormInput
              fluid
              id={`${curStateIndex}`}
              placeholder={`Enter ${field.name.toLowerCase()}...`}
              value={field.value}
              onChange={(event) => {
                let newState = deepCopyArrayOfObjects(state);
                newState[curStateIndex] = {
                  ...newState[curStateIndex],
                  value: event.target.value,
                  error: false,
                };
                setState(newState);
              }}
            />
            {field.error && <Message error size='tiny' content={field.error} />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form.Field>
  );
}

function CreateInputs(state, setState) {
  return state.map((field, i) => <InputWLabel key={`${field.name}-${i}`} state={state} setState={setState} curStateIndex={i} />);
}

function addErrToFormField(formFieldArr, index) {
  return formFieldArr.map((field, i) => {
    if (i === index) {
      return { ...field, error: `${field.name} is required` };
    }
    return { ...field };
  });
}

function removeErrFromFormField(formFieldArr, index) {
  return formFieldArr.map((field, i) => {
    if (i === index) {
      return { ...field, error: false };
    }
    return { ...field };
  });
}

export default function CreateInputForm({ onSubmit, formFields, buttonText = 'Submit' }) {
  const [inputFields, setInputFields] = useState(formFields);

  function mapStateToObject() {
    return inputFields.reduce(
      (obj, field) => ({
        ...obj,
        [field.name]: field.value,
      }),
      {},
    );
  }

  function validate() {
    let valid = true;
    let updatedFields = inputFields;

    for (let i = 0; i < inputFields.length; i++) {
      if (updatedFields[i].required === true && updatedFields[i].value === '') {
        updatedFields = addErrToFormField(updatedFields, i);
        valid = false;
      } else {
        updatedFields = removeErrFromFormField(updatedFields, i);
      }
    }
    setInputFields(updatedFields);
    return valid;
  }

  return (
    <Container>
      <Form
        key={'input_form'}
        onSubmit={() => {
          if (validate()) {
            onSubmit(mapStateToObject());
            setInputFields(formFields);
          }
        }}
      >
        <Header as='h2' color='blue' dividing>
          Input Form
        </Header>

        <div style={{ marginTop: '2em', marginBottom: '2em' }}>{CreateInputs(inputFields, setInputFields)}</div>

        <Button primary fluid size='large' type='submit'>
          {buttonText}
        </Button>
      </Form>
    </Container>
  );
}
