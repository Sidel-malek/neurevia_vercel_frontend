export const BIOMARKER_CATEGORIES = {
  demographics: {
    title: "Demographics",
    fields: {
      NACCAGE: { 
        label: "Age", 
        type: "number", 
        range: "0-120", 
        unit: "years",
        description: "Patient's current age in years. Age is a significant risk factor for Alzheimer's disease, with risk increasing substantially after age 65."
      },
      SEX: {
        label: "Sex",
        type: "select",
        options: [
          { value: 1, label: "Male" },
          { value: 2, label: "Female" },
        ],
        description: "Biological sex of the patient. Women have a higher prevalence of Alzheimer's disease, partly due to longer lifespan and hormonal factors."
      },
      EDUC: { 
        label: "Education Years", 
        type: "number", 
        range: "0-36", 
        unit: "years",
        description: "Total years of formal education completed. Higher education is associated with cognitive reserve, potentially delaying Alzheimer's symptoms onset."
      },
      MARISTAT: {
        label: "Marital Status",
        type: "select",
        options: [
          { value: 1, label: "Married" },
          { value: 2, label: "Widowed" },
          { value: 3, label: "Divorced" },
          { value: 5, label: "Never married" },
        ],
        description: "Current marital status. Social engagement and marital status may influence cognitive health and disease progression."
      },
    },
  },

  familyHistory: {
    title: "Family History",
    fields: {
      NACCMOM: {
        label: "Mother had dementia",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        description: "Whether the patient's biological mother had dementia. Family history in first-degree relatives increases Alzheimer's risk 2-4 times."
      },
      NACCDAD: {
        label: "Father had dementia",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        description: "Whether the patient's biological father had dementia. Paternal history contributes significantly to genetic risk assessment."
      },
    },
  },

  medicalHistory: {
    title: "Medical History / Risk Factors",
    fields: {
      PARK: {
        label: "Parkinson's Disease",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        description: "History of Parkinson's disease. Parkinson's patients have increased risk of dementia and overlapping neurodegenerative pathology."
      },
      DEP: {
        label: "Depression",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        description: "History of depression. Late-life depression is both a risk factor and early symptom of Alzheimer's disease."
      },
      BRNINJ: {
        label: "Traumatic Brain Injury",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        description: "History of significant traumatic brain injury. TBI increases Alzheimer's risk, especially with loss of consciousness or repeated injuries."
      },
      NACCANGI: {
        label: "Stroke / Angioplasty",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        description: "History of stroke or cerebrovascular disease. Vascular factors contribute to mixed dementia and accelerate Alzheimer's progression."
      },
      NACCAPOE: {
        label: "APOE Genotype",
        type: "select",
        options: [
          { value: 1, label: "e3,e3" },
          { value: 2, label: "e3,e4" },
          { value: 3, label: "e3,e2" },
          { value: 4, label: "e4,e4" },
          { value: 5, label: "e4,e2" },
          { value: 6, label: "e2,e2" },
        ],
        description: "APOE ε4 allele status. APOE ε4 is the strongest genetic risk factor for late-onset Alzheimer's, with dose-dependent risk increase."
      },
    },
  },

  cognitiveTests: {
    title: "Cognitive / Neuropsychological Tests",
    fields: {
      ANIMALS: { 
        label: "Animals (60 seconds)", 
        type: "number", 
        range: "0-77", 
        unit: "count",
        description: "Verbal fluency test - number of different animals named in 60 seconds. Measures executive function and semantic memory. Lower scores indicate cognitive impairment."
      },
      VEG: { 
        label: "Vegetables (60 seconds)", 
        type: "number", 
        range: "0-77", 
        unit: "count",
        description: "Verbal fluency test - number of different vegetables named in 60 seconds. Assesses category fluency and cognitive flexibility. Complementary to animal naming."
      },
      TRAILA: { 
        label: "Trail Making Test A", 
        type: "number", 
        range: "0-150", 
        unit: "seconds",
        description: "Time to connect numbered circles in sequence. Tests visual attention and processing speed. Longer times suggest cognitive slowing."
      },
      TRAILB: { 
        label: "Trail Making Test B", 
        type: "number", 
        range: "0-300", 
        unit: "seconds",
        description: "Time to alternate between numbers and letters. Measures executive function and task-switching ability. Sensitive to early cognitive decline."
      },
      PERSCARE: {
        label: "Personal Care",
        type: "select",
        options: [
          { value: 0, label: "Independent" },
          { value: 1, label: "Needs some help" },
          { value: 2, label: "Dependent" },
        ],
        description: "Ability to perform personal care activities. Measures functional impairment in daily living activities, a key diagnostic criterion for dementia."
      },
    },
  },

  biomarkers: {
    title: "CSF Biomarkers",
    fields: {
      CSFABETA: { 
        label: "CSF Amyloid Beta", 
        type: "number", 
        range: "0-2000", 
        unit: "pg/mL",
        description: "Cerebrospinal fluid amyloid-beta 42 level. Decreased levels indicate amyloid plaque deposition in the brain, a core Alzheimer's pathology."
      },
      CSFTTAU: { 
        label: "CSF Total Tau", 
        type: "number", 
        range: "0-2000", 
        unit: "pg/mL",
        description: "Cerebrospinal fluid total tau protein level. Elevated levels reflect neuronal injury and degeneration across various dementia types."
      },
      CSFPTAU: { 
        label: "CSF Phosphorylated Tau", 
        type: "number", 
        range: "0-200", 
        unit: "pg/mL",
        description: "Cerebrospinal fluid phosphorylated tau level. Specific marker for Alzheimer's tau pathology and neurofibrillary tangles."
      },
    },
  },
}