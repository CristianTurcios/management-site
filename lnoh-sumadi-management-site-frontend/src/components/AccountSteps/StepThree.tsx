/* eslint-disable max-len */
import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';

import Button from 'components/Button/Button';
import { AccountInterface } from 'interfaces/Account';
import Accordion from 'components/Accordion/Accordion';
import { SessionContext } from 'context/SessionContext';
import { hasAccess } from 'services/AuthenticationService';

type StepProps = {
  data: AccountInterface;
  onSubmit(data: any, currentStep: number, step: number): void
  onChangeStep(currentStep: number, step: number): void
}

const StepThree: FC<StepProps> = (props) => {
  const { data, onSubmit, onChangeStep } = props;
  const [chatbot, setChatbot] = useState(false);
  const [api, setApi] = useState(false);
  const [courseCopy, setCourseCopy] = useState(false);
  const [branding, setBranding] = useState(false);
  const [proctoring, setProctoring] = useState(false);
  const [accountReports, setAccountReports] = useState(false);
  const { session } = useContext(SessionContext);
  const [showKeyDetection, setKeyDetection] = useState(false);
  const {
    register, handleSubmit, watch, errors, control,
  } = useForm({ mode: 'onBlur' });

  const preSubmit = (formData: any) => {
    onSubmit(formData, 3, 4);
  };

  useEffect(() => {
    setKeyDetection(watch('services.proctoring.idVerification.enforceKeywordsDetection.isEnabled'));
  }, [watch('services.proctoring.idVerification.enforceKeywordsDetection.isEnabled')]);

  const isReadOnly = !hasAccess(session.user.role as string, ['Admin', 'Editor']);

  return (
    <>
      <form onSubmit={handleSubmit(preSubmit)}>
        <div className="wizard-content">
          <Accordion title="Branding" isOpen={branding} collapse={() => setBranding(!branding)}>
            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Custom Branding">
                <strong>Custom Branding</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="institution.branding.isEnabledCustomBranding"
                    ref={register}
                    defaultChecked={data?.institution?.branding?.isEnabledCustomBranding}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
                {
                  watch('institution.branding.isEnabledCustomBranding') && (
                    <div className="row popover--internal show">
                      <div className="col-12">
                        <label className="form__label" htmlFor="Branding Id">
                          <strong>Branding Id</strong>
                        </label>
                        <div className="input-container">
                          <input
                            type="text"
                            name="institution.branding.brandingId"
                            ref={register({ required: 'Required' })}
                            defaultValue={data?.institution?.branding?.brandingId}
                            readOnly={isReadOnly}
                          />
                        </div>
                        {
                          errors.institution?.branding?.brandingId && (
                            <div className="input-message input-message--error">
                              {errors.institution?.branding?.brandingId?.message}
                            </div>
                          )
                        }
                      </div>
                      <div className="col-12">
                        <div className="col-12 mb-2">
                          <h3 className="popover-title">Branding Images</h3>
                        </div>
                        <label className="form__label" htmlFor="Sumadi White">
                          <strong>Sumadi White</strong>
                        </label>
                        <div className="input-container">
                          <input
                            type="text"
                            name="institution.branding.brandingImages.logos.sumadiWhite"
                            ref={register({ required: 'Required' })}
                            defaultValue={data?.institution?.branding?.brandingImages.logos.sumadiWhite}
                            readOnly={isReadOnly}
                          />
                        </div>
                        {
                          errors.institution?.branding?.brandingImages?.logos?.sumadiWhite && (
                            <div className="input-message input-message--error">
                              {errors.institution?.branding?.brandingImages?.logos?.sumadiWhite?.message}
                            </div>
                          )
                        }
                        <label className="form__label" htmlFor="Sumadi Blue">
                          <strong>Sumadi Blue</strong>
                        </label>
                        <div className="input-container">
                          <input
                            type="text"
                            name="institution.branding.brandingImages.logos.sumadiBlue"
                            ref={register({ required: 'Required' })}
                            defaultValue={data?.institution?.branding?.brandingImages.logos.sumadiBlue}
                            readOnly={isReadOnly}
                          />
                        </div>
                        {
                          errors.institution?.branding?.brandingImages?.logos?.sumadiBlue && (
                            <div className="input-message input-message--error">
                              {errors.institution?.branding?.brandingImages?.logos?.sumadiBlue?.message}
                            </div>
                          )
                        }
                        <label className="form__label" htmlFor="Sumadi Full White">
                          <strong>Sumadi Full White</strong>
                        </label>
                        <div className="input-container">
                          <input
                            type="text"
                            name="institution.branding.brandingImages.logos.sumadiFullWhite"
                            ref={register({ required: 'Required' })}
                            defaultValue={data?.institution?.branding?.brandingImages.logos.sumadiFullWhite}
                            readOnly={isReadOnly}
                          />
                        </div>
                        {
                          errors.institution?.branding?.brandingImages?.logos?.sumadiFullWhite && (
                            <div className="input-message input-message--error">
                              {errors.institution?.branding?.brandingImages?.logos?.sumadiFullWhite?.message}
                            </div>
                          )
                        }
                        <label className="form__label" htmlFor="Sumadi Icon Image">
                          <strong>Sumadi Icon Image</strong>
                        </label>
                        <div className="input-container">
                          <input
                            type="text"
                            name="institution.branding.brandingImages.logos.sumadiIconImage"
                            ref={register({ required: 'Required' })}
                            defaultValue={data?.institution?.branding?.brandingImages.logos.sumadiIconImage}
                            readOnly={isReadOnly}
                          />
                        </div>
                        {
                          errors.institution?.branding?.brandingImages?.logos?.sumadiIconImage && (
                            <div className="input-message input-message--error">
                              {errors.institution?.branding?.brandingImages?.logos?.sumadiIconImage?.message}
                            </div>
                          )
                        }
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </Accordion>

          <Accordion title="Proctoring" isOpen={proctoring} collapse={() => setProctoring(!proctoring)}>
            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="User Monitoring">
                <strong>User Monitoring</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.proctoring.userMonitoring"
                    ref={register}
                    defaultChecked={data?.services?.proctoring?.userMonitoring}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
                {
                    watch('services.proctoring.userMonitoring') && (
                    <div className="row popover--internal show">
                      <div className="col-12">
                        <label className="form__label" htmlFor="Webcam full report">
                          <strong>Webcam full report</strong>
                        </label>
                        <div className="input-container">
                          <div className="switch">
                            <input
                              type="checkbox"
                              name="services.proctoring.options.userMonitoring.webcamFullReport"
                              ref={register}
                              defaultChecked={data?.services?.proctoring?.options?.userMonitoring?.webcamFullReport}
                              disabled={isReadOnly}
                            />
                            <span className="slider">
                              <div className="switch__text switch__text--on">ON</div>
                              <div className="switch__text switch__text--off">OFF</div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    )
                  }
              </div>
            </div>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Focus monitoring">
                <strong>Focus monitoring</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.proctoring.focusMonitoring"
                    ref={register}
                    defaultChecked={data?.services?.proctoring?.focusMonitoring}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
                {
                      watch('services.proctoring.focusMonitoring') && (
                      <div className="row popover--internal show">
                        <div className="col-12 mb-2">
                          <label className="form__label" htmlFor="focusLossAllowedTimeOut">
                            <strong>Focus loss allowed timeout (sec)</strong>
                          </label>
                          <div className="input-container">
                            <input
                              type="number"
                              placeholder="80"
                              name="services.proctoring.options.focusMonitoring.focusLossAllowedTimeOut"
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
                              defaultValue={data?.services?.proctoring?.options?.focusMonitoring?.focusLossAllowedTimeOut}
                              readOnly={isReadOnly}
                            />
                          </div>
                          {
                            errors.services?.proctoring?.options?.focusMonitoring?.focusLossAllowedTimeOut && (
                            <div className="input-message input-message--error">
                              {errors.services?.proctoring?.options?.focusMonitoring?.focusLossAllowedTimeOut?.message}
                            </div>
                            )
                          }
                        </div>
                        <div className="col-12">
                          <label className="form__label" htmlFor="Take screenshot">
                            <strong>Take screenshot</strong>
                          </label>
                          <div className="input-container">
                            <div className="switch">
                              <input
                                type="checkbox"
                                name="services.proctoring.options.focusMonitoring.takeScreenshot"
                                ref={register}
                                defaultChecked={data?.services?.proctoring?.options?.focusMonitoring?.takeScreenshot}
                                disabled={isReadOnly}
                              />
                              <span className="slider">
                                <div className="switch__text switch__text--on">ON</div>
                                <div className="switch__text switch__text--off">OFF</div>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      )
                    }
              </div>
            </div>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="ID Verification">
                <strong>ID Verification</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.proctoring.idVerification.isEnabled"
                    ref={register}
                    defaultChecked={data?.services?.proctoring?.idVerification?.isEnabled}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
                {
                      watch('services.proctoring.idVerification.isEnabled') && (
                      <div className="row popover--internal show">
                        <div className="col-12 col-lg-4 mb-2">
                          <label className="form__label" htmlFor="First name">
                            <strong>First name</strong>
                          </label>
                          <div className="input-container">
                            <div className="switch">
                              <input
                                type="checkbox"
                                name="services.proctoring.idVerification.enforceNameDetection.firstName"
                                ref={register}
                                defaultChecked={data?.services?.proctoring?.idVerification?.enforceNameDetection?.firstName}
                                disabled={isReadOnly}
                              />
                              <span className="slider">
                                <div className="switch__text switch__text--on">ON</div>
                                <div className="switch__text switch__text--off">OFF</div>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-2">
                          <label className="form__label" htmlFor="Last name">
                            <strong>Last name</strong>
                          </label>
                          <div className="input-container">
                            <div className="switch">
                              <input
                                type="checkbox"
                                name="services.proctoring.idVerification.enforceNameDetection.lastName"
                                ref={register}
                                defaultChecked={data?.services?.proctoring?.idVerification?.enforceNameDetection?.lastName}
                                disabled={isReadOnly}
                              />
                              <span className="slider">
                                <div className="switch__text switch__text--on">ON</div>
                                <div className="switch__text switch__text--off">OFF</div>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-4 mb-2">
                          <label className="form__label" htmlFor="Photo Upload">
                            <strong>Photo Upload</strong>
                          </label>
                          <div className="input-container">
                            <div className="switch">
                              <input
                                type="checkbox"
                                name="services.proctoring.idVerification.isPhotoUploadEnabled"
                                ref={register}
                                defaultChecked={data?.services?.proctoring?.idVerification?.isPhotoUploadEnabled}
                                disabled={isReadOnly}
                              />
                              <span className="slider">
                                <div className="switch__text switch__text--on">ON</div>
                                <div className="switch__text switch__text--off">OFF</div>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-4 mb-2">
                          <label className="form__label" htmlFor="Enforce face recognition">
                            <strong>Enforce face recognition</strong>
                          </label>
                          <div className="input-container">
                            <div className="switch">
                              <input
                                type="checkbox"
                                name="services.proctoring.idVerification.enforceFaceRekognition.isEnabled"
                                ref={register}
                                defaultChecked={data?.services?.proctoring?.idVerification?.enforceFaceRekognition?.isEnabled}
                                disabled={isReadOnly}
                              />
                              <span className="slider">
                                <div className="switch__text switch__text--on">ON</div>
                                <div className="switch__text switch__text--off">OFF</div>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="form__label" htmlFor="Confidence level">
                            <strong>Confidence level</strong>
                          </label>
                          <div className="input-container">
                            <input
                              type="number"
                              placeholder="95"
                              name="services.proctoring.idVerification.enforceFaceRekognition.confidenceLevel"
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
                              defaultValue={data?.services?.proctoring?.idVerification?.enforceFaceRekognition?.confidenceLevel}
                              readOnly={isReadOnly}
                            />
                          </div>
                          {
                            errors.services?.proctoring?.idVerification?.enforceFaceRekognition?.confidenceLevel && (
                            <div className="input-message input-message--error">
                              {
                              errors.services?.proctoring?.idVerification?.enforceFaceRekognition?.confidenceLevel?.message
                              }
                            </div>
                            )
                          }
                        </div>

                        <div className="col-12">
                          <label className="form__label" htmlFor="Enforce face recognition">
                            <strong>Enforce Keywords Detection</strong>
                          </label>
                          <div className="input-container">
                            <div className="switch">
                              <input
                                type="checkbox"
                                name="services.proctoring.idVerification.enforceKeywordsDetection.isEnabled"
                                ref={register}
                                id="mandatory"
                                defaultChecked={data?.services?.proctoring?.idVerification?.enforceKeywordsDetection?.isEnabled}
                                disabled={isReadOnly}
                              />
                              <span className="slider">
                                <div className="switch__text switch__text--on">ON</div>
                                <div className="switch__text switch__text--off">OFF</div>
                              </span>
                            </div>

                            {

                          (showKeyDetection) && (
                            <div>
                              <div className="col-12">
                                <label className="form__label" htmlFor="Mandatory Keywords">
                                  <strong>Mandatory Keywords</strong>
                                </label>
                                <div className="input-container">
                                  <Controller
                                    as={CreatableSelect}
                                    isMulti
                                    name="services.proctoring.idVerification.enforceKeywordsDetection.mandatoryKeyWords"
                                    className="custom-select-container mr-0 h-auto"
                                    classNamePrefix="custom-select"
                                    control={control}
                                    rules={{ required: true }}
                                    isDisabled={isReadOnly}
                                    defaultValue={data?.services?.proctoring?.idVerification?.enforceKeywordsDetection?.mandatoryKeyWords}
                                  />
                                </div>
                                {

                                  errors.services?.proctoring?.idVerification?.enforceKeywordsDetection?.mandatoryKeyWords && (
                                    <div className="input-message input-message--error">
                                      Required
                                    </div>
                                  )
                                }
                              </div>
                              <div className="col-12">
                                <label className="form__label" htmlFor="Optiona Keywords">
                                  <strong>Optional Keywords</strong>
                                </label>
                                <div className="input-container">
                                  <Controller
                                    as={CreatableSelect}
                                    isMulti
                                    name="services.proctoring.idVerification.enforceKeywordsDetection.optionalKeyWords"
                                    className="custom-select-container mr-0"
                                    classNamePrefix="custom-select"
                                    control={control}
                                    isDisabled={isReadOnly}
                                    defaultValue={data?.services?.proctoring?.idVerification?.enforceKeywordsDetection?.optionalKeyWords}
                                  />

                                </div>
                              </div>
                            </div>
                          )
                        }
                          </div>
                        </div>

                      </div>
                      )
                    }
              </div>
            </div>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Photo Bank">
                <strong>Photo Bank</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.proctoring.photoBank.isEnabled"
                    ref={register}
                    defaultChecked={data?.services?.proctoring?.photoBank?.isEnabled}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
                {
                      watch('services.proctoring.photoBank.isEnabled') && (
                        <div className="row popover--internal show">
                          <div className="col-12">
                            <label className="form__label" htmlFor="Endpoint">
                              <strong>Endpoint</strong>
                            </label>
                            <div className="input-container">
                              <input
                                type="text"
                                name="services.proctoring.photoBank.endpoint"
                                ref={register({ required: 'Required' })}
                                defaultValue={data?.services?.proctoring?.photoBank?.endpoint}
                                readOnly={isReadOnly}
                              />
                            </div>
                            {
                              errors.services?.proctoring?.photoBank?.endpoint && (
                              <div className="input-message input-message--error">
                                {errors.services?.proctoring?.photoBank?.endpoint?.message}
                              </div>
                              )
                            }
                          </div>
                        </div>
                      )
                    }
              </div>
            </div>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Object Monitoring">
                <strong>Object Monitoring</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.proctoring.objectMonitoring.isEnabled"
                    ref={register}
                    defaultChecked={data?.services?.proctoring?.objectMonitoring?.isEnabled}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
                {
                      watch('services.proctoring.objectMonitoring.isEnabled') && (
                        <div className="row popover--internal show">
                          <div className="col-12">
                            <label className="form__label" htmlFor="bannedObjects">
                              <strong>Banned Objects</strong>
                            </label>
                            <div className="input-container">
                              <select
                                multiple
                                name="services.proctoring.objectMonitoring.bannedObjects"
                                ref={register({ required: 'Required' })}
                                defaultValue={data?.services?.proctoring?.objectMonitoring?.bannedObjects}
                                disabled={isReadOnly}
                              >
                                <option value="Cell Phone">Cell Phone</option>
                                <option value="Tablet Computer">Tablet Computer</option>
                                <option value="Book">Book</option>
                                <option value="Smartphone">Smartphone</option>
                                <option value="Notebook">Notebook</option>
                              </select>
                            </div>
                            {
                              errors.services?.proctoring?.objectMonitoring?.bannedObjects && (
                              <div className="input-message input-message--error">
                                {errors.services?.proctoring?.objectMonitoring?.bannedObjects?.message}
                              </div>
                              )
                            }
                          </div>
                          <div className="col-12">
                            <label className="form__label" htmlFor="Confidence level">
                              <strong>Confidence level</strong>
                            </label>
                            <div className="input-container">
                              <input
                                type="number"
                                placeholder="95"
                                name="services.proctoring.objectMonitoring.confidenceLevel"
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
                                defaultValue={data?.services?.proctoring?.objectMonitoring?.confidenceLevel}
                                readOnly={isReadOnly}
                              />
                            </div>
                            {
                            errors.services?.proctoring?.objectMonitoring?.confidenceLevel && (
                            <div className="input-message input-message--error">
                              {

                                errors.services?.proctoring?.objectMonitoring?.confidenceLevel?.message
                              }
                            </div>
                            )
                          }
                          </div>
                        </div>
                      )
                    }
              </div>
            </div>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Typing Pattern">
                <strong>Typing Pattern</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.proctoring.typingPattern"
                    ref={register}
                    defaultChecked={data?.services?.proctoring?.typingPattern}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
                {
                      watch('services.proctoring.typingPattern') && (
                        <div className="row popover--internal show">
                          <div className="col-12">
                            <div className="col-12 mb-2">
                              <h3 className="popover-title">Typing DNA</h3>
                            </div>
                            <label className="form__label" htmlFor="Key">
                              <strong>Key</strong>
                            </label>
                            <div className="input-container">
                              <input
                                type="text"
                                name="services.typingDNA.key"
                                ref={register({ required: 'Required' })}
                                defaultValue={data?.services?.typingDNA?.key}
                                readOnly={isReadOnly}
                              />
                            </div>
                            {
                              errors.services?.typingDNA?.key && (
                                <div className="input-message input-message--error">
                                    {errors.services?.typingDNA?.key?.message}
                                </div>
                              )
                            }
                          </div>
                          <div className="col-12">
                            <label className="form__label" htmlFor="Secret">
                              <strong>Secret</strong>
                            </label>
                            <div className="input-container">
                              <input
                                type="text"
                                name="services.typingDNA.secret"
                                ref={register({ required: 'Required' })}
                                defaultValue={data?.services?.typingDNA?.secret}
                                readOnly={isReadOnly}
                              />
                            </div>
                            {
                              errors.services?.typingDNA?.secret && (
                                <div className="input-message input-message--error">
                                  {errors.services?.typingDNA?.secret?.message}
                                </div>
                              )
                            }
                          </div>
                          <div className="col-12">
                            <label className="form__label" htmlFor="Confidence Level">
                              <strong>Confidence Level</strong>
                            </label>
                            <div className="input-container">
                              <input
                                type="number"
                                name="services.typingDNA.confidenceLevel"
                                placeholder="0"
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
                                defaultValue={data?.services?.typingDNA?.confidenceLevel}
                                readOnly={isReadOnly}
                              />
                            </div>
                            {
                              errors.services?.typingDNA?.confidenceLevel && (
                                <div className="input-message input-message--error">
                                  {errors.services?.typingDNA?.confidenceLevel?.message}
                                </div>
                              )
                            }
                          </div>
                          <div className="col-12">
                            <label className="form__label" htmlFor="Url">
                              <strong>Url</strong>
                            </label>
                            <div className="input-container">
                              <input
                                type="text"
                                name="services.typingDNA.url"
                                ref={register({ required: 'Required' })}
                                defaultValue={data?.services?.typingDNA?.url}
                                readOnly={isReadOnly}
                              />
                            </div>
                            {
                              errors.services?.typingDNA?.url && (
                                <div className="input-message input-message--error">
                                  {errors.services?.typingDNA?.url?.message}
                                </div>
                              )
                            }
                          </div>
                        </div>
                      )
                    }
              </div>
            </div>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Ban Apps">
                <strong>Banned Apps</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.proctoring.banApps.isEnabled"
                    ref={register}
                    defaultChecked={data?.services?.proctoring?.banApps?.isEnabled}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
                {
                  watch('services.proctoring.banApps.isEnabled') && (
                    <div className="row popover--internal show">
                      <div className="col-12 col-lg-6">
                        <label className="form__label" htmlFor="App Termination">
                          <strong>App Termination</strong>
                        </label>
                        <div className="input-container">
                          <div className="switch">
                            <input
                              type="checkbox"
                              name="services.proctoring.banApps.appTermination"
                              ref={register}
                              defaultChecked={data?.services?.proctoring?.banApps?.appTermination}
                              disabled={isReadOnly}
                            />
                            <span className="slider">
                              <div className="switch__text switch__text--on">ON</div>
                              <div className="switch__text switch__text--off">OFF</div>
                            </span>
                          </div>
                        </div>
                        {
                        errors.services?.proctoring?.banApps?.appTermination && (
                        <div className="input-message input-message--error">
                          {errors.services?.proctoring?.banApps?.appTermination?.message}
                        </div>
                        )
                      }
                      </div>
                      <div className="col-12 col-lg-6">
                        <label className="form__label" htmlFor="Ban Apps During Exam">
                          <strong>Ban Apps During Exam</strong>
                        </label>
                        <div className="input-container">
                          <div className="switch">
                            <input
                              type="checkbox"
                              name="services.proctoring.banApps.banAppsDuringExam"
                              ref={register}
                              defaultChecked={data?.services?.proctoring?.banApps?.banAppsDuringExam}
                              disabled={isReadOnly}
                            />
                            <span className="slider">
                              <div className="switch__text switch__text--on">ON</div>
                              <div className="switch__text switch__text--off">OFF</div>
                            </span>
                          </div>
                        </div>
                        {
                        errors.services?.proctoring?.banApps?.banAppsDuringExam && (
                        <div className="input-message input-message--error">
                          {errors.services?.proctoring?.banApps?.banAppsDuringExam?.message}
                        </div>
                        )
                      }
                      </div>

                    </div>
                  )
                }
              </div>
            </div>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Room Scan Monitoring">
                <strong>Room Scan Monitoring</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.proctoring.roomScanMonitoring"
                    ref={register}
                    defaultChecked={data?.services?.proctoring?.roomScanMonitoring}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
              </div>
            </div>

          </Accordion>

          <Accordion title="Chatbot" isOpen={chatbot} collapse={() => setChatbot(!chatbot)}>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Chatbot Exam">
                <strong>Chatbot Exam</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.chatbot.availability.chatbotExam"
                    ref={register}
                    defaultChecked={data?.services?.chatbot?.availability?.chatbotExam}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Chatbot Face Registration">
                <strong>Chatbot Face Registration</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.chatbot.availability.chatbotFaceRegistration"
                    ref={register}
                    defaultChecked={data?.services?.chatbot?.availability?.chatbotFaceRegistration}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Chatbot Typing Registration">
                <strong>Chatbot Typing Registration</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.chatbot.availability.chatbotTypingRegistration"
                    ref={register}
                    defaultChecked={data?.services?.chatbot?.availability?.chatbotTypingRegistration}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Chatbot Wizard">
                <strong>Chatbot Wizard</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.chatbot.availability.chatbotWizard"
                    ref={register}
                    defaultChecked={data?.services?.chatbot?.availability?.chatbotWizard}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
              </div>
            </div>
            {
              (
                watch('services.chatbot.availability.chatbotWizard')
                || watch('services.chatbot.availability.chatbotExam')
                || watch('services.chatbot.availability.chatbotFaceRegistration')
                || watch('services.chatbot.availability.chatbotTypingRegistration')
              ) && (
              <>
                <div className="col-12 col-lg-6 input-container--with-popover">
                  <label className="form__label" htmlFor="ID">
                    <strong>ID</strong>
                  </label>
                  <div className="input-container">
                    <input
                      type="text"
                      name="services.chatbot.id"
                      ref={register({ required: 'Required' })}
                      defaultValue={data?.services?.chatbot?.id}
                      readOnly={isReadOnly}
                    />
                  </div>
                  {
                      errors.services?.chatbot?.id && (
                      <div className="input-message input-message--error">
                          {errors.services?.chatbot?.id?.message}
                      </div>
                      )
                  }
                </div>
                <div className="col-12 col-lg-6 input-container--with-popover">
                  <label className="form__label" htmlFor="Helpdesk Email">
                    <strong>Helpdesk Email</strong>
                  </label>
                  <div className="input-container">
                    <input
                      type="text"
                      name="services.chatbot.helpdeskEmail"
                      ref={register({
                        required: 'Required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid Email Format',
                        },
                      })}
                      defaultValue={data?.services?.chatbot?.helpdeskEmail}
                      readOnly={isReadOnly}
                    />
                  </div>
                  {
                    errors.services?.chatbot?.helpdeskEmail && (
                      <div className="input-message input-message--error">
                        {errors.services?.chatbot?.helpdeskEmail?.message}
                      </div>
                    )
                  }
                </div>
              </>
              )
            }
          </Accordion>

          <Accordion
            title="Account Reports"
            isOpen={accountReports}
            collapse={() => setAccountReports(!accountReports)}
          >
            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Registration Profiles">
                <strong>Registration Profiles</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.accountReports.registrationProfiles"
                    ref={register}
                    defaultChecked={data?.services?.accountReports?.registrationProfiles}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Assessments">
                <strong>Assessments</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.accountReports.assessments"
                    ref={register}
                    defaultChecked={data?.services?.accountReports?.assessments}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Courses">
                <strong>Courses</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.accountReports.courses"
                    ref={register}
                    defaultChecked={data?.services?.accountReports?.courses}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Id Scan">
                <strong>Id Scan</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.accountReports.idScan"
                    ref={register}
                    defaultChecked={data?.services?.accountReports?.idScan}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
              </div>
            </div>
          </Accordion>

          <Accordion title="Course Copy" isOpen={courseCopy} collapse={() => setCourseCopy(!courseCopy)}>
            <div className="col-12 col-lg-6 input-container--with-popover">
              <div className="col-12 mb-2">
                <h3 className="popover-title">Course Copy</h3>
              </div>
              <label className="form__label" htmlFor="Url">
                <strong>Username</strong>
              </label>
              <div className="input-container">
                <input
                  type="text"
                  name="services.lms.courseCopy.username"
                  ref={register}
                  defaultValue={data?.services?.lms?.courseCopy?.username}
                  readOnly={isReadOnly}
                />
              </div>
              <label className="form__label" htmlFor="Key">
                <strong>Password</strong>
              </label>
              <div className="input-container">
                <input
                  type="text"
                  name="services.lms.courseCopy.password"
                  ref={register}
                  defaultValue={data?.services?.lms?.courseCopy?.password}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </Accordion>

          <Accordion title="Api" isOpen={api} collapse={() => setApi(!api)}>
            <div className="col-12 col-lg-6 input-container--with-popover">
              <label className="form__label" htmlFor="Direct Launch">
                <strong>Direct Launch</strong>
              </label>
              <div className="input-container">
                <div className="switch">
                  <input
                    type="checkbox"
                    name="services.lms.lti.directLaunch.isEnabled"
                    ref={register}
                    defaultChecked={data?.services?.lms?.lti?.directLaunch?.isEnabled}
                    disabled={isReadOnly}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">ON</div>
                    <div className="switch__text switch__text--off">OFF</div>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 input-container--with-popover">
              <div className="col-12 mb-2">
                <h3 className="popover-title">Api</h3>
              </div>
              <label className="form__label" htmlFor="Url">
                <strong>Url</strong>
              </label>
              <div className="input-container">
                <input
                  type="text"
                  name="services.lms.api.url"
                  ref={register}
                  defaultValue={data?.services?.lms?.api?.url}
                  readOnly={isReadOnly}
                />
              </div>
              <label className="form__label" htmlFor="Key">
                <strong>Key</strong>
              </label>
              <div className="input-container">
                <input
                  type="text"
                  name="services.lms.api.key"
                  ref={register}
                  defaultValue={data?.services?.lms?.api?.key}
                  readOnly={isReadOnly}
                />
              </div>
              <label className="form__label" htmlFor="Secret">
                <strong>Secret</strong>
              </label>
              <div className="input-container">
                <input
                  type="text"
                  name="services.lms.api.secret"
                  ref={register}
                  defaultValue={data?.services?.lms?.api?.secret}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </Accordion>
        </div>
        <div className="row">
          <div className="col-12 wizard-action-container">
            <button type="button" className="button--normal" onClick={() => onChangeStep(3, 2)}>Previous</button>
            {hasAccess(session.user.role as string, ['Admin', 'Editor'])
            && <Button text="Submit" />}
          </div>
        </div>
      </form>
    </>
  );
};

export default StepThree;
