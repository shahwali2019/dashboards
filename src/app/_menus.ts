interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  title?: boolean;
  children?: NavData[];
  wrapper?: NavWrapper;
}
export
  const navItems: NavData[] = [{
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'fa fa-tachometer fa-50x',
  }, {
    name: 'System Admin',
    url: '/icons',
    icon: 'fa fa-bars',
    children: [{
      name: 'Hospital',
      url: '/menus/hospital',
      icon: 'icon-puzzle'
    }, {
      name: 'Uesrs',
      url: '/menus/users',
      icon: 'icon-puzzle'
    }, {
      name: 'Role',
      url: '/menus/role',
      icon: 'icon-puzzle'
    }, {
      name: 'Permissions',
      url: '/menus/forms',
      icon: 'icon-puzzle'
    }, {
      name: 'Holidays',
      url: '/menus/holidays',
      icon: 'icon-puzzle'
    }, {
      name: 'Masters',
      url: '/menus',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'Country',
        url: '/menus/country',
        icon: 'icon-puzzle'
      }, {
        name: 'City',
        url: '/menus/city',
        icon: 'icon-puzzle'
      }, {
        name: 'Religion',
        url: '/menus/religion',
        icon: 'icon-puzzle'
      }, {
        name: 'Maritial',
        url: '/menus/maritial',
        icon: 'icon-puzzle'
      }, {
        name: 'Status',
        url: '/menus/status',
        icon: 'icon-puzzle'
      }]
    }, {}]
  }, {
    name: 'Clinic Admin',
    url: '/icons',
    icon: 'fa fa-bars',
    children: [{
      name: 'uom',
      url: '/clinicadmin/uom',
      icon: 'icon-cursor'
    }, {
      name: 'Drugs Category',
      url: '/icons',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'Drugs',
        url: '/clinicadmin/drugscategory/drugs',
        icon: 'icon-puzzle'
      }, {
        name: 'Route',
        url: '/clinicadmin/drugscategory/route',
        icon: 'icon-puzzle'
      }, {
        name: 'Frequency',
        url: '/clinicadmin/drugscategory/frequency',
        icon: 'icon-puzzle'
      }]
    }, {
      name: 'Departments',
      url: '/clinicadmin/departments',
      icon: 'icon-puzzle'
    }, {
      name: 'Locations',
      url: '/clinicadmin/locations',
      icon: 'icon-puzzle'
    }, {
      name: 'Service Type',
      url: '/clinicadmin/servicetype',
      icon: 'icon-puzzle'
    }, {
      name: 'Procedures',
      url: '/icons',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'Radiology Masters',
        url: '/clinicadmin/procedures/radiologymasters',
        icon: 'icon-puzzle'
      }, {
        name: 'Gastroentrology Masters',
        url: '/clinicadmin/procedures/gastroentrologymasters',
        icon: 'icon-puzzle'
      }, {
        name: 'Cardiology masters',
        url: '/clinicadmin/procedures/cardiologymasters',
        icon: 'icon-puzzle'
      }, {
        name: 'Ophthalmology Masters',
        url: '/clinicadmin/procedures/ophthalmologymasters',
        icon: 'icon-puzzle'
      }]
    }, {
      name: 'Activity Masters',
      url: '/menus/religion',
      icon: 'icon-puzzle'
    }, {
      name: 'External Physicians',
      url: '/menus/religion',
      icon: 'icon-puzzle'
    }, {
      name: 'Insurance Companies',
      url: '/menus/religion',
      icon: 'icon-puzzle'
    }, {}]
  }, {
    name: 'Reception',
    url: '/icons',
    icon: 'fa fa-bars',
    children: [{
      name: 'Patient Registration',
      url: '/reception/patientregistration',
      icon: 'icon-star'
    }, {
      name: 'Patient Appointments',
      url: '/reception/patientappointments',
      icon: 'icon-star'
      },
      {
      name: 'Generate Queue No',
      url: '/reception/generatequeuno',
      icon: 'icon-star'
    }, {
      name: 'Billing & Invoicing',
      url: '/reception/billinginvoicing',
      icon: 'icon-star'
    }, {
      name: 'Remarks',
      url: '/pages',
      icon: 'icon-star',
      children: [{
        name: 'Generate Queue No',
        url: '/login',
        icon: 'icon-star'
      }, {
        name: 'Redirct to QMS',
        url: '/register',
        icon: 'icon-star'
      }]
    }]
    },



    {
    name: "Physician's Workspace",
    url: 'physiciansworkspace',
    icon: 'icon-star',
    children: [{
      name: 'Physician Assessment',
      url: '/physiciansworkpace/physicianassessment',
      icon: 'icon-bell'
    }, {
      name: 'Orders / Order Sets',
      url: '/physiciansworkpace/orders',
      icon: 'icon-star'
    }, {
      name: 'Care Plans',
      url: '/physiciansworkpace/careplans',
      icon: 'icon-star'
    }, {
      name: 'Physician Notes',
      url: '/physiciansworkpace/physician',
      icon: 'icon-star'
    }]
  }, {
    name: "Nurse's Workspace",
    url: '/nurseworkspace',
    icon: 'icon-star',
    children: [{
      name: 'Nursing Assessment',
      url: '/nurseworkspace/nursingassessment',
      icon: 'icon-bell'
    }, {
      name: 'Nursing Flowsheet',
      url: '/nurseworkspace/nursingflowsheet',
      icon: 'icon-star'
    }, {
      name: 'Nursing Notes',
      url: '/nurseworkspace/nursingnotes',
      icon: 'icon-star'
    }]
  }, {
    name: 'Specific Examinations /Procedures',
    url: '/icons',
    icon: 'fa fa-bars',
    children: [{
      name: 'General X-Ray',
      url: '/icons',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'General X-ray',
        url: '/specificexaminationsprocedures/generalxray/worklists',
        icon: 'icon-star'
      }]
    }, {
      name: 'Specialist Assessment & Report',
      url: '/icons',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/specialistassessmentreport/healthalliednotes',
        icon: 'icon-puzzle'
      }, {
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/specialistassessmentreport/heroes',
        icon: 'icon-star'
      }]
    }, {
      name: 'Mammogram',
      url: '/icons',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'worklist',
        url: '/specificexaminationsprocedures/mammogram/worklist',
        icon: 'icon-puzzle'
      }]
    }, {
      name: 'Endoscopy',
      url: '/icons',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'Endoscopy I Worklist',
        url: '/specificexaminationsprocedures/endoscopy/route',
        icon: 'icon-puzzle'
      }, {
        name: 'Endoscopy II Worklist',
        url: '/specificexaminationsprocedures/endoscopy/frequency',
        icon: 'icon-star'
      }, {
        name: 'Specialist Assessment & Reports',
        url: '/specificexaminationsprocedures/endoscopy/specialistassessmentreports',
        icon: 'icon-star'
      }, {
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/endoscopy/healthalliednotes',
        icon: 'icon-star'
      }]
    }, {
      name: 'Ultrosound',
      url: '/icons',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'U/S I Worklist',
        url: '/specificexaminationsprocedures/endoscopy/route',
        icon: 'icon-puzzle'
      }, {
        name: 'U/S II Worklist',
        url: '/specificexaminationsprocedures/endoscopy/frequency',
        icon: 'icon-star'
      }, {
        name: 'Specialist Assessment & Reports',
        url: '/specificexaminationsprocedures/endoscopy/specialistassessmentreports',
        icon: 'fa fa-tasks fa-fw'
      }, {
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/endoscopy/healthalliednotes',
        icon: 'icon-puzzle'
      },]
    }, {
      name: 'Exercise Stress Test',
      url: '/icons',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'Worklist',
        url: '/specificexaminationsprocedures/exercisestresstest/route',
        icon: 'icon-puzzle'
      }, {
        name: 'Specialist Assessment & Reports',
        url: '//specificexaminationsprocedures/exercisestresstest/specialistassessmentreports',
        icon: 'fa fa-tasks fa-fw',
      }, {
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/exercisestresstest/healthalliednotes',
        icon: 'icon-puzzle'
      },]
    }, {
      name: 'Eye & Vision Tests',
      url: '/icons',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'Worklist',
        url: '/specificexaminationsprocedures/eyevisiontests/route',
        icon: 'icon-puzzle'
      }, {
        name: 'Specialist Assessment Reports',
        url: '/specificexaminationsprocedures/eyevisiontests/specialistassessmentreports',
        icon: 'fa fa-tasks fa-fw',
      }, {
        name: 'Allied Health Notes',
        url: '/specificexaminationsprocedures/eyevisiontests/healthalliednotes',
        icon: 'icon-puzzle'
      },]
    },]
  }, {
    name: 'Laboratory',
    url: '/icons',
    icon: 'fa fa-tasks fa-fw',
    children: [{
      name: 'Laboratory Analysis',
      url: '/laboratory/laboratoryanalysis',
      icon: 'icon-puzzle'
    }, {
      name: 'Lab Stock & Inventory',
      url: '/laboratory/labstockinventory',
      icon: 'icon-puzzle'
    }, {
      name: 'Master List',
      url: '/laboratory/masterlist',
      icon: 'icon-puzzle'
    }, {
      name: 'Reagent Library',
      url: '/laboratory/reagentlibrary',
      icon: 'icon-puzzle'
    },]
  }, {
    name: 'Pharmacy',
    url: '/icons',
    icon: 'fa fa-tasks fa-fw',
    children: [{
      name: 'Dispensing ',
      url: '/pharmacy/dispensing',
      icon: 'icon-puzzle'
    }, {
      name: 'Requisition',
      url: '/pharmacy/requisition',
      icon: 'icon-puzzle'
    }, {
      name: 'Pharmacy Stock & Inventory',
      url: '/icons',
      icon: 'fa fa-tasks fa-fw',
      children: [{
        name: 'Master List',
        url: '/pharmacystockinventory/masterlist',
        icon: 'icon-puzzle'
      }, {
        name: 'Drug Library',
        url: '/pharmacystockinventory/druglibrary',
        icon: 'icon-puzzle'
      },]
    },]
  }, {
    name: 'Reports',
    url: '/buttons/dropdowns',
    icon: 'fa fa-tasks fa-fw',
    children: [{
      name: 'Health Screening Report ',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    }, {
      name: 'Medical Certificate',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    }, {
      name: 'Referral Notes',
      url: '/buttons/dropdowns',
      icon: 'fa fa-tasks fa-fw',
    }, {
      name: 'Report for Specific Examination/Procedure Report',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    },]
  }, {
    name: 'Administration & Operations',
    url: '/buttons/dropdowns',
    icon: 'fa fa-tasks fa-fw',
    children: [{
      name: 'Operation Dashboard',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    },]
  }, {
    name: 'Finance',
    url: '/buttons/dropdowns',
    icon: 'fa fa-tasks fa-fw',
    children: [{
      name: 'Financial Dashboard',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    }, {
      name: 'Billing Manager',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    }, {
      name: 'Ledgers',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    }, {
      name: 'Accounts Payable',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    }, {
      name: 'Accounts Receivable',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    }, {
      name: 'Asset Management',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    }, {
      name: 'Material Management',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    }, {
      name: 'Insurance Management',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    },]
  }, {
    name: 'Facility Management',
    url: '/buttons/dropdowns',
    icon: 'fa fa-tasks fa-fw',
    children: [{
      name: 'Clinic Manager',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    }, {
      name: 'Maintenance Schedule & Update Notes',
      url: '/menus/progress',
      icon: 'icon-puzzle'
    },]
  }, {
    name: 'Signin/Signup',
    url: '/pages',
    icon: 'icon-star',
    children: [{
      name: 'Login',
      url: '/login',
      icon: 'icon-star'
    },
      {
        name: 'Reg',
        url: '/reg',
        icon: 'icon-star'
      },
      {
      name: 'Register',
      url: '/register',
      icon: 'icon-star'
    }]
  }];
