import React, { useState, useEffect } from 'react';
import { Card, Progress, Icon, Statistic, Grid, Label, Button } from 'semantic-ui-react';
import { getStreak, getHasStreak, selectStreakData } from './streakSlice';
import { useDispatch, useSelector } from 'react-redux';

function hasBeenADay(oldDate) {
  // timezones are fucked prob  // they are fucked look into this
  if (oldDate == null) {
    return true;
  }
  const timeSince = (new Date() - new Date(oldDate)) / 1000 / 60 / 60 / 24;
  if (timeSince >= 1) {
    return true;
  }
  return false;
}

export default function StreakPage() {
  // not working nor finished yet
  const { streak } = useSelector(selectStreakData);
  const dispatch = useDispatch();

  useEffect(() => {
    // if user doesnt have a row in the streak table make them a row
    if (!streak.currentStreak) dispatch(getStreak());
  }, []);

  function handleCheckIn() {
    // dispatch a upsert which updates the streak data and returns the new streak data
  }

  function giveLabels() {
    const cur = streak.longestStreak;
    let arr = [];
    if (cur >= 5) {
      arr.push(
        <Label key={5} color='green' ribbon>
          5 Days Badge
        </Label>,
      );
    }
    if (cur >= 10) {
      arr.push(
        <Label key={10} color='teal' ribbon>
          10 Days Badge
        </Label>,
      );
    }
    if (cur >= 30) {
      arr.push(
        <Label key={30} color='blue' ribbon>
          30 Days Badge
        </Label>,
      );
    }
    if (cur >= 60) {
      arr.push(
        <Label key={60} color='purple' ribbon>
          60 Days Badge
        </Label>,
      );
    }
    if (cur >= 90) {
      arr.push(
        <Label key={90} color='brown' ribbon>
          90 Days Badge
        </Label>,
      );
    }
    if (cur >= 180) {
      arr.push(
        <Label key={180} color='grey' ribbon>
          180 Days Badge
        </Label>,
      );
    }
    if (cur >= 365) {
      arr.push(
        <Label key={365} color='black' ribbon>
          365 Days Badge
        </Label>,
      );
    }
    if (cur >= 1095) {
      arr.push(
        <Label key={1095} color='yellow' ribbon>
          1095 Days Badge
        </Label>,
      );
    }
    return arr;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Button onClick={() => dispatch(getHasStreak())} />
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <Card>
              <Card.Content>
                <Card.Header>
                  <Icon name='fire' color='orange' /> Daily Streak
                </Card.Header>
                <Statistic>
                  <Statistic.Value>{streak.currentStreak}</Statistic.Value>
                  <Statistic.Label>Days</Statistic.Label>
                </Statistic>
              </Card.Content>
              <Card.Content extra>
                <Label color='green'>Level {1}</Label>
                <Progress percent={((streak.currentStreak / 7) * 100).toFixed(2)} indicating progress label='This Week' />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card>
              <Card.Content>
                <Card.Header>
                  <Icon name='trophy' color='yellow' /> Longest Streak
                </Card.Header>
                <Statistic>
                  <Statistic.Value>{streak.longestStreak}</Statistic.Value>
                  <Statistic.Label>Days</Statistic.Label>
                </Statistic>
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <Card.Header>Milestones</Card.Header>

                {giveLabels()}

                {/* Add more milestones as needed */}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className='ui primary button' onClick={handleCheckIn}>
          {hasBeenADay(streak.lastClaim) ? 'Check In for Today' : 'Already Claimed Today'}
        </button>
      </div>
    </div>
  );
}
