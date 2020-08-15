import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import forEach from 'lodash/forEach';
import { reduxForm, formValueSelector } from '@walmart/redux-form6';
import StudyCreate from './StudyCreate';
import studyCreate from '../../../gqlQuery/studyCreate';
import studiesAllNamesQuery from '../../../gqlQuery/studiesAllNames';

const StudyCreateContainer = props => <StudyCreate {...props} />;
const getFormState = ({ form6 }) => form6;
const formValSelector = formValueSelector('studyForm', getFormState);

const mapStateToProps = state => {
  const initialValues = {
    build_slr: false,
    status: 'new',
    campaign_ids: null,
    item_collection_id: null,
    brand_id: null,
    cost: null,
  };

  return {
    formType: 'Create',
    initialValues,
    values: formValSelector(
      state,
      'name',
      'build_slr',
      'campaign_ids',
      'notes',
      'program_id',
      'report_name',
      'item_collection_id',
      'start_date',
      'end_date',
      'cost',
      'brand_id',
    ),
  };
};
const getTimeFromRequestGroupDates = date => new Date(date).getTime();
const validate = (values, props) => {
  const errors = {};
  const requiredValues = {
    name: 'Name is required',
    campaign_ids: 'Atleast select one campaign',
    item_collection_id: 'Product set is required',
    start_date: 'Start date is required.',
    end_post_date: 'End post date is required',
  };

  function isNameDoesExist(name) {
    const studiesNamesItems = props.data && props.data.studiesNames;
    if (studiesNamesItems) {
      return studiesNamesItems.map(x => x.name).includes(name);
    }
  }

  forEach(requiredValues, (errorMsg, reqFieldName) => {
    if (
      values[reqFieldName] instanceof Array &&
      values[reqFieldName].length === 0
    ) {
      errors[reqFieldName] = errorMsg;
    }
    if (!values[reqFieldName]) {
      errors[reqFieldName] = errorMsg;
    } else if (values[reqFieldName]) {
      if (reqFieldName === 'name') {
        if (isNameDoesExist(values.name)) {
          errors[reqFieldName] = `There is already a Study Name: ${
            values.name
          }`;
        }
      }
    }
  });

  if (
    getTimeFromRequestGroupDates(values.start_date) >
    getTimeFromRequestGroupDates(values.end_post_date)
  ) {
    errors.end_post_date = 'End Post Date should be later than Start Date';
    errors.start_date = 'Start Date should be earlier than End Post Date';
  }

  forEach(requiredValues, (errorMsg, reqFieldName) => {
    if (!values[reqFieldName]) {
      errors[reqFieldName] = errorMsg;
    }
  });
  return errors;
};

export default compose(
  connect(mapStateToProps),
  graphql(studyCreate, {
    name: 'studyMutator',
    options: () => ({
      refetchQueries: [
        {
          query: studiesAllNamesQuery,
        },
      ],
    }),
  }),
  graphql(studiesAllNamesQuery, {
    props: ({ data }) => {
      if (data.study_page) {
        return {
          data: {
            ...data,
            studies: data.study_page,
            has_next: data.study_page.has_next,
            has_previous: data.study_page.has_previous,
            fetchMore: data.fetchMore,
            updateQuery: data.updateQuery,
          },
        };
      }
      return {
        data: {
          ...data,
          studies: { page: [] },
          has_next: false,
          has_previous: false,
          fetchMore: data.fetchMore,
          updateQuery: data.updateQuery,
        },
      };
    },
  }),

  reduxForm({
    getFormState: ({ form6 }) => form6,
    form: 'studyForm',
    validate,
  }),
)(StudyCreateContainer);
