/* eslint-disable func-names */
import { Document, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

// inside of every object it's possible create another interfaces
interface institution extends Document {
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

interface services extends Document {
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
        },
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
          bannedObjects: String[];
          confidenceLevel: number;
          isEnabled: boolean;
        },
        banApps?: {
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
            enforceKeywordsDetection: {
              isEnabled: boolean;
              optionalKeyWords: string;
              mandatoryKeyWords: string;
            },
            enforceFaceRekognition: {
                isEnabled: boolean;
                confidenceLevel: number;
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

export interface AccountInterface extends Document {
    isEnabled: boolean;
    institution: institution;
    services: services;
    courses: Array<any>;
    updatedAt: Date;
    createdAt: Date;
    proctorTimeZone: string;
    createdBy: string;
    updatedBy: string;
}

const AccountSchema: Schema = new Schema({
  isEnabled: { type: Boolean, required: true },
  institution: {
    name: { type: String, unique: true, required: true },
    id: { type: String, unique: true, required: true },
    lmsId: { type: String, unique: false, required: true },
    institutionRules: {
      en: {
        ops: [Schema.Types.Mixed],
      },
      es: {
        ops: [Schema.Types.Mixed],
      },
      pt: {
        ops: [Schema.Types.Mixed],
      },
    },
    branding: {
      brandingId: {
        type: String,
        required: [
          function (this: AccountInterface) {
            return this.institution.branding.isEnabledCustomBranding;
          },
          'brandingId is required if institution.branding.isEnabledCustomBranding is true',
        ],
      },
      brandingImages: {
        logos: {
          sumadiWhite: {
            type: String,
            required: [
              function (this: AccountInterface) {
                return this.institution.branding.isEnabledCustomBranding;
              },
              'sumadiWhite is required if institution.branding.isEnabledCustomBranding is true',
            ],
          },
          sumadiBlue: {
            type: String,
            required: [
              function (this: AccountInterface) {
                return this.institution.branding.isEnabledCustomBranding;
              },
              'sumadiBlue is required if institution.branding.isEnabledCustomBranding is true',
            ],
          },
          sumadiFullWhite: {
            type: String,
            required: [
              function (this: AccountInterface) {
                return this.institution.branding.isEnabledCustomBranding;
              },
              'sumadiFullWhite is required if institution.branding.isEnabledCustomBranding is true',
            ],
          },
          sumadiIconImage: {
            type: String,
            required: [
              function (this: AccountInterface) {
                return this.institution.branding.isEnabledCustomBranding;
              },
              'sumadiIconImage is required if institution.branding.isEnabledCustomBranding is true',
            ],
          },
        },
      },
      isEnabledCustomBranding: Boolean,
    },
  },
  services: {
    lms: {
      lti: {
        key: { type: String, required: true },
        secret: { type: String, required: true },
        directLaunch: {
          isEnabled: { type: Boolean, default: false },
        },
      },
      lmsTimeZone: { type: String, required: true },
      api: {
        url: String,
        key: String,
        secret: String,
      },
      courseCopy: {
        username: String,
        password: String,
      },
    },
    google: {
      analytics: {
        trackId: { type: String },
      },
    },
    aws: {
      rekognition: {
        collectionId: { type: String, required: true },
        detectLabels: {
          maxLabels: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 100,
          },
          minConfidence: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 100,
          },
        },
      },
    },
    proctoring: {
      userMonitoring: { type: Boolean, required: true },
      focusMonitoring: { type: Boolean, required: true },
      typingPattern: { type: Boolean, required: true },
      roomScanMonitoring: { type: Boolean, required: true },
      objectMonitoring: {
        bannedObjects: {
          type: [String],
          required: [
            function (this: AccountInterface) {
              return this.services.proctoring.objectMonitoring.isEnabled;
            },
            'bannedObjects is required if services.proctoring.objectMonitoring.isEnabled is true',
          ],
        },
        confidenceLevel: {
          type: Number,
          required: [
            function (this: AccountInterface) {
              return this.services.proctoring.objectMonitoring.isEnabled;
            },
            'confidenceLevel is required if services.proctoring.objectMonitoring.isEnabled is true',
          ],
        },
        isEnabled: { type: Boolean, required: true, default: false },
      },
      banApps: {
        isEnabled: { type: Boolean, required: true, default: false },
        appTermination: { type: Boolean, required: true, default: false },
        banAppsDuringExam: { type: Boolean, required: true, default: false },
      },
      options: {
        userMonitoring: {
          webcamFullReport: {
            type: Boolean,
            default: false,
            required: [
              function (this: AccountInterface) {
                return this.services.proctoring.userMonitoring;
              },
              'webcamFullReport is required if services.proctoring.userMonitoring is true',
            ],
          },
        },
        focusMonitoring: {
          focusLossAllowedTimeOut: {
            type: Number,
            default: 10,
            required: [
              function (this: AccountInterface) {
                return this.services.proctoring.focusMonitoring;
              },
              'focusLossAllowedTimeOut is required if services.proctoring.focusMonitoring is true',
            ],
          },
          takeScreenshot: {
            type: Boolean,
            default: false,
            required: [
              function (this: AccountInterface) {
                return this.services.proctoring.focusMonitoring;
              },
              'takeScreenshot is required if services.proctoring.focusMonitoring is true',
            ],
            min: 0,
            max: 100,
          },
        },
      },
      photoBank: {
        endpoint: {
          type: String,
          required: [
            function (this: AccountInterface) {
              return this.services.proctoring.photoBank.isEnabled;
            },
            'endpoint is required if services.proctoring.photoBank.isEnabled is true',
          ],
        },
        isEnabled: { type: Boolean, required: true, default: false },
      },
      idVerification: {
        isEnabled: { type: Boolean, required: true, default: false },
        isPhotoUploadEnabled: { type: Boolean, required: true, default: false },
        enforceNameDetection: {
          firstName: {
            type: Boolean,
            default: false,
            required: [
              function (this: AccountInterface) {
                return this.services.proctoring.idVerification.isEnabled;
              },
              'firstName is required if services.proctoring.idVerification.isEnabled is true',
            ],
          },
          lastName: {
            type: Boolean,
            default: false,
            required: [
              function (this: AccountInterface) {
                return this.services.proctoring.idVerification.isEnabled;
              },
              'lastName is required if services.proctoring.idVerification.isEnabled is true',
            ],
          },
        },
        enforceKeywordsDetection: {
          isEnabled: {
            type: Boolean,
            default: false,
          },
          optionalKeyWords: {
            type: String,
            default: '',
            required: false,
          },
          mandatoryKeyWords: {
            type: String,
            required: [
              function (this: AccountInterface) {
                return this.services.proctoring.idVerification.enforceKeywordsDetection.isEnabled;
              },
              // eslint-disable-next-line max-len
              'mandatoryKeyWords is required if services.proctoring.idVerification.enforceKeywordsDetection.isEnabled is true',
            ],
            default: '',
          },
        },
        enforceFaceRekognition: {
          isEnabled: Boolean,
          confidenceLevel: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 100,
          },
        },
      },
    },
    typingDNA: {
      key: {
        type: String,
        required: [
          function (this: AccountInterface) {
            return this.services.proctoring.typingPattern;
          },
          'key is required if services.proctoring.typingPattern is true',
        ],
      },
      secret: {
        type: String,
        required: [
          function (this: AccountInterface) {
            return this.services.proctoring.typingPattern;
          },
          'secret is required if services.proctoring.typingPattern is true',
        ],
      },
      confidenceLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
        required: [
          function (this: AccountInterface) {
            return this.services.proctoring.typingPattern;
          },
          'confidenceLevel is required if services.proctoring.typingPattern is true',
        ],
      },
      url: {
        type: String,
        required: [
          function (this: AccountInterface) {
            return this.services.proctoring.typingPattern;
          },
          'url is required if services.proctoring.typingPattern is true',
        ],
      },
    },
    chatbot: {
      availability: {
        chatbotExam: { type: Boolean, required: true },
        chatbotFaceRegistration: { type: Boolean, required: true },
        chatbotTypingRegistration: { type: Boolean, required: true },
        chatbotWizard: { type: Boolean, required: true },
      },
      helpdeskEmail: {
        type: String,
        required: [
          function (this: AccountInterface) {
            return this.services.chatbot.availability.chatbotExam
            || this.services.chatbot.availability.chatbotFaceRegistration
            || this.services.chatbot.availability.chatbotTypingRegistration
            || this.services.chatbot.availability.chatbotWizard;
          },
          'helpdeskEmail is required if services.chatbot.availability has a true value',
        ],
      },
      id: {
        type: String,
        required: [
          function (this: AccountInterface) {
            return this.services.chatbot.availability.chatbotExam
              || this.services.chatbot.availability.chatbotFaceRegistration
              || this.services.chatbot.availability.chatbotTypingRegistration
              || this.services.chatbot.availability.chatbotWizard;
          },
          'id is required if services.chatbot.availability has a true value',
        ],
      },
    },
    accountReports: {
      registrationProfiles: { type: Boolean, required: true },
      assessments: { type: Boolean, required: true },
      courses: { type: Boolean, required: true },
      idScan: { type: Boolean, required: true },
    },
  },
  courses: [String],
  updatedAt: Date,
  createdAt: { type: Date, default: Date.now },
  proctorTimeZone: { type: String, required: true },
  createdBy: String,
  updatedBy: String,
});

AccountSchema.plugin(mongoosePaginate);
export default AccountSchema;
