import { useEffect, useMemo } from 'react';
import { Container, Header, Grid, Segment, Icon } from 'semantic-ui-react';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoadingState } from '../store/loadingSlice';
import { getQuestionsAnsweredByMonthAndYear, selectStatsState } from './statsSlice';

const numberToNameMonthMapping = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export default function StatsPage() {
  const loading = useSelector(selectLoadingState).loadingComps.Stats;
  const { questionsAnsweredByMonthAndYear } = useSelector(selectStatsState).stats;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!questionsAnsweredByMonthAndYear) dispatch(getQuestionsAnsweredByMonthAndYear());
  }, []);

  // use memo

  function mapQuestionsByMAndY(questionsAnsweredByMonthAndYear) {
    if (!questionsAnsweredByMonthAndYear) return null;
    const questionOverTimeCombineMandY = questionsAnsweredByMonthAndYear.map((mandy) => {
      return { questions_answered: mandy.questions_answered, mY: `${numberToNameMonthMapping[mandy.month]} ${mandy.year} ` };
    });

    const questionsAnsweredOverTimeData = {
      labels: questionOverTimeCombineMandY.map((x) => {
        return x.mY;
      }),
      datasets: [
        {
          label: 'Total Questions Answered By Month',
          data: questionOverTimeCombineMandY.map((x) => {
            return x.questions_answered;
          }),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: true,
        },
      ],
    };
    return questionsAnsweredOverTimeData;
  }

  const mappedQuestions = useMemo(() => {
    return mapQuestionsByMAndY(questionsAnsweredByMonthAndYear);
  }, [questionsAnsweredByMonthAndYear]);

  return (
    //add loading
    <Container>
      <Header as={'h1'} textAlign='center'>
        User Statistics <Icon name='line graph' />
      </Header>
      <Segment basic loading={loading}>
        <Grid columns={1} stackable>
          <Grid.Row>
            <Grid.Column>
              <Header as='h3' textAlign='center'>
                Total Questions Answered Over Time
              </Header>
              <div style={{ width: '100%', height: '400px' }}>
                {questionsAnsweredByMonthAndYear && (
                  <Line data={mappedQuestions} options={{ responsive: true, maintainAspectRatio: false }} />
                )}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Container>
  );
}
