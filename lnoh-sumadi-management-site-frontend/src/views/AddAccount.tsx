import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Loader from 'components/Loader/Loader';
import getAccountObject from 'helpers/account';
import Stepper from 'components/stepper/Stepper';
import StepOne from 'components/AccountSteps/StepOne';
import StepTwo from 'components/AccountSteps/StepTwo';
import { POST_ACCOUNT } from 'apollo/queries/accounts';
import StepThree from 'components/AccountSteps/StepThree';
import mergeRecursive, { changeSteps } from 'helpers/helpers';
import AccountMessage from 'components/AccountSteps/AccountMessage';
import { postAccount as postAccountType, postAccountVariables } from 'apollo/queries/types/postAccount';

const AddAccountView: FC = () => {
  const history = useHistory();
  const [data, setData] = useState<any>({
    isEnabled: true,
    institutionRules: {
      en: '',
      es: '',
      pt: '',
    },
  });

  const [step, setStep] = useState(1);
  const [steps, stepsData] = useState([{
    text: 'Account Information',
    step: 1,
    active: true,
    completed: false,
    showNumbers: true,
  },
  {
    text: 'Account rules',
    step: 2,
    active: false,
    completed: false,
    showNumbers: true,
  }, {
    text: 'Account Settings',
    step: 3,
    active: false,
    completed: false,
    showNumbers: true,
  }]);
  const [postAccount, { loading, error }] = useMutation<postAccountType, postAccountVariables>(POST_ACCOUNT);

  const onSubmit = async (formData: any, currentStep: number, nextStep: number) => {
    const newData = mergeRecursive(data, formData);
    setData(newData);
    onChangeStep(currentStep, nextStep);
    if (currentStep === 3) {
      postAccountHandler(newData);
    }
  };

  const onChangeStep = (currentStep: number, nextStep: number) => {
    const updateSteps = changeSteps(steps, currentStep, nextStep);
    stepsData(updateSteps);
    setStep(nextStep);
  };

  const postAccountHandler = async (accountData: any) => {
    const account = getAccountObject(accountData);
    try {
      await postAccount({ variables: { account } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const onCancel = () => {
    history.push('/');
  };

  const onSetRules = (rulesData: any, language: string) => {
    data.institutionRules[language] = rulesData;
  };

  return (
    <section className="container--main container--main__no-sidebar">
      <div className="container">
        <div className="row">
          <div className="col-12 section--boxed">
            <div className="title title--medium">Add New Account</div>
            <Stepper steps={steps} onClickStep={() => {}} />
            {
              step === 1 && <StepOne data={data} onSubmit={onSubmit} onCancel={onCancel} />
            }
            {
              step === 2 && <StepTwo data={data} onSetRules={onSetRules} onChangeStep={onChangeStep} />
            }
            {
              step === 3 && <StepThree data={data} onSubmit={onSubmit} onChangeStep={onChangeStep} />
            }
            {
              (step === 4 && !loading && !error)
                && (
                <AccountMessage message={{
                  title: 'Success',
                  subtitle: 'Account Successfully Updated.',
                  isSuccess: true,
                }}
                />
                )
            }
            {
              (step === 4 && !loading && error)
              && (
                <AccountMessage message={{
                  title: 'Error',
                  subtitle: error.message,
                  isSuccess: true,
                }}
                />
              )
            }
            {
              (step === 4 && loading) && <Loader />
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddAccountView;
