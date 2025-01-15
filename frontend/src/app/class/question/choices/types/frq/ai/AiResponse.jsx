import { Card, Segment, Label } from 'semantic-ui-react';
import { getGradeColor } from '../FRQAnswer';

const AIResponseComponent = ({ responseText, grade }) => {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>QuackAI Response</Card.Header>
        <Segment>
          <p>{responseText}</p>
        </Segment>
        <Label color={getGradeColor(grade)} ribbon>
          Grade: {grade}%
        </Label>
      </Card.Content>
    </Card>
  );
};

export default AIResponseComponent;
