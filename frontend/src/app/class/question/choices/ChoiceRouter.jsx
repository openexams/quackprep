import { useSelector } from 'react-redux';
import MultipleChoice from './types/MultipleChoice/MultipleChoice';
import { selectBINARYArrayOfStateById } from 'maddox-js-funcs';
import { Segment, Header, Divider, Label, Popup } from 'semantic-ui-react';
import MarkdownRenderer from '@components/MarkdownRenderer';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import FreeResponse from './types/frq/FreeResponse';
import NoItemsFound from '@components/NoItemsFound';
import { selectEditState } from '@src/app/auth/authSlice';
import ChoiceEditor from '@src/app/creator/editor/ChoiceEditor';
import QuestionEditor from '@src/app/creator/editor/QuestionEditor';

export default function ChoiceRouter({ selectedQuestion }) {
  const edit = useSelector(selectEditState); // TODO CHECK IF USER IS ALLOWED TO EDIT!!!
  const choices = useSelector(selectBINARYArrayOfStateById('app.choices.choices', 'question_id', parseInt(selectedQuestion?.id)));
  const loading = useSelector(selectLoadingState).loadingComps?.ChoiceRouter; // todo fix

  // maybe check if choices are all the same what if one choice was mcq and other was select (should not be possible)
  let component = null;
  if (!loading) {
    if (edit) {
      component = choices.map((choice) => <ChoiceEditor key={choice.id} {...choice} />);
      component.push(<ChoiceEditor question_id={selectedQuestion.id} />);
    } else if (choices?.[0]?.type === 'mcq') {
      component = <MultipleChoice choices={choices} selectedQuestion={selectedQuestion} />;
    } else if (choices?.[0]?.type === 'frq') {
      component = <FreeResponse choice={choices?.[0]} selectedQuestion={selectedQuestion} />; // if there are multiple then we are fucked chat THERE CANNOT BE MULTIPLE
    } else if (choices?.[0]?.type === 'select') {
      <div>not out yet how this possible</div>;
    } else {
      return <NoItemsFound />;
    }
  }
  return (
    <Segment basic loading={loading}>
      {selectedQuestion && choices ? (
        <>
          <Header>
            {edit ? <QuestionEditor {...selectedQuestion} /> : <MarkdownRenderer render={selectedQuestion.question} />}
            {selectedQuestion.ai ? (
              <Popup
                content='These questions are AI-generated and may contain inaccuracies. Please verify their correctness.'
                trigger={
                  <Label color='blue' style={{ marginLeft: '10px', cursor: 'pointer' }}>
                    AI-Generated
                  </Label>
                }
              />
            ) : null}
          </Header>
          <Divider />
          {component}
        </>
      ) : (
        <Header as='h3'>Please select a question from the list.</Header>
      )}
    </Segment>
  );
}
