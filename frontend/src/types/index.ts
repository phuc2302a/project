export type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS'
export type TargetType = 'phone' | 'link' | 'bank_account'

export interface ExtractedEntities {
  phones: string[]
  bank_accounts: string[]
  urls: string[]
}

export interface ScamAnalysisResult {
  risk_score: number
  risk_level: RiskLevel
  tactics: string[]
  dangerous_phrases: string[]
  reasoning: string
  recommended_action: string
  extracted_entities: ExtractedEntities
}

export interface LookupResponse {
  target: string
  target_type: TargetType
  risk_level: RiskLevel
  title: string
  reason: string
  reports_count: number
  recommended_action: string
}

export interface ReportCreatePayload {
  tactic_type: string
  target: string
  target_type: TargetType
  description: string
  evidence_image_url?: string
  is_police_reported: boolean
}

export interface ReportResponse {
  id: string
  target: string
  target_type: TargetType
  tactic_type: string
  description: string
  risk_level: string
  reported_at: string
  is_police_reported: boolean
  police_case_code?: string | null
}

export interface ScenarioItem {
  id: number
  title: string
  target_audience: 'elderly' | 'student' | 'general'
  category: string
  summary: string
  key_warning: string
  action_guide: string
  duration_minutes: number
}

export interface VolunteerStats {
  total_reports_month: number
  fake_links_percentage: number
  phone_scams_percentage: number
  bank_scams_percentage: number
  summary_by_category: {
    fake_link: number
    impersonation_police: number
    fake_job_ctv: number
    emergency_accident: number
  }
  recent_reports: ReportResponse[]
}

export interface ContactPerson {
  name: string
  phone: string
  relationship: string
}
