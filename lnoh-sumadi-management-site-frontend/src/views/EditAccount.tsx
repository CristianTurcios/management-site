import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { client } from 'apollo/client';
import Loader from 'components/Loader/Loader';
import getAccountObject from 'helpers/account';
import Stepper from 'components/stepper/Stepper';
import StepOne from 'components/AccountSteps/StepOne';
import StepTwo from 'components/AccountSteps/StepTwo';
import StepThree from 'components/AccountSteps/StepThree';
import mergeRecursive, { changeSteps } from 'helpers/helpers';
import AccountMessage from 'components/AccountSteps/AccountMessage';
import {
  GET_ACCOUNT_BY_ID, GET_TIMEZONES, UPDATE_ACCOUNT,
} from 'apollo/queries/accounts';
import AccountInformation from 'components/AccountInformation/AccountInformation';
import { updateAccount as updateAccountType, updateAccountVariables } from 'apollo/queries/types/updateAccount';
import { getAccountById as getAccountByIdType, getAccountByIdVariables } from 'apollo/queries/types/getAccountById';
import { getTimezones } from 'apollo/queries/types/getTimezones';
import { hasAccess } from 'services/AuthenticationService';
import { SessionContext } from 'context/SessionContext';

interface AccountId {
    id: string;
}

const EditAccountView: FC = () => {
  const { id } = useParams<AccountId>();
  const history = useHistory();
  const { session } = useContext(SessionContext);
  const [data, setData] = useState<any>({
    institutionRules: {
      en: '',
      sp: '',
      pt: '',
    },
  });
  const [step, setStep] = useState(1);
  const [steps, stepsData] = useState([{
    text: 'Account Information',
    step: 1,
    active: true,
    completed: true,
    showNumbers: true,
  },
  {
    text: 'Account rules',
    step: 2,
    active: false,
    completed: true,
    showNumbers: true,
  }, {
    text: 'Account Settings',
    step: 3,
    active: false,
    completed: true,
    showNumbers: true,
  }]);

  const {
    register, handleSubmit,
  } = useForm({ mode: 'onBlur' });

  const enabledAccount = (formData: any) => {
    const newData = mergeRecursive(data, formData);
    setData(newData);
  };

  const onSubmit = async (formData: any, currentStep: number, nextStep: number) => {
    const newData = mergeRecursive(data, formData);
    setData(newData);
    onChangeStep(currentStep, nextStep);
    if (currentStep === 3) {
      updateAccountHandler(newData);
    }
  };

  const onChangeStep = (currentStep: number, nextStep: number) => {
    const updateSteps = changeSteps(steps, currentStep, nextStep);
    stepsData(updateSteps);
    setStep(nextStep);
  };
  const { loading, data: accountData, error } = useQuery<getAccountByIdType, getAccountByIdVariables>(
    GET_ACCOUNT_BY_ID,
    {
      variables: {
        id,
      },
    },
  );

  useEffect(() => {
    if (!accountData) return;
    async function onCompleted() {
      const newData = mergeRecursive(data, accountData?.Account);
      newData.institutionRules = newData.institution.institutionRules;
      try {
        const timezones = await client.query<getTimezones>({
          query: GET_TIMEZONES,
        });
        newData.proctorTimeZone = timezones
          ?.data?.Timezones?.find((timezone) => newData.proctorTimeZone === timezone?.value);

        newData.services.lms.lmsTimeZone = timezones
          ?.data?.Timezones?.find((timezone) => newData.services.lms.lmsTimeZone === timezone?.value);

        let { mandatoryKeyWords, optionalKeyWords } = newData
          .services.proctoring
          ?.idVerification
          ?.enforceKeywordsDetection;
        if (mandatoryKeyWords) {
          mandatoryKeyWords = mandatoryKeyWords
            .split(',').map((element: any) => ({ value: element, label: element }));

          newData.services.proctoring
            .idVerification
            .enforceKeywordsDetection.mandatoryKeyWords = mandatoryKeyWords;
        }
        if (optionalKeyWords) {
          optionalKeyWords = optionalKeyWords
            .split(',').map((element: any) => ({ value: element, label: element }));
          newData
            .services.proctoring
            .idVerification
            .enforceKeywordsDetection
            .optionalKeyWords = optionalKeyWords;
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Somethign went wrong when getting timezone. ', err);
      }

      newData.services.aws.rekognition.collectionId = {
        value: newData.services.aws.rekognition.collectionId,
        label: newData.services.aws.rekognition.collectionId,
      };

      newData.institution.lmsId = {
        value: newData.institution.lmsId,
        label: newData.institution.lmsId,
      };

      setData(newData);
    }
    onCompleted();
  }, [accountData]);
  const [updateAccount, { loading: updateLoading, error: updateError }] = useMutation<
  updateAccountType, updateAccountVariables>(UPDATE_ACCOUNT);

  const onCancel = () => {
    history.push('/');
  };

  const onSetRules = (rulesData: any, language: string) => {
    data.institutionRules[language] = rulesData;
  };

  const updateAccountHandler = async (account: any) => {
    const accountResponse = getAccountObject(account);
    try {
      await updateAccount({ variables: { id, account: accountResponse } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  if (error || updateError) {
    const subtitle = error?.message || updateError?.message || '';
    const messageData = {
      title: 'Error',
      subtitle,
      isSuccess: false,
    };
    return (
      <section className="container--main container--main__no-sidebar">
        <div className="container">
          <div className="row">
            <div className="col-12 section--boxed">
              <AccountMessage message={messageData} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading || updateLoading) {
    return <Loader />;
  }
  return (
    <section className="container--main container--main__no-sidebar">
      <div className="container">
        <div className="row">
          <div className="col-12 section--boxed">
            <div className="account-edition-info">
              <div className="row">
                <div className="col-12 title-container title-container--with-components">
                  <div className="title title--medium">Account Edition</div>
                  {
                    'isEnabled' in data && hasAccess(session.user.role as string, ['Admin', 'Editor']) && (
                      <div className="switch">
                        <input
                          type="checkbox"
                          ref={register}
                          name="isEnabled"
                          defaultChecked={data.isEnabled}
                          onChange={() => handleSubmit(enabledAccount)()}
                        />
                        <span className="slider">
                          <div className="switch__text switch__text--on">ON</div>
                          <div className="switch__text switch__text--off">OFF</div>
                        </span>
                      </div>
                    )
                  }
                </div>
              </div>
              <AccountInformation name={data?.institution?.name} id={data?.institution?.id} />
            </div>
            <Stepper steps={steps} onClickStep={() => {}} />
            {
              (step === 1 && data?.institution) && <StepOne data={data} onSubmit={onSubmit} onCancel={onCancel} />
            }
            {
              step === 2 && <StepTwo data={data} onSetRules={onSetRules} onChangeStep={onChangeStep} />
            }
            {
              step === 3 && <StepThree data={data} onSubmit={onSubmit} onChangeStep={onChangeStep} />
            }
            {
              step === 4 && (
              <AccountMessage message={{
                title: 'Success',
                subtitle: 'Account Successfully Updated.',
                isSuccess: true,
              }}
              />
              )
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditAccountView;
