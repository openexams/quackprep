import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClasses, getClassesByUserId, selectClassState } from '../class/classSlice';
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
import SchoolsList from '../class/school/SchoolsList';
import { getSchools } from '../class/school/schoolSlice';
import { getClassCategories } from '../class/class_categories/classCategorySlice';
import CategoryList from '../class/class_categories/CategoryList';
import { hide401Msg, show401Msg } from '@components/401/401Slice';

/**
 * Merges data pulled in w multiple group ids into one
 * @param {Array} data
 */
function mergeGroupIds(data) {
  if (!Array.isArray(data)) {
    return null;
  }
  data = deepCopyArrayOfObjects(data); // TODO OPTIMIZE
  let updated_arr = [];
  let tmp_groups = [];
  let j = 0;
  for (let i = 0; i < data.length; i = j) {
    tmp_groups.push(data[i]?.group_id);
    for (j = i + 1; j < data.length; j++) {
      if (data[i]?.id === data[j]?.id) {
        tmp_groups.push(data[j]?.group_id);
      } else {
        break;
      }
    }
    data[i]['group_ids'] = tmp_groups; // group_ids diff from group_id
    updated_arr.push(data[i]);
    tmp_groups = [];
  }
  return updated_arr;
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

  /**
   * Get the classes, topics, exams, questions, and choices that match the filter
   */
  let classes = selectArrayOfIncludingItems(
    useSelector(selectClassState).classes,
    ['school_id', 'category', 'id'],
    [filter.school_id, filter.class_type, filter.class_id],
  );
  let topics = selectArrayOfIncludingItems(
    useSelector(selectTopicState).topics,
    ['school_id', 'class_category', 'class_id', 'id'],
    [filter.school_id, filter.class_type, filter.class_id, filter.group_id],
  );
  let exams = selectArrayOfIncludingItems(
    useSelector(selectExamsState).exams,
    ['school_id', 'class_category', 'class_id', 'id'],
    [filter.school_id, filter.class_type, filter.class_id, filter.group_id],
  );
  let questions = selectArrayOfIncludingItems(
    mergeGroupIds(useSelector(selectQuestionState).questions),
    ['school_id', 'class_category', 'class_id', 'group_id', 'id'],
    [filter.school_id, filter.class_type, filter.class_id, filter.group_id, filter.question_id],
  );

  let choices = selectArrayOfIncludingItems(
    mergeGroupIds(useSelector(selectChoicesState).choices),
    ['school_id', 'class_category', 'class_id', 'group_id', 'question_id', 'id'],
    [filter.school_id, filter.class_type, filter.class_id, filter.group_id, filter.question_id, filter.choice_id],
  );

  // ******************************* //

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
            <Grid key={index} columns={3} stackable doubling centered style={{ marginTop: '.3rem' }}>
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
    let ret = questions.map((question, index) => {
      return (
        <ItemEdit
          key={'q' + question.id + index}
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
    let ret = choices?.map((choice, index) => {
      return (
        <ItemEdit
          key={'choice' + choice.id}
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

  // kinda like navbar.jsx
  useEffect(() => {
    if (user?.is_creator) {
      dispatch(hide401Msg());

      dispatch(getSchools());
      dispatch(getClassCategories());
      dispatch(getClassesByUserId());
      dispatch(getTopicsByUserId());
      dispatch(getExamsByUserId());
      dispatch(getQuestionsByUserId());
      dispatch(getChoicesByUserId());
    } else {
      dispatch(show401Msg());
    }
  }, [user?.is_creator]);
  return (
    <Container style={{ padding: '2em 0' }}>
      <Header as='h1' textAlign='center' color='blue'>
        Course Management
        <Header.Subheader>Manage your classes, topics, and exams (refresh to update*)</Header.Subheader>
      </Header>
      <Divider hidden />

      {user?.is_creator ? (
        <Segment raised padded='very' loading={loading} style={{ backgroundColor: '#f8f9fa' }}>
          <Segment basic>
            <Header as={'h2'}>Key</Header>
            Schools:
            <SchoolsList onCreator={true} />
            Class Categories:
            <CategoryList />
          </Segment>
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
      ) : (
        <Segment>You must be a creator! How did you get here? {';)'}</Segment>
      )}
    </Container>
  );
}
