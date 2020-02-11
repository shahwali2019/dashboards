
interface NavAttributes {
  [propName: string]: any;
}

interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
}
interface NavLabel {
  class?: string;
}
export interface NavData {
  name?: string;
  url?: any;
  icon?: any;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
  imageUrl?: string;
  style?: any;

}

export const navItems: NavData[] = [{

    name: "Dashboard",
    url: '/dashboard',
    icon: "fa fa-home",
    imageUrl: 'assets/img/brand/user.png',
  }, {
    name: 'System Admin',
    url: '/icons',
    icon: "fa fa-unlock",
      children: [{
        style: 'text-align-left',
      name: 'Hospital',
      url: '/menus/hospital',
      icon: 'fa fa-hospital-o'
    }, {
      name: 'Uesrs',
      url: '/menus/users',
      icon: 'fa fa-user'
    }, {
      name: 'Role',
      url: '/menus/role',
      icon: 'fa fa-h-square custom'
    }, {
      name: 'Permissions',
      url: '/menus/forms',
      icon: 'fa fa-lock'
    }, {
      name: 'Holidays',
      url: '/menus/holidays',
      icon: 'fa fa-adjust custom'
    }, {
      name: 'Masters',
      url: '/menus',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'Country',
        url: '/menus/country',
        icon: 'fa fa-heart-o custom'
      }, {
        name: 'City',
        url: '/menus/city',
        icon: 'fa fa-building-o'
      }, {
        name: 'Religion',
        url: '/menus/religion',
        icon: 'fa fa-user-md custom'
      }, {
        name: 'Maritial',
        url: '/menus/maritial',
        icon: 'fa fa-genderless custom'
      }, {
        name: 'Status',
        url: '/menus/status',
        icon: 'fas fa-male fa-female'
      }]
    }, {}]
  }, {
    name: 'Clinic Admin',
    url: '/icons',
    icon: 'fa fa-unlock',
    children: [{
      name: 'uom',
      url: '/clinicadmin/uom',
      icon: 'fa fa-hospital-o'
    }, {
      name: 'Drugs Category',
      url: '/icons',
      icon: 'fa fa-medkit',
      children: [{
        name: 'Drugs',
        url: '/clinicadmin/drugscategory/drugs',
        icon: 'fa fa-medkit'
      }, {
        name: 'Route',
        url: '/clinicadmin/drugscategory/route',
        icon: 'fa fa-h-square custom'
      }, {
        name: 'Frequency',
        url: '/clinicadmin/drugscategory/frequency',
        icon: 'fa fa-thermometer-half'
      }]
    }, {
      name: 'Departments',
      url: '/clinicadmin/departments',
      icon: 'fa fa-building-o'
    }, {
      name: 'Locations',
      url: '/clinicadmin/locations',
      icon: 'fa fa-location-arrow'
    }, {
      name: 'Service Type',
      url: '/clinicadmin/servicetype',
      icon: 'fas fa-cogs'
    }, {
      name: 'Procedures',
      url: '/icons',
      icon: 'fa fa-user-md custom',
      children: [{
        name: 'Radiology Masters',
        url: '/clinicadmin/procedures/radiologymasters',
        icon: 'fas fa-x-ray'
      }, {
        name: 'Gastroentrology Masters',
        url: '/clinicadmin/procedures/gastroentrologymasters',
        icon: 'fas fa-diagnoses'
      }, {
        name: 'Cardiology masters',
        url: '/clinicadmin/procedures/cardiologymasters',
        icon: 'fas fa-heartbeat'
      }, {
        name: 'Ophthalmology Masters',
        url: '/clinicadmin/procedures/ophthalmologymasters',
        icon: 'fa fa-eye'
      }]
    }, {
      name: 'Activity Masters',
      url: '/menus/religion',
      icon: 'fa fa-user-md custom'
    }, {
      name: 'External Physicians',
      url: '/menus/religion',
      icon: 'fa fa-user-md custom'
    }, {
      name: 'Insurance Companies',
      url: '/menus/religion',
      icon: 'fa fa-industry'
    }, {}]
  }, {
    name: 'Reception',
    url: '/icons',
    icon: 'fa fa-registered',
    children: [{
      name: 'Patient Registration',
      url: '/reception/patientregistration',
      icon: 'fa fa-user-md custom'
    }, {
      name: 'Patient Appointments',
      url: '/reception/patientappointments',
      icon: 'fa fa-hospital-o custom'
    }, {
      name: 'Generate Queue No',
      url: '/reception/generatequeuno',
      icon: 'fa fa-h-square custom'
    }, {
      name: 'Billing & Invoicing',
      url: '/reception/billinginvoicing',
      icon: "fa fa-medkit",
    }, {
      name: 'Remarks',
      url: '/pages',
      icon: 'fa fa-medkit',
      children: [{
        name: 'Generate Queue No',
        url: '/login',
        icon: 'fa fa-user-md custom'
      }, {
        name: 'Redirct to QMS',
        url: '/register',
        icon: 'fa fa-external-link'
      }]
    }]
  }, {
    name: "Physician's Workspace",
    url: '/physiciansworkspace',
    icon: 'fa fa-user-md custom',
    children: [{
      name: 'Physician Assessment',
      url: '/physiciansworkpace/physicianassessment',
      icon: 'fa fa-heartbeat custom'
    }, {
      name: 'Orders / Order Sets',
      url: '/physiciansworkpace/orders',
      icon: 'fa fa-first-order'
    }, {
      name: 'Care Plans',
      url: '/physiciansworkpace/careplans',
      icon: 'fa fa-tasks'
    }, {
      name: 'Physician Notes',
      url: '/physiciansworkpace/physician',
      icon: 'fa fa-tasks'
    }]
  }, {
    name: "Nurse's Workspace",
    url: '/views/nurseworkspace',
    icon: 'fa fa-user-md custom',
    children: [{
      name: 'Nursing Assessment',
      url: '/nurseworkspace/nursingassessment',
      icon: 'fa fa-tasks'
    }, {
      name: 'Nursing Flowsheet',
      url: '/nurseworkspace/nursingflowsheet',
      icon: 'fa fa-bar-chart'
    }, {
      name: 'Medication Prescription',
      url: '/physiciansworkpace/medicationprescription',
      icon: 'fa fa-tasks'
    }, {
      name: 'Nursing Notes',
      url: '/nurseworkspace/nursingnotes',
      icon: 'fa fa-sticky-note'
    }]
  }, {
    name: 'Specific Examinations /Procedures',
    url: '/icons',
    icon: 'fa fa-tasks',
    children: [{
      name: 'General X-Ray',
      url: '/icons',
      icon: 'fa fa-tasks',
      children: [{
        name: 'Worklist',
        url: '/specificexaminationsprocedures/generalxray/worklists',
        icon: 'fa fa-file'
      }, {
          name: 'Specialist Assessment & Reports',
          url: '/specificexaminationsprocedures/generalxray/specialistassessmentreports',
          icon: 'fa fa-file'
        },
        {
          name: 'Allied Health Notes',
          url: '/specificexaminationsprocedures/generalxray/healthalliednotes',
          icon: 'fa fa-file'
        }]
    }, /*{
      name: 'Specialist Assessment noteeeee & Report',
      url: '/icons',
      icon: 'fa fa-file',
      children: [{
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/specialistassessmentreport/healthalliednotes',
        icon: 'fa fa-file'
      }, {
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/specialistassessmentreport/heroes',
        icon: 'fa fa-file'
      }]
    },
*/
      {
        
      name: 'Mammogram',
      url: '/icons',
      icon: 'fas fa-stethoscope',
      children: [{
        name: 'worklist',
        url: '/specificexaminationsprocedures/mammogram/worklist',
        icon: 'fa fa-list-alt'
      }, {
          name: 'Specialist Assessment & Reports',
          url: '/specificexaminationsprocedures/mammogram/specialistassessmentreports',
          icon: 'fa fa-file'
        }, {
          name: 'Allied Health & Notes',
          url: '/specificexaminationsprocedures/mammogram/healthalliednotes',
          icon: 'fa fa-file'
        },]
    }, {
      name: 'Endoscopy',
      url: '/icons',
      icon: 'fa fa-file',
      children: [{
        name: 'Endoscopy I Worklist',
        url: '/specificexaminationsprocedures/endoscopy/endoscopyworklist1',
        icon: 'fa fa-file'
      }, {
        name: 'Endoscopy II Worklist',
          url: '/specificexaminationsprocedures/endoscopy/endoscopyworklist2',
        icon: 'fa fa-list-alt'
      }, {
        name: 'Specialist Assessment & Reports',
        url: '/specificexaminationsprocedures/endoscopy/specialistassessmentreports',
        icon: 'fa fa-file'
      }, {
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/endoscopy/healthalliednotes',
        icon: 'fa fa-file'
      }]
    }, {
      name: 'Ultrosound',
      url: '/icons',
      icon: 'fa fa-stethoscope',
      children: [{
        name: 'U/S I Worklist',
        url: '/specificexaminationsprocedures/ultrosound/worklist1',
        icon: 'fa fa-list-alt'
      }, {
        name: 'U/S II Worklist',
          url: '/specificexaminationsprocedures/ultrosound/worklist2',
        icon: 'fa fa-list-alt'
      }, {
        name: 'Specialist Assessment & Reports',
          url: '/specificexaminationsprocedures/ultrosound/specialistassessmentreports',
        icon: 'fas fa-notes-medical'
      }, {
        name: 'Allied Health Notes',
          url: '/specificexaminationsprocedures/ultrosound/healthalliednotes',
        icon: 'fas fa-notes-medical'
      },]
    }, {
      name: 'Exercise Stress Test',
      url: '/icons',
      icon: 'fas fa-weight',
      children: [{
        name: 'Worklist',
        url: '/specificexaminationsprocedures/exercisestresstest/worklist',
        icon: 'fa fa-list-alt'
      }, {
        name: 'Specialist Assessment & Reports',
        url: '//specificexaminationsprocedures/exercisestresstest/specialistassessmentreports',
        icon: 'fa fa-address-card',
      }, {
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/exercisestresstest/healthalliednotes',
        icon: 'fa fa-folder-open'
      },]
    }, {
      name: 'Eye & Vision Tests',
      url: '/icons',
      icon: 'fa fa-eye',
      children: [{
        name: 'Worklist',
        url: '/specificexaminationsprocedures/eyevisiontests/worklist',
        icon: 'fa fa-folder-open'
      }, {
        name: 'Specialist Assessment Reports',
        url: '/specificexaminationsprocedures/eyevisiontests/specialistassessmentreports',
        icon: 'fa fa-file-image-o',
      }, {
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/eyevisiontests/healthalliednotes',
        icon: 'fa fa-file-image-o'
      },]
    },]
  }, {
    name: 'Laboratory',
    url: '/icons',
    icon: 'fa fa-stethoscope custom fa-7x',
    children: [{
      name: 'Laboratory Analysis',
      url: '/laboratory/laboratoryanalysis',
      icon: 'fa fa-file-text'
    }, {
      name: 'Lab Stock & Inventory',
      url: '/laboratory/labstockinventory',
      icon: 'fa fa-hospital-o'
    }, {
      name: 'Master List',
      url: '/laboratory/masterlist',
      icon: 'fa fa-list-alt'
    }, {
      name: 'Reagent Library',
      url: '/laboratory/reagentlibrary',
      icon: 'fa fa-medkit'
    },]
  }, {
    name: 'Pharmacy',
    url: '/icons',
    icon: 'fa fa-file-o',
    children: [{
      name: 'Dispensing ',
      url: '/pharmacy/dispensing',
      icon: 'fa fa-heartbeat'
    }, {
      name: 'Requisition',
      url: '/pharmacy/requisition',
      icon: 'fa fa-heartbeat'
    }, {
      name: 'Pharmacy Stock & Inventory',
      url: '/icons',
      icon: 'fa fa-hospital-o',
      children: [{
        name: 'Master List',
        url: '/pharmacystockinventory/masterlist',
        icon: '"fa fa-user-md'
      }, {
        name: 'Drug Library',
        url: '/pharmacystockinventory/druglibrary',
        icon: 'fa fa-h-square'
      },]
    },]
  }, {
    name: 'Reports & Documents',
    url: '/reportsanddocuments',
    icon: 'fa fa-tasks',
    children: [{
      name: 'Consent Form ',
      url: '/reportsanddocuments/consentform',
      icon: 'fa fa-h-square'
    }, {
      name: 'Health Screening Report ',
      url: '/reportsanddocuments/healtscreeningreoprt',
      icon: 'fa fa-files-o'
    }, {
      name: 'Medical Certificate',
      url: '/reportsanddocuments/medicalcertificate',
      icon: 'fa fa-spinner'
    }, {
      name: 'Referral Notes',
      url: '/reportsanddocuments/referralnotes',
      icon: 'fa fa-files-o',
    }, {
      name: 'Request for Specific Examination/Procedure Report',
      url: '/reportsanddocuments/examprocedures',
      icon: 'fa fa-files-o',
    },]
  }, {
    name: 'Administration & Operations',
    url: '/operationdashboard',
    icon: 'fa fa-area-chart',
    children: [{
      name: 'Operation Dashboard',
      url: '/administrationoperations/operationdashboard',
      icon: 'fa fa-dashboard'
    },]
  }, {
    name: 'Finance',
    url: '/finace',
    icon: 'fa fa-credit-card',
    children: [{
      name: 'Financial Dashboard',
      url: '/finance/financialdashboard',
      icon: 'fa fa-credit-card-alt'
    }, {
      name: 'Billing Manager',
      url: '/finance/billingmanager',
      icon: 'fa fa-user-md custom'
    }, {
      name: 'Ledgers',
      url: '/finance/ledgers',
      icon: 'fa fa-credit-card-alt'
    }, {
      name: 'Accounts Payable',
      url: '/finance/accountspayable',
      icon: 'fa fa-credit-card'
    }, {
      name: 'Accounts Receivable',
      url: '/finance/accountsreceivable',
      icon: 'fa fa-credit-card'
    }, {
      name: 'Asset Management',
      url: '/finance/assetmanagement',
      icon: 'fa fa-credit-card'
    }, {
      name: 'Material Management',
      url: '/finance/materialmanagement',
      icon: 'fa fa-credit-card'
    }, {
      name: 'Insurance Management',
      url: '/finance/insurancemanagement',
      icon: 'fa fa-user-md custom'
    },]
  }, {
    name: 'Facility Management',
    url: '/buttons/dropdowns',
    icon: 'fa fa-tasks',
    children: [{
      name: 'Clinic Manager',
      url: '/menus/progress',
      icon: 'fa fa-user-md custom'
    }, {
      name: 'Maintenance Schedule & Update Notes',
      url: '/menus/progress',
      icon: 'fa fa-calendar-check-o'
    },]
  }, {
    name: 'Signin/Signup',
    url: '/pages',
    icon: 'fa fa-user-circle-o',
    children: [{
      name: 'Login',
      url: '/login',
      icon: 'fa fa-sign-in'
    }, {
      name: 'Reg',
      url: '/reg',
      icon: 'fa fa-registered'
    }, {
      name: 'Register',
      url: '/register',
      icon: 'fa fa-registered'
    }]
  }];
