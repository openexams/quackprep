import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default function QuestionNext({ questions, selectedQuestion, setSelectedQuestion }) {
  // Handle moving to the previous question
  if (!questions || !selectedQuestion) {
    return null;
  }
  function getIndexOfSelectedQuestionFromQuestions() {
    if (questions.length === 0) {
      return -1;
    }
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].id === selectedQuestion.id) {
        return i;
      }
    }
    console.error('impossible');
    return null;
  }

  const handlePrev = () => {
    if (getIndexOfSelectedQuestionFromQuestions() > 0) {
      setSelectedQuestion(questions[getIndexOfSelectedQuestionFromQuestions() - 1]);
    }
  };

  // Handle moving to the next question
  const handleNext = () => {
    if (getIndexOfSelectedQuestionFromQuestions() < questions.length - 1) {
      setSelectedQuestion(questions[getIndexOfSelectedQuestionFromQuestions() + 1]);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Previous Button */}
      <Button icon onClick={handlePrev} disabled={getIndexOfSelectedQuestionFromQuestions() === 0 || questions.length === 0}>
        <Icon name='arrow left' />
      </Button>

      {/* Current Question Number */}
      <span style={{ margin: '0 20px', fontSize: '1.2em' }}>
        Question {getIndexOfSelectedQuestionFromQuestions() + 1} of {questions.length}
      </span>

      {/* Next Button */}
      <Button
        icon
        onClick={handleNext}
        disabled={getIndexOfSelectedQuestionFromQuestions() === questions.length - 1 || questions.length === 0}
      >
        <Icon name='arrow right' />
      </Button>
    </div>
  );
}
