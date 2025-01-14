import { useParams, useLocation } from 'react-router-dom';

export function EditorRouter() {
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode'); // ?mode=create or ?mode=edit
  const { school_id, class_id, group_id, question_id, choice_id } = params;

  if (school_id && class_id && group_id && question_id && choice_id) {
    // return choice editor
  } else if (school_id && class_id && group_id && question_id) {
    mode === 'create' ? /* return choice editor*/ : /* return question editor */
  } else if (school_id && class_id && group_id) {
    mode === 'create' ? /* return question editor */ : /* return group editor */
  } else if (school_id && class_id) {
    mode === 'create' ? /* return group editor */ : /* return class editor */
  } else if (school_id) {
    mode === 'create' ? /* return class editor */ : /* return school editor */
  } else {
    // return create editor
  }
}
