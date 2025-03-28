import './stats.css';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header, Grid, Segment, Icon, Card, Statistic } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { selectLoadingState } from '../store/loadingSlice';
import { getAllBaseStats, selectStatsState } from './statsSlice';
import MyStats from './MyStats';

const numberToNameMonthMapping = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const mapQuestionsByMAndY = (data) => {
  if (!data) return null;
  const questionOverTimeCombineMandY = data.map(({ questions_answered, month, year }) => ({
    questions_answered,
    mY: `${numberToNameMonthMapping[month]} ${year}`,
  }));

  return {
    labels: questionOverTimeCombineMandY.map((x) => x.mY),
    datasets: [
      {
        label: 'Submissions',
        data: questionOverTimeCombineMandY.map((x) => x.questions_answered),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
};

const ChartCard = ({ title, children }) => (
  <Card fluid>
    <Card.Content>
      <Card.Header as='h3' textAlign='center'>
        {title}
      </Card.Header>
    </Card.Content>
    <Card.Content>{children}</Card.Content>
  </Card>
);

export default function StatsPage() {
  const loading = useSelector(selectLoadingState).loadingComps?.Stats;
  const stats = useSelector(selectStatsState);
  const { questionsAnsweredByMonthAndYear, tts, total_ai_questions, total_classes_created } = stats;
  const dispatch = useDispatch();

  function getTotalSubmissons() {
    let total_submissions = 0;
    for (let i = 0; i < questionsAnsweredByMonthAndYear?.length; i++) {
      total_submissions += questionsAnsweredByMonthAndYear[i].questions_answered;
    }
    return total_submissions;
  }

  useEffect(() => {
    if (!questionsAnsweredByMonthAndYear && !tts && !total_ai_questions) {
      dispatch(getAllBaseStats());
    }
  }, []);

  const mappedQuestions = useMemo(() => mapQuestionsByMAndY(questionsAnsweredByMonthAndYear), [questionsAnsweredByMonthAndYear]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Question Submissions Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Questions',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month and Year',
        },
      },
    },
  };

  return (
    <Container>
      <MyStats />
      <Header as='h1' textAlign='center' icon>
        <Icon name='chart line' color='teal' />
        User Statistics
        <Header.Subheader>Track our progress over time</Header.Subheader>
      </Header>

      <Segment basic loading={loading}>
        <Statistic color='green' value={`${Math.round(tts / 60)} H`} label={'Total Time Spent Studying'} />
        <Statistic color='yellow' value={getTotalSubmissons()} label={'Total Question Submissions'} />
        <Statistic color='blue' value={total_ai_questions || 0} label={'Total AI Generated Questions'} />
        <Statistic color='red' value={total_classes_created || 0} label={'Total Classes Created'} />

        <Grid columns={1} stackable>
          <Grid.Row>
            <Grid.Column>
              <ChartCard title='Question Submissions Over Time'>
                <div style={{ height: '400px' }}>{mappedQuestions && <Line data={mappedQuestions} options={chartOptions} />}</div>
              </ChartCard>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Container>
  );
}
