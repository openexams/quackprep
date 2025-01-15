export default function Selector({ schools, classes, groups, questions, choices }) {
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode'); // ?mode=create or ?mode=edit
  const { school_id, class_id, group_id, question_id, choice_id } = params;
  const dispatch = useDispatch();
}
