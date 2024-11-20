import { useSelector } from 'react-redux';
import MultipleChoice from './types/MultipleChoice/MultipleChoice';
import { selectArrayOfStateById } from '@utils/functions';
import { Segment, Header, Divider } from 'semantic-ui-react';
import MarkdownRenderer from '@components/MarkdownRenderer';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import FreeResponse from './types/FreeResponse';
import QuestionReport from '../QuestionReport';

export default function ChoiceRouter({ selectedQuestion }) {
  const choices = useSelector(selectArrayOfStateById('app.choices.choices', 'question_id', selectedQuestion?.id));
  const loading = useSelector(selectLoadingState).loadingComps?.ChoiceRouter; // todo fix

  // maybe check if choices are all the same what if one choice was mcq and other was select (should not be possible)
  let component = null;
  if (!loading) {
    if (choices?.[0]?.type === 'mcq') {
      component = <MultipleChoice choices={choices} selectedQuestion={selectedQuestion} />;
    } else if (choices?.[0]?.type === 'free') {
      component = <FreeResponse choice={choices?.[0]} />;
    } else if (choices?.[0]?.type === 'select') {
      <div>not out yet how this possible</div>;
    } else {
      return <Segment>No Choices Found, or bad choices inputted</Segment>;
    }
  }
  return (
    <Segment loading={loading}>
      {selectedQuestion && choices ? (
        <>
          <Header>
            <MarkdownRenderer render={selectedQuestion.question} />
          </Header>
          <Divider />
          {component}
        </>
      ) : (
        <Header as='h3'>Please select a question from the list.</Header>
      )}
      {selectedQuestion?.id && <QuestionReport questionId={selectedQuestion?.id} />}
    </Segment>
  );
}
