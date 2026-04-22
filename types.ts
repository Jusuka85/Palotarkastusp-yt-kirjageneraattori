
export interface Observation {
  id: string;
  topic: string; 
  category: string;
  subCategory: string;
  status: 'unchecked' | 'ok' | 'deficiency' | 'recommendation';
  description: string;
  correctionAction?: string;
  recommendationAction?: string;
}

export interface FireInspectionReport {
  id: string;
  target: string;
  address: string;
  businessId: string;
  description: string;
  inspectionDate: string;
  inspector: string[];
  representative: string[];
  inspectionProcess: string;
  observations: Observation[];
  correctionOrders: string[];
  recommendations: string[];
  hearing: string;
  appendices: string;
}
