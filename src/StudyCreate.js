import React from 'react';
import StudyForm from './StudyForm';
import { browserHistory } from 'react-router';

const StudyCreate = props => {
  const onSubmit = study => {
    const campaign_ids = study.campaign_ids.map(campaign =>
      Number(campaign.value),
    );
    const item_collection_id = study.item_collection_id.value.id
      ? Number(study.item_collection_id.value.id)
      : 0;
    const end_date = study.end_post_date;
    const brand_id = Number(study && study.brand_id && study.brand_id.value);
    const cost = Number(study.cost);
    const program_id = Number(study && study.program_id && study.program_id);
    props
      .studyMutator({
        variables: {
          study: {
            ...study,
            brand_id,
            program_id,
            campaign_ids,
            end_date,
            cost,
            item_collection_id,
          },
        },
      })
      .then(() => {
        alert.show('Study successfully created.');
        browserHistory.push('/studies');
      })
      .catch(err => {
        alert.show(err);
      });
  };
  return <StudyForm {...props} onSubmit={onSubmit} />;
};
export default StudyCreate;
