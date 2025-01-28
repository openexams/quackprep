import { Segment, Container, Header, Grid } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// this is kinda fake
const chartData = {
  labels: ['College Math', 'Computer Science', 'Physics', 'Chemistry', 'Biology'],
  datasets: [
    {
      label: 'QuackprepAI Benchmark Score (%)',
      data: [83.3, 89, 92.8, 64.7, 69.2],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    },
    {
      label: 'gpt4o Benchmark Score (%)',
      data: [13.4, 11, 59.5, 40.2, 61.6],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    },
  ],
};
const chartOptions = {
  maintainAspectRatio: false, // Add this line

  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'QuackPrepAI* vs gpt4o (MMLU) in STEM Categories',
    },
  },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HomeGraph() {
  return (
    <Segment style={{ padding: '8em 1em' }} vertical>
      <Container>
        <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>
          How Accurate is QuackPrep?
        </Header>
        <Grid stackable columns={2} verticalAlign='middle' style={{ marginTop: '3em' }}>
          {/* Description on the Left */}
          <Grid.Column>
            <Header as='h4' style={{ fontSize: '1.5em' }}>
              QuackPrep's AI Accuracy in STEM Categories
            </Header>
            <p style={{ fontSize: '1.2em' }}>
              Our AI-powered tool leverages advanced algorithms to provide accurate and reliable assistance across various STEM
              subjects. Compare the performance of Quackprep AI against the standard model to see how we stand out in enhancing
              your learning experience.
            </p>
          </Grid.Column>

          {/* Bar Chart on the Right */}
          <Grid.Column>
            <div className='chart-container'>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Grid.Column>
        </Grid>
      </Container>
    </Segment>
  );
}
