import React, {
  FC, useContext, useRef, useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Button from 'components/Button/Button';
import { useLazyQuery, useQuery } from '@apollo/client';
import { AccountInterface } from 'interfaces/Account';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTimezones } from 'apollo/queries/types/getTimezones';
import useOnClickOutside from 'components/clickOutSide/clickOutSide';
import GET_PASSWORD, { GET_COLLECTIONS_ID, GET_TIMEZONES } from 'apollo/queries/accounts';
import { faTimes, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { getPassword, getPasswordVariables } from 'apollo/queries/types/getPassword';
import { lmsIds, excludedLmsIds } from 'helpers/account';
import { SessionContext } from 'context/SessionContext';
import { hasAccess } from 'services/AuthenticationService';
import { getCollectionsId } from 'apollo/queries/types/getCollectionsId';

type StepProps = {
  data: AccountInterface;
  onSubmit(data: any, currentStep: number, step: number): void
  onCancel(): void
}
const StepOne: FC<StepProps> = (props) => {
  const { data, onSubmit, onCancel } = props;
  const ref = useRef(null);
  const passwordDefaultValues = {
    passwordLength: 16,
    upperCase: true,
    symbols: false,
    lowerCase: true,
    numbers: true,
    excludeSimilarCharacters: true,
  };

  const [showLmsLtiKey, setShowLmsLtiKey] = useState(false);
  const [showLmsLtiKeySecret, setShowlmsLtiKeySecret] = useState(false);
  const { session } = useContext(SessionContext);

  const [loadLmsLtiKey, { error, data: password }] = useLazyQuery<getPassword, getPasswordVariables>(
    GET_PASSWORD, { fetchPolicy: 'no-cache' },
  );
  const [loadLmsLtiKeySecret, { error: error2, data: password2 }] = useLazyQuery<getPassword, getPasswordVariables>(
    GET_PASSWORD, { fetchPolicy: 'no-cache' },
  );

  const { data: timezones } = useQuery<getTimezones>(
    GET_TIMEZONES,
  );

  const { data: collectionsId } = useQuery<getCollectionsId>(
    GET_COLLECTIONS_ID,
  );

  const {
    register, handleSubmit, errors, watch, control,
  } = useForm({ mode: 'onBlur' });

  const { register: register2, watch: watch2 } = useForm({ defaultValues: passwordDefaultValues });
  const { register: register3, watch: watch3 } = useForm({ defaultValues: passwordDefaultValues });

  const preSubmit = (formData: any) => {
    const newFormData = formData;
    if (!excludedLmsIds.includes(formData.institution.lmsId.value)) {
      newFormData.services.lms.lti.key = `${formData.institution.id}-${formData.services.lms.lti.key}`;
    }

    onSubmit(newFormData, 1, 2);
  };

  useOnClickOutside(ref, () => { setShowlmsLtiKeySecret(false); setShowLmsLtiKey(false); });

  const generateLmsLtiKey = () => {
    loadLmsLtiKey({
      variables: {
        passwordLength: parseInt(watch2('passwordLength'), 10) || 16,
        upperCase: watch2('upperCase') || false,
        symbols: watch2('symbols') || false,
        lowerCase: watch2('lowerCase') || false,
        numbers: watch2('numbers') || false,
        excludeSimilarCharacters: true,
      },
    });
  };

  const generateLmsLtiKeySecret = () => {
    loadLmsLtiKeySecret({
      variables: {
        passwordLength: parseInt(watch3('passwordLength'), 10) || 16,
        upperCase: watch3('upperCase') || false,
        symbols: watch3('symbols') || false,
        lowerCase: watch3('lowerCase') || false,
        numbers: watch3('numbers') || false,
        excludeSimilarCharacters: true,
      },
    });
  };
  const isReadOnly = !hasAccess(session.user.role as string, ['Admin', 'Editor']);

  return (
    <>
      <form onSubmit={handleSubmit(preSubmit)}>
        <div className="wizard-content">
          <div className="row">
            <div className="col-12 col-lg-6">
              <label htmlFor="institutionName" className="form__label">
                <strong>Institution Name</strong>
              </label>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Sumadi"
                  name="institution.name"
                  ref={register({ required: true })}
                  defaultValue={data?.institution?.name}
                  readOnly={isReadOnly}
                />
              </div>
              {errors?.institution?.name && <div className="input-message input-message--error">Required</div>}
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="institutionId" className="form__label"><strong>Institution ID - INSID</strong></label>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="SU2020"
                  name="institution.id"
                  ref={register({ required: true })}
                  defaultValue={data?.institution?.id}
                  readOnly={isReadOnly}
                />
              </div>
              {errors.institution?.id && <div className="input-message input-message--error">Required</div>}
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="institution.lmsId" className="form__label"><strong>LMS ID</strong></label>
              <div className="input-container">
                <Controller
                  as={Select}
                  options={lmsIds}
                  name="institution.lmsId"
                  className="custom-select-container mr-0"
                  classNamePrefix="custom-select"
                  control={control}
                  rules={{ required: true }}
                  isDisabled={isReadOnly}
                  defaultValue={data?.institution?.lmsId || ''}
                />
              </div>
              {errors.institution?.lmsId && <div className="input-message input-message--error">Required</div>}
            </div>

            <div className="col-12 col-lg-6">
              <label htmlFor="googleAnalytics" className="form__label">
                <strong>Google Analytics Track ID</strong>
              </label>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="UA-123456789-12"
                  name="services.google.analytics.trackId"
                  ref={register({ required: false })}
                  defaultValue={data?.services?.google?.analytics?.trackId}
                  readOnly={isReadOnly}
                />
              </div>
              {errors.googleAnalytics && <div className="input-message input-message--error">Required</div>}
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="awsRekognitionId" className="form__label">
                <strong>AWS ReKognition Collection ID</strong>
                <span>E.G. SUMADI.INSID_PROD</span>
              </label>
              <div className="input-container">
                <Controller
                  as={CreatableSelect}
                  options={collectionsId?.CollectionsId}
                  name="services.aws.rekognition.collectionId"
                  className="custom-select-container mr-0"
                  classNamePrefix="custom-select"
                  control={control}
                  rules={{ required: true }}
                  isDisabled={isReadOnly}
                  defaultValue={data?.services?.aws?.rekognition?.collectionId || ''}
                />
              </div>
              {errors.services?.aws?.rekognition?.collectionId
                && <div className="input-message input-message--error">Required</div>}
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="detectLabels.maxLabels" className="form__label">
                <strong>AWS ReKognition Max Labels</strong>
              </label>
              <div className="input-container">
                <input
                  type="number"
                  placeholder="0"
                  name="services.aws.rekognition.detectLabels.maxLabels"
                  ref={register({
                    required: 'The value must be between 0 and 100',
                    min: {
                      value: 0,
                      message: 'Min Value is 0',
                    },
                    max: {
                      value: 100,
                      message: 'Max Value is 100',
                    },
                  })}
                  defaultValue={data?.services?.aws?.rekognition?.detectLabels?.maxLabels}
                  readOnly={isReadOnly}
                />
              </div>
              {errors.services?.aws?.rekognition?.detectLabels?.maxLabels
                && (
                <div className="input-message input-message--error">
                  {
                  errors.services?.aws?.rekognition?.detectLabels?.maxLabels?.message
                  }
                </div>
                )}
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="detectLabels.minConfidence" className="form__label">
                <strong>AWS ReKognition Min Confidence</strong>
              </label>
              <div className="input-container">
                <input
                  type="number"
                  placeholder="0"
                  name="services.aws.rekognition.detectLabels.minConfidence"
                  ref={register({
                    required: 'The value must be between 0 and 100',
                    min: {
                      value: 0,
                      message: 'Min Value is 0',
                    },
                    max: {
                      value: 100,
                      message: 'Max Value is 100',
                    },
                  })}
                  defaultValue={data?.services?.aws?.rekognition?.detectLabels?.minConfidence}
                  readOnly={isReadOnly}
                />
              </div>
              {errors.services?.aws?.rekognition?.detectLabels?.minConfidence
                && (
                <div className="input-message input-message--error">
                  {
                    errors.services?.aws?.rekognition?.detectLabels?.minConfidence?.message
                  }
                </div>
                )}
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="lmsLtiKey" className="form__label">
                <strong>Services LMS LTI KEY</strong>
                <span>E.G. 3RCS3CTCYNXEN3PG</span>
              </label>
              <div className="input-container">
                <div className="input--fake element--width-auto input--auto-height">
                  {watch('institution.id') || data?.institution?.id }
                </div>
                <div className="input--with-elements">
                  <input
                    className="input--auto-height"
                    readOnly
                    type="text"
                    placeholder="DIM0ROY887e@"
                    name="services.lms.lti.key"
                    value={password?.generatePassword || data?.services?.lms?.lti?.key?.split('-').pop() || ''}
                    ref={register({ required: true })}
                  />
                  { hasAccess(session.user.role as string, ['Admin', 'Editor'])
                  && (
                  <button
                    className="button--within-input"
                    type="button"
                    onClick={() => { setShowLmsLtiKey(!showLmsLtiKey); }}
                  >
                    Generate
                  </button>
                  )}
                </div>
                {
                  showLmsLtiKey && (
                    <div className="popover popover--arrow-right show" ref={ref}>
                      <div className="row row--border-bottom">
                        <div className="col-8">
                          <div className="input-container" />
                          {
                            error && (
                              <div className="input-message input-message--error">
                                {error.message}
                              </div>
                            )
                          }
                        </div>
                        <div className="col-4 button-group">
                          <button
                            type="button"
                            className="button--transparent"
                            onClick={() => generateLmsLtiKey()}
                          >
                            <i><FontAwesomeIcon icon={faSyncAlt} /></i>
                          </button>
                          <button
                            type="button"
                            className="button--transparent"
                            onClick={() => setShowLmsLtiKey(false)}
                          >
                            <i><FontAwesomeIcon icon={faTimes} /></i>
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-8 flex-row">
                          <strong>Password Length</strong>
                          <div className="input--fake input--fake-generate">{watch2('passwordLength')}</div>
                          <input
                            className="slider"
                            type="range"
                            min="4"
                            max="50"
                            name="passwordLength"
                            ref={register2}
                          />
                        </div>
                        <div className="col-4">
                          <ul className="list--verification">
                            <li className="list-item">
                              <label className="checkbox--round">
                                <input
                                  className="checkbox"
                                  type="checkbox"
                                  name="upperCase"
                                  ref={register2}
                                />
                                <span className="checkbox__text">Uppercase</span>
                              </label>
                            </li>
                            <li className="list-item">
                              <label className="checkbox--round">
                                <input
                                  className="checkbox"
                                  type="checkbox"
                                  name="symbols"
                                  ref={register2}
                                />
                                <span className="checkbox__text">Symbol</span>
                              </label>
                            </li>
                            <li className="list-item">
                              <label className="checkbox--round">
                                <input
                                  className="checkbox"
                                  type="checkbox"
                                  name="lowerCase"
                                  ref={register2}
                                />
                                <span className="checkbox__text">Lowercase</span>
                              </label>
                            </li>
                            <li className="list-item">
                              <label className="checkbox--round">
                                <input
                                  className="checkbox"
                                  type="checkbox"
                                  name="numbers"
                                  ref={register2}
                                />
                                <span className="checkbox__text">Numbers</span>
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
              {errors.services?.lms?.lti?.key && <div className="input-message input-message--error">Required</div>}
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="lmsLtiKeySecret" className="form__label">
                <strong>Services LMS LTI KEY SECRET</strong>
                <span>E.G. 3RCS3CTCYNXEN3PG</span>
              </label>
              <div className="input-container">
                <div className="input--with-elements">
                  <input
                    readOnly
                    type="text"
                    placeholder="DIM0ROY887e@"
                    name="services.lms.lti.secret"
                    ref={register({ required: true })}
                    value={password2?.generatePassword || data?.services?.lms?.lti?.secret || ''}
                  />
                  { hasAccess(session.user.role as string, ['Admin', 'Editor'])
                  && (
                  <button
                    className="button--within-input"
                    type="button"
                    onClick={() => { setShowlmsLtiKeySecret(!showLmsLtiKeySecret); }}
                  >
                    Generate
                  </button>
                  )}
                </div>
                {
                  showLmsLtiKeySecret && (
                    <div className="popover popover--arrow-right show" ref={ref}>
                      <div className="row row--border-bottom">
                        <div className="col-8">
                          <div className="input-container" />
                          {
                            error2 && (
                              <div className="input-message input-message--error">
                                {error2.message}
                              </div>
                            )
                          }
                        </div>
                        <div className="col-4 button-group">
                          <button
                            type="button"
                            className="button--transparent"
                            onClick={() => generateLmsLtiKeySecret()}
                          >
                            <i><FontAwesomeIcon icon={faSyncAlt} /></i>
                          </button>
                          <button
                            type="button"
                            className="button--transparent"
                            onClick={() => setShowlmsLtiKeySecret(false)}
                          >
                            <i><FontAwesomeIcon icon={faTimes} /></i>
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-8 flex-row">
                          <strong>Password Length</strong>
                          <div className="input--fake input--fake-generate">{watch3('passwordLength')}</div>
                          <input
                            className="slider"
                            type="range"
                            min="4"
                            max="50"
                            name="passwordLength"
                            ref={register3}
                          />
                        </div>
                        <div className="col-4">
                          <ul className="list--verification">
                            <li className="list-item">
                              <label className="checkbox--round">
                                <input
                                  className="checkbox"
                                  type="checkbox"
                                  name="upperCase"
                                  ref={register3}
                                />
                                <span className="checkbox__text">Uppercase</span>
                              </label>
                            </li>
                            <li className="list-item">
                              <label className="checkbox--round">
                                <input
                                  className="checkbox"
                                  type="checkbox"
                                  name="symbols"
                                  ref={register3}
                                />
                                <span className="checkbox__text">Symbol</span>
                              </label>
                            </li>
                            <li className="list-item">
                              <label className="checkbox--round">
                                <input
                                  className="checkbox"
                                  type="checkbox"
                                  name="lowerCase"
                                  ref={register3}
                                />
                                <span className="checkbox__text">Lowercase</span>
                              </label>
                            </li>
                            <li className="list-item">
                              <label className="checkbox--round">
                                <input
                                  className="checkbox"
                                  type="checkbox"
                                  name="numbers"
                                  ref={register3}
                                />
                                <span className="checkbox__text">Numbers</span>
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
              {errors.services?.lms?.lti?.secret && <div className="input-message input-message--error">Required</div>}
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="lmsTimezone" className="form__label">
                <strong>LMS Timezone</strong>
                <span>E.G. America/Tegucigalpa</span>
              </label>
              <div className="input-container">
                <Controller
                  as={Select}
                  options={timezones?.Timezones}
                  name="services.lms.lmsTimeZone"
                  className="custom-select-container"
                  classNamePrefix="custom-select"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={data?.services?.lms?.lmsTimeZone || ''}
                  placeholder="America/Tegucigalpa"
                  isDisabled={isReadOnly}
                />
              </div>
              {errors.services?.lms?.lmsTimeZone && <div className="input-message input-message--error">Required</div>}
            </div>
            <div className="col-12 col-lg-6">
              <label htmlFor="proctorTimezone" className="form__label">
                <strong>Proctor Timezone</strong>
                <span>E.G. America/Tegucigalpa</span>
              </label>
              <div className="input-container">
                <Controller
                  as={Select}
                  options={timezones?.Timezones}
                  name="proctorTimeZone"
                  control={control}
                  className="custom-select-container"
                  classNamePrefix="custom-select"
                  rules={{ required: true }}
                  defaultValue={data?.proctorTimeZone || ''}
                  placeholder="America/Tegucigalpa"
                  isDisabled={isReadOnly}
                />
              </div>
              {errors.proctorTimeZone && <div className="input-message input-message--error">Required</div>}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 wizard-action-container">
            <button type="button" className="button--normal" onClick={() => onCancel()}>Cancel</button>
            <Button text="Next" />
          </div>
        </div>
      </form>
    </>
  );
};

export default StepOne;
