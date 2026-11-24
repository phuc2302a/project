import type {
  LookupResponse,
  ScamAnalysisResult,
  ReportCreatePayload,
  ReportResponse,
  ScenarioItem,
  VolunteerStats
} from '../types'

const API_BASE = '/api/v1'

export const api = {
  // 1. Phân tích tin nhắn
  async analyzeMessage(message: string): Promise<ScamAnalysisResult> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    if (!res.ok) throw new Error('Không thể phân tích tin nhắn')
    return res.json()
  },

  // 2. Tra cứu nhanh SĐT, Link, STK
  async lookupTarget(query: string): Promise<LookupResponse> {
    const res = await fetch(`${API_BASE}/lookup?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('Không thể kiểm tra thông tin')
    return res.json()
  },

  // 3. Gửi báo cáo lừa đảo
  async submitReport(payload: ReportCreatePayload): Promise<ReportResponse> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Không thể gửi báo cáo')
    return res.json()
  },

  // 4. Lấy danh sách bài học 01 phút
  async getScenarios(audience?: string): Promise<ScenarioItem[]> {
    const url = audience ? `${API_BASE}/scenarios?audience=${audience}` : `${API_BASE}/scenarios`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Không thể tải bài học')
    return res.json()
  },

  // 5. Lấy thống kê cho Đội tình nguyện
  async getVolunteerStats(): Promise<VolunteerStats> {
    const res = await fetch(`${API_BASE}/stats`)
    if (!res.ok) throw new Error('Không thể tải dữ liệu thống kê')
    return res.json()
  }
}
