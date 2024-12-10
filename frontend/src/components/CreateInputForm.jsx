import { useState } from 'react';
import { Form, Button, Label, FormInput, Grid, Container, Header, Message } from 'semantic-ui-react';
import { deepCopyArrayOfObjects } from 'maddox-js-funcs';

/**
 * @typedef {Object} FormField
 * @property {string} name - The name of the form field.
 * @property {string} value - The default value of the form field.
 * @property {boolean} required - Whether the form field is required.
 */

/**
 *
 * @param {Object} props
 * @param {import('./CreateInputForm').FormField[]} props.state default state
 * @param {String} props.stateKey the key of the object state that we are going to edit
 * @param {Function} props.setState sets the new updated state after the user interacts with it
 * @returns
 */
function InputWLabel({ state, setState, curStateIndex }) {
  const field = state[curStateIndex];

  return (
    <Form.Field error={!!field.error}>
      <Grid>
        <Grid.Row verticalAlign='middle' columns={2}>
          <Grid.Column width={4}>
            <Label basic pointing='right' size='large'>
              {field?.label || field.name}
            </Label>
          </Grid.Column>
          <Grid.Column width={12}>
            <FormInput
              type={field?.type || 'text'} // janky but it works
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

/**
 *
 * @param {import('./CreateInputForm').FormField[]} state
 * @param {Function} setState
 */
function CreateInputs(state, setState) {
  return state.map((field, i) => <InputWLabel key={`${field.name}-${i}`} state={state} setState={setState} curStateIndex={i} />);
}

/**
 * Makes deep copy
 * @param {FormField[]} formFieldArr
 * @param {Int} index
 * @returns {FormField[]} new form field array with updated value at given index
 */
function addErrToFormField(formFieldArr, index) {
  return formFieldArr.map((field, i) => {
    if (i === index) {
      return { ...field, error: `${field.name} is required` };
    }
    return { ...field };
  });
}

/**
 *
 * @param {FormField[]} formFieldArr
 * @param {Int} index
 * @returns {FormField[]} new form field array with updated value at given index
 */
function removeErrFromFormField(formFieldArr, index) {
  return formFieldArr.map((field, i) => {
    if (i === index) {
      return { ...field, error: false };
    }
    return { ...field };
  });
}
/**
 * Calls on Submit with a object which holds keys of names you sent in the form field and values of the user inputted values
 * 
 *
 * @param {Object} props
 * @param {FormField[]} props.formFields
 * @param {Function} props.onSubmit
 * @param {String} buttonText
 * @example <CreateInputForm
            onSubmit={({ method, route, data }) => { // heres what it returning getting destructured
              axios({ method, data, url: route, baseUrl: null }).then((ress) => setRes('good response'));
            }}
            formFields={[
              { name: 'method', value: '', required: true },
              { name: 'route', value: '/api/', required: true },
              { name: 'data', value: '', required: false },
            ]}
          />
          {res}
        
 */
export default function CreateInputForm({ onSubmit, formFields, buttonText = 'Submit', title }) {
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

  /**
   * updates error tag and updates state, if it does not need to change anything it returns true
   * @returns {Boolean} if current form is valid
   */
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
          {title}
        </Header>

        <div style={{ marginTop: '2em', marginBottom: '2em' }}>{CreateInputs(inputFields, setInputFields)}</div>

        <Button primary fluid size='large' type='submit'>
          {buttonText}
        </Button>
      </Form>
    </Container>
  );
}
