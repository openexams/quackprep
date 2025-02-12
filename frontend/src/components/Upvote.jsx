import { Button, Icon, Segment, Statistic } from 'semantic-ui-react';

export default function Upvote({ upvotes, onSubmit }) {
  const handleVote = (vote) => {
    onSubmit(vote);
  };

  return (
    <Segment basic style={{ margin: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Button
          icon
          color='green'
          onClick={(e) => {
            e.stopPropagation();
            handleVote(1);
          }}
          aria-label='Upvote'
          size='small'
          basic
          compact
        >
          <Icon name='chevron up' />
        </Button>

        <Statistic size='tiny' style={{ margin: 0 }}>
          <Statistic.Value style={{ fontSize: '1.2rem' }}>{upvotes || 0}</Statistic.Value>
        </Statistic>

        <Button
          icon
          color='red'
          onClick={(e) => {
            e.stopPropagation();
            handleVote(0);
          }}
          aria-label='Downvote'
          size='small'
          basic
          compact
        >
          <Icon name='chevron down' />
        </Button>
      </div>
    </Segment>
  );
}
