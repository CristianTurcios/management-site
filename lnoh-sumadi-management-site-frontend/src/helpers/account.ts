const getAccountObject = (accountData: any) => {
  const { optionalKeyWords, mandatoryKeyWords } = accountData
    .services?.proctoring?.idVerification?.enforceKeywordsDetection || [];

  const account = {
    isEnabled: accountData.isEnabled,
    institution: {
      name: accountData.institution.name,
      id: accountData.institution.id,
      lmsId: accountData.institution.lmsId.value,
      institutionRules: accountData.institutionRules,
      branding: {
        brandingId: accountData?.institution?.branding?.brandingId || '',
        brandingImages: {
          logos: {
            sumadiWhite: accountData?.institution?.branding?.brandingImages?.logos?.sumadiWhite || '',
            sumadiBlue: accountData?.institution?.branding?.brandingImages?.logos?.sumadiBlue || '',
            sumadiFullWhite: accountData?.institution?.branding?.brandingImages?.logos?.sumadiFullWhite || '',
            sumadiIconImage: accountData?.institution?.branding?.brandingImages?.logos?.sumadiIconImage || '',
          },
        },
        isEnabledCustomBranding: accountData?.institution?.branding?.isEnabledCustomBranding || false,
      },
    },
    services: {
      lms: {
        lti: {
          key: accountData.services.lms.lti.key,
          secret: accountData.services.lms.lti.secret,
          directLaunch: {
            isEnabled: accountData.services?.lms?.lti?.directLaunch?.isEnabled || false,
          },
        },
        lmsTimeZone: accountData.services?.lms?.lmsTimeZone?.value,
        api: {
          url: accountData.services?.lms?.api?.url || '',
          key: accountData.services?.lms?.api?.key || '',
          secret: accountData.services?.lms?.api?.secret || '',
        },
        courseCopy: {
          username: accountData.services?.lms?.courseCopy?.username || '',
          password: accountData.services?.lms?.courseCopy?.password || '',
        },
      },
      google: {
        analytics: {
          trackId: accountData?.services?.google?.analytics?.trackId || '',
        },
      },
      aws: {
        rekognition: {
          collectionId: accountData.services?.aws?.rekognition?.collectionId.value,
          detectLabels: {
            maxLabels: parseInt(accountData.services?.aws?.rekognition?.detectLabels?.maxLabels, 10) || 0,
            minConfidence: parseInt(accountData.services?.aws?.rekognition?.detectLabels?.minConfidence, 10) || 0,
          },
        },
      },
      proctoring: {
        userMonitoring: accountData.services.proctoring.userMonitoring,
        focusMonitoring: accountData.services.proctoring.focusMonitoring,
        typingPattern: accountData.services.proctoring.typingPattern,
        roomScanMonitoring: accountData.services.proctoring.roomScanMonitoring,
        options: {
          userMonitoring: {
            webcamFullReport: accountData.services?.proctoring?.options?.userMonitoring?.webcamFullReport || false,
          },
          focusMonitoring: {
            // eslint-disable-next-line max-len
            focusLossAllowedTimeOut: parseInt(accountData.services?.proctoring?.options?.focusMonitoring?.focusLossAllowedTimeOut, 10) || 0,
            takeScreenshot: accountData.services?.proctoring?.options?.focusMonitoring?.takeScreenshot || false,
          },
        },
        objectMonitoring: {
          bannedObjects: accountData.services?.proctoring?.objectMonitoring?.bannedObjects || [],
          confidenceLevel: accountData.services?.proctoring?.objectMonitoring?.confidenceLevel || 0,
          isEnabled: accountData.services.proctoring.objectMonitoring.isEnabled,
        },
        banApps: {
          isEnabled: accountData.services.proctoring.banApps.isEnabled,
          appTermination: accountData.services?.proctoring?.banApps?.appTermination || false,
          banAppsDuringExam: accountData.services?.proctoring?.banApps?.banAppsDuringExam || false,
        },
        photoBank: {
          endpoint: accountData.services.proctoring.photoBank?.endpoint || '',
          isEnabled: accountData.services.proctoring.photoBank.isEnabled,
        },
        idVerification: {
          isEnabled: accountData.services.proctoring.idVerification.isEnabled,
          isPhotoUploadEnabled: accountData.services.proctoring.idVerification.isPhotoUploadEnabled,
          enforceNameDetection: {
            firstName: accountData.services?.proctoring?.idVerification?.enforceNameDetection?.firstName || false,
            lastName: accountData.services?.proctoring?.idVerification?.enforceNameDetection?.lastName || false,
          },
          enforceFaceRekognition: {
            isEnabled: accountData.services?.proctoring?.idVerification?.enforceFaceRekognition?.isEnabled || false,
            // eslint-disable-next-line max-len
            confidenceLevel: accountData.services?.proctoring?.idVerification?.enforceFaceRekognition?.confidenceLevel || 0,
          },
          enforceKeywordsDetection: {
            isEnabled: accountData.services?.proctoring?.idVerification?.enforceKeywordsDetection?.isEnabled || false,
            optionalKeyWords: optionalKeyWords && optionalKeyWords.map((element: any) => element.value).join(','),
            mandatoryKeyWords: mandatoryKeyWords
            && mandatoryKeyWords.map((element: any) => element.value).join(','),
          },
        },
      },
      typingDNA: {
        key: accountData.services?.typingDNA?.key || '',
        secret: accountData.services?.typingDNA?.secret || '',
        confidenceLevel: parseInt(accountData.services?.typingDNA?.confidenceLevel, 10) || 0,
        url: accountData.services?.typingDNA?.url || '',
      },
      chatbot: {
        availability: {
          chatbotExam: accountData.services.chatbot.availability.chatbotExam || false,
          chatbotFaceRegistration: accountData.services.chatbot.availability.chatbotFaceRegistration || false,
          chatbotTypingRegistration: accountData.services.chatbot.availability.chatbotTypingRegistration || false,
          chatbotWizard: accountData.services.chatbot.availability.chatbotWizard || false,
        },
        helpdeskEmail: accountData.services.chatbot?.helpdeskEmail || '',
        id: accountData.services.chatbot?.id || '',
      },
      accountReports: {
        registrationProfiles: accountData.services.accountReports.registrationProfiles || false,
        assessments: accountData.services.accountReports.assessments || false,
        courses: accountData.services.accountReports.courses || false,
        idScan: accountData.services.accountReports.idScan || false,
      },
    },
    courses: [],
    proctorTimeZone: accountData.proctorTimeZone.value,
  };

  return account;
};

export const lmsIds = [
  { value: 'BBLEARN', label: 'BBLEARN' },
  { value: 'ACT360', label: 'ACT360' },
  { value: 'SYSQ', label: 'SYSQ' },
  { value: 'OPENLMS', label: 'OPENLMS' },
  { value: 'CAMBRIDGE', label: 'CAMBRIDGE' },
];

export const excludedLmsIds = [
  'BBLEARN',
  'OPENLMS',
];

export default getAccountObject;
