import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClassesByUserId, selectClassState } from '../class/classSlice';
import { getTopicsByUserId, selectTopicState } from '../class/group/topic/topicSlice';
import { getExamsByUserId, selectExamsState } from '../class/group/exam/examSlice';
import {
  deleteQuestionById,
  getQuestionsByUserId,
  selectQuestionState,
  upsertQuestionWithGroupIds,
} from '../class/question/questionSlice';
import { getChoicesByUserId, selectChoicesState } from '../class/question/choices/choicesSlice';
import { useEffect } from 'react';
import { selectUser } from '../auth/authSlice';
import { selectLoadingState } from '../store/loadingSlice';
import { Accordion, Segment, Container, Icon, Grid, Header, Divider } from 'semantic-ui-react';
import { upsertClass, deleteClassById } from '../class/classSlice';
import ItemEdit from '@components/ItemEdit';
import { upsertTopic, deleteTopicById } from '../class/group/topic/topicSlice';
import { deleteExamById, upsertExam } from '../class/group/exam/examSlice';
import { upsertChoice, deleteChoiceById } from '../class/question/choices/choicesSlice';
import { deepCopyArrayOfObjects, selectArrayOfIncludingItems } from '@utils/functions';
import CreateFilter from './CreateFilter';

/**
 * Merges questions that were duplicated if they were linked to more than 1 group
 * TODO TEST DEF YES
 * @param {Array} questions
 */
function mergeQuestions(questions) {
  if (!Array.isArray(questions)) {
    return [];
  }
  questions = deepCopyArrayOfObjects(questions); // TODO OPTIMIZE
  let newb = [];
  let tmp_groups = [];
  let j = 0;
  for (let i = 0; i < questions.length; i = j) {
    tmp_groups.push(questions[i]?.group_id);
    for (j = i + 1; j < questions.length; j++) {
      if (questions[i]?.id === questions[j]?.id) {
        tmp_groups.push(questions[j]?.group_id);
      } else {
        break;
      }
    }
    questions[i]['group_ids'] = tmp_groups; // group_ids diff from group_id
    newb.push(questions[i]);
    tmp_groups = [];
  }
  return newb;
}

export default function Create() {
  const [filter, setFilter] = useState({
    school_id: '',
    class_type: '',
    class_id: '',
    group_id: '',
    question_id: '',
    choice_id: '',
  });
  const dispatch = useDispatch();
  let classes = selectArrayOfIncludingItems(
    useSelector(selectClassState).classes,
    ['school_id', 'category', 'id'],
    [filter.school_id, filter.class_type, filter.class_id],
  );
  let topics = useSelector(selectTopicState).topics;
  let exams = useSelector(selectExamsState).exams;
  let questions = mergeQuestions(useSelector(selectQuestionState).questions);
  let choices = useSelector(selectChoicesState).choices;
  const user = useSelector(selectUser).user;
  const loading = useSelector(selectLoadingState).loadingComps?.Create;

  // map questions so that questions with different group ids are merged into one

  const [activeIndex, setActiveIndex] = useState(null);
  // data.active is what it active before the click
  function handleAccordClick(event, data) {
    if (data.active === false) {
      setActiveIndex(data.index);
    } else {
      setActiveIndex(-1);
    }
  }

  function loadAccords(arr) {
    return arr.map((val, index) => {
      return (
        <Accordion key={index}>
          <Accordion.Title active={activeIndex === index} index={index} onClick={handleAccordClick}>
            <Icon name='dropdown' />
            {val.name}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === index}>
            <Grid columns={3} stackable doubling centered style={{ marginTop: '.3rem' }}>
              {val.component}
            </Grid>
          </Accordion.Content>
        </Accordion>
      );
    });
  }

  // maps the classes into a array of itemedit components
  function mapClassesToItems() {
    // DO THIS SHIT TO MUCH IS THERE A WAY TO ABSTRACT?
    let ret = classes.map((cl) => {
      return (
        <ItemEdit
          key={'cc' + cl.id}
          id={cl.id}
          name={cl.name}
          desc={cl.description}
          formFields={[
            { name: 'name', value: cl.name, required: true },
            { name: 'description', value: cl.description, required: true },
            { name: 'category', value: cl.category, required: true },
            { name: 'school_id', value: cl.school_id, required: true },
          ]}
          onSubmit={({ name, description, category, school_id }) => {
            dispatch(upsertClass(cl.id, school_id, name, description, category));
          }}
          onDelete={() => {
            dispatch(deleteClassById(cl.id));
          }}
        />
      );
    });
    ret.push(
      <ItemEdit
        key='cplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'name', value: '', required: true },
          { name: 'description', value: '', required: true },
          { name: 'category', value: '', required: true },
          { name: 'school_id', value: '', required: true },
        ]}
        onSubmit={({ name, description, category, school_id }) => {
          dispatch(upsertClass(null, school_id, name, description, category));
        }}
        onDelete={() => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }

  function mapTopicsToItems() {
    let ret = topics.map((topic) => {
      return (
        <ItemEdit
          key={'t' + topic.id}
          id={topic.id}
          name={topic.name}
          desc={topic.desc}
          formFields={[
            { name: 'name', value: topic.name, required: true },
            { name: 'description', value: topic.description, required: true },
            { name: 'class_id', value: topic.class_id, required: true },
          ]}
          onSubmit={({ name, description, class_id }) => {
            dispatch(upsertTopic(topic.id, name, class_id, description));
          }}
          onDelete={() => {
            dispatch(deleteTopicById(topic.id));
          }}
        />
      );
    });
    ret.push(
      <ItemEdit
        key='tplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'name', value: '', required: true },
          { name: 'description', value: '', required: true },
          { name: 'class_id', value: '', required: true },
        ]}
        onSubmit={({ name, description, class_id }) => {
          dispatch(upsertTopic(null, name, class_id, description));
        }}
        onDelete={() => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }

  function mapExamsToItems() {
    let ret = exams.map((exam) => {
      return (
        <ItemEdit
          key={'e' + exam.id}
          id={exam.id}
          name={exam.name}
          desc={exam.desc}
          formFields={[
            { name: 'name', value: exam.name, required: true },
            { name: 'description', value: exam.description, required: true },
            { name: 'class_id', value: exam.class_id, required: true },
          ]}
          onSubmit={({ name, description, class_id }) => {
            dispatch(upsertExam(exam.id, name, class_id, description));
          }}
          onDelete={() => {
            dispatch(deleteExamById(exam.id));
          }}
        />
      );
    });
    ret.push(
      <ItemEdit
        key='eplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'name', value: '', required: true },
          { name: 'description', value: '', required: true },
          { name: 'class_id', value: '', required: true },
        ]}
        onSubmit={({ name, description, class_id }) => {
          dispatch(upsertExam(null, name, class_id, description));
        }}
        onDelete={() => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }

  function mapQuestionsToItems() {
    let ret = questions.map((question) => {
      return (
        <ItemEdit
          key={'q' + question.id}
          id={question.id}
          name={question.question}
          desc={null}
          formFields={[
            { name: 'question', value: question.question, required: true },
            { name: 'group_ids', value: question.group_ids, required: true },
            { name: 'question_num_on_exam', value: question.question_num_on_exam, required: false },
          ]}
          onSubmit={({ question, question_num_on_exam, group_ids }) => {
            if (group_ids.include(',')) group_ids = group_ids.split(',');
            else {
              let tmp = [];
              tmp.push(group_ids);
              group_ids = tmp;
            }
            dispatch(upsertQuestionWithGroupIds(question.id, question, question_num_on_exam, group_ids));
          }}
          onDelete={() => {
            dispatch(deleteQuestionById(question.id));
          }}
        />
      );
    });
    ret.push(
      <ItemEdit
        key='qplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'question', value: '', required: true },
          { name: 'group_ids', value: '', required: true },
          { name: 'question_num_on_exam', value: null, required: false },
        ]}
        onSubmit={({ question, question_num_on_exam, group_ids }) => {
          if (group_ids.includes(',')) group_ids = group_ids.split(',');
          else {
            let tmp = [];
            tmp.push(group_ids);
            group_ids = tmp;
          }
          dispatch(upsertQuestionWithGroupIds(null, question, question_num_on_exam, group_ids));
        }}
        onDelete={() => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }

  // need to do one of those above for choice now :(
  function mapChoicesToItems() {
    let ret = choices.map((choice) => {
      return (
        <ItemEdit
          key={'c' + choice.id}
          id={choice.id}
          name={choice.answer}
          desc={choice.is_correct ? 'Correct' : 'Incorrect'}
          formFields={[
            { name: 'text', value: choice.answer, required: true },
            { name: 'is_correct', value: choice.is_correct, required: true },
            { name: 'question_id', value: choice.question_id, required: true },
            { name: 'type', value: choice.type, required: true },
          ]}
          onSubmit={({ text, is_correct, question_id, type }) => {
            dispatch(upsertChoice(text, question_id, is_correct, type, choice.id));
          }}
          onDelete={(id) => {
            dispatch(deleteChoiceById(id));
          }}
        />
      );
    });
    ret.push(
      <ItemEdit
        key='chplus'
        id={null}
        name=''
        desc=''
        formFields={[
          { name: 'text', value: '', required: true },
          { name: 'is_correct', value: '', required: true },
          { name: 'question_id', value: '', required: true },
          { name: 'type', value: '', required: true },
        ]}
        onSubmit={({ text, is_correct, question_id, type }) => {
          dispatch(upsertChoice(text, question_id, is_correct, type, null));
        }}
        onDelete={(id) => {
          console.log('Cant delete a item thats not even created!');
        }}
      />,
    );
    return ret;
  }

  useEffect(() => {
    if (true) {
      dispatch(getClassesByUserId());
      dispatch(getTopicsByUserId());
      dispatch(getExamsByUserId());
      dispatch(getQuestionsByUserId());
      dispatch(getChoicesByUserId());

      console.log('got');
    }
  }, []);
  return (
    <Container style={{ padding: '2em 0' }}>
      <Header as='h1' textAlign='center' color='blue'>
        Course Management
        <Header.Subheader>Manage your classes, topics, and exams (refresh to update*)</Header.Subheader>
      </Header>
      <Divider hidden />

      <Segment raised padded='very' loading={loading} style={{ backgroundColor: '#f8f9fa' }}>
        <CreateFilter filter={filter} setFilter={setFilter} />
        {classes &&
          topics &&
          exams &&
          questions &&
          choices &&
          loadAccords([
            { name: 'Classes', component: mapClassesToItems() },
            { name: 'Topics', component: mapTopicsToItems() },
            { name: 'Exams', component: mapExamsToItems() },
            { name: 'Questions', component: mapQuestionsToItems() },
            { name: 'Choices', component: mapChoicesToItems() },
          ])}
      </Segment>
    </Container>
  );
}
