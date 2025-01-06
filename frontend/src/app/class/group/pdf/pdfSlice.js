import { standardApiCall } from '@utils/api';
import { updateArrObjectsWithNewVals, filterArr, upsertArray, countingSort } from 'maddox-js-funcs';

const GET_CRUD_PDFS = 'app/class/pdf/GET_CRUD_PDFS';
const DELETE_CRUD_PDF = 'app/class/pdf/DELETE_CRUD_PDF';
const UPSERT_CRUD_PDF = 'app/class/pdf/UPSERT_CRUD_PDF';

export function getPdfsByClassId(class_id) {
  return standardApiCall('get', `/api/extra/pdfs/${class_id}`, null, GET_CRUD_PDFS, { loadingComponent: 'PDFList' });
}

export function getPdfsByUserId() {
  return standardApiCall('get', `/api/extra/pdfs/user/`, null, GET_CRUD_PDFS, { loadingComponent: 'Create' });
}

export function deletePdfById(pdf_id) {
  return standardApiCall('delete', `/api/extra/pdfs/${pdf_id}`, null, DELETE_CRUD_PDF, {
    loadingComponent: 'PDFList',
    noticeOfSuccess: 'successfully deleted pdf',
  });
}

export function upsertPdf(name, class_id, link, id) {
  return standardApiCall('post', '/api/extra/pdfs', { name, class_id, link, id }, UPSERT_CRUD_PDF, {
    loadingComponent: 'Create',
    noticeOfSuccess: 'successfully upserted pdf',
  });
}

const DEFAULT_STATE = {
  pdfs: null,
};
export default function pdfsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CRUD_PDFS:
      return {
        ...state,
        pdfs: countingSort(updateArrObjectsWithNewVals(state.pdfs, action.payload), 'class_id'),
      };
    case DELETE_CRUD_PDF:
      return { ...state, pdfs: filterArr(state.pdfs, parseInt(action.payload)) };
    case UPSERT_CRUD_PDF:
      return { ...state, pdfs: upsertArray(state.pdfs, action.payload?.[0]) };
    default:
      return state;
  }
}

export const selectPdfsState = (state) => {
  return { pdfs: state.app.pdf.pdfs };
};
