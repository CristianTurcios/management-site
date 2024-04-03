interface Institution {
    name: string;
    id: string;
    lmsId: string;
    institutionRules: {
        en: {
            ops: Array<any>
        },
        es: {
            ops: Array<any>
        },
        pt: {
            ops: Array<any>
        },
    },
    branding: {
        brandingId: string;
        brandingImages: {
            logos: {
                sumadiWhite: string;
                sumadiBlue: string;
                sumadiFullWhite: string;
                sumadiIconImage: string;
            }
        },
        isEnabledCustomBranding: boolean
    }
}

interface Services {
    lms: {
        lti: {
            key: string;
            secret: string;
            directLaunch: {
                isEnabled: boolean;
            }
        },
        lmsTimeZone: string;
        api: {
            url: string;
            key: string,
            secret: string;
        }
        courseCopy: {
            username: string;
            password: string;
        }
    },
    google: {
        analytics: {
            trackId: string;
        }
    },
    aws: {
        rekognition: {
            collectionId: string;
            detectLabels: {
                maxLabels: number;
                minConfidence: number;
            },
        }
    },
    proctoring: {
        userMonitoring: boolean;
        focusMonitoring: boolean;
        typingPattern: boolean;
        roomScanMonitoring: boolean;
        objectMonitoring: {
            bannedObjects: string[];
            confidenceLevel: number;
            isEnabled: boolean;
        },
        banApps: {
            isEnabled: boolean;
            appTermination: boolean;
            banAppsDuringExam: boolean;
        },
        options: {
            userMonitoring: {
                webcamFullReport: boolean;
            },
            focusMonitoring: {
                focusLossAllowedTimeOut: number;
                takeScreenshot: boolean;
            }
        },
        photoBank: {
            endpoint: string;
            isEnabled: boolean;
        },
        idVerification: {
            isEnabled: boolean;
            isPhotoUploadEnabled: boolean;

            enforceNameDetection: {
                firstName: boolean;
                lastName: boolean;
            },
            enforceFaceRekognition: {
                isEnabled: boolean;
                confidenceLevel: number;
            },
            enforceKeywordsDetection: {
                isEnabled: boolean,
                optionalKeyWords: string,
                mandatoryKeyWords: string,
            }
        }
    },
    typingDNA: {
        key: string;
        secret: string;
        confidenceLevel: number;
        url: string;
    },
    chatbot: {
        availability: {
            chatbotExam: boolean;
            chatbotFaceRegistration: boolean;
            chatbotTypingRegistration: boolean;
            chatbotWizard: boolean
        },
        helpdeskEmail: string;
        id: string;
    },
    accountReports: {
        registrationProfiles: boolean;
        assessments: boolean;
        courses: boolean;
        idScan: boolean;
    }
}

export interface AccountInterface {
    isEnabled: boolean;
    institution: Institution;
    services: Services;
    courses: Array<any>;
    updatedAt: Date;
    createdAt: Date;
    proctorTimeZone: string;
    createdBy: string;
    updatedBy: string;
    institutionRules: any;
}

export type AccountFilters = {
    byRegion: string[],
    byStatus: string[]
  }

export type AvailableFilters = {
      value: 'byRegion' | 'byStatus'
  }
