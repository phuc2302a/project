import React, { useState } from 'react'
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, MessageSquare } from 'lucide-react'
import { useElderMode } from '../contexts/ElderModeContext'

interface Question {
  id: number
  scenarioType: string
  mockSender: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    scenarioType: 'Mạo danh Cơ quan Điều tra',
    mockSender: 'Cuộc gọi: Cán bộ Điều tra Công an Đồng Nai',
    question: 'Người gọi thông báo bạn liên quan đường dây rửa tiền xuyên quốc gia và yêu cầu chuyển 50 triệu vào số tài khoản "Tạm giữ giám định" để chứng minh sự trong sạch. Bạn nên làm gì?',
    options: [
      'Chuyển tiền ngay để chứng minh mình không phạm tội',
      'Cúp máy ngay lập tức, không chuyển tiền và đến trực tiếp Công an phường xác minh',
      'Cung cấp mã OTP và thông tin thẻ ngân hàng để họ kiểm tra'
    ],
    correctIndex: 1,
    explanation: 'Cơ quan Công an KHÔNG BAO GIỜ làm việc qua điện thoại hay yêu cầu người dân chuyển tiền vào tài khoản cá nhân để "giám định". Đây là 100% lừa đảo.'
  },
  {
    id: 2,
    scenarioType: 'Bẫy việc làm học sinh - sinh viên',
    mockSender: 'Tin nhắn: Tuyển CTV Shopee online',
    question: 'Một lời mời tham gia làm cộng tác viên trực tuyến, hoa hồng 25% mỗi đơn hàng, nhưng yêu cầu bạn nạp trước 500.000đ tiền vốn vào tài khoản cá nhân để kích hoạt đơn. Bạn nên:',
    options: [
      'Nạp tiền ngay để tranh thủ kiếm tiền tiêu vặt sau giờ học',
      'Từ chối ngay và chặn liên hệ, đây là bẫy "việc nhẹ lương cao" chiếm đoạt tiền',
      'Rủ thêm bạn bè cùng nạp tiền để được chiết khấu cao hơn'
    ],
    correctIndex: 1,
    explanation: 'Các sàn TMĐT chính thống không bao giờ tuyển cộng tác viên nạp tiền trước để hưởng hoa hồng. Ban đầu kẻ xấu có thể hoàn lại 50.000đ để tạo lòng tin, sau đó chiếm đoạt toàn bộ số tiền lớn.'
  },
  {
    id: 3,
    scenarioType: 'SMS Brandname giả mạo Ngân hàng',
    mockSender: 'SMS gửi từ: Vietcombank',
    question: 'Tin nhắn gửi đến điện thoại báo: "Tài khoản vừa bị trừ 3.200.000đ. Nếu không phải bạn thực hiện, vui lòng truy cập vietcombbank-smartbanking.top để hủy giao dịch". Bạn xử lý thế nào?',
    options: [
      'Bấm ngay vào link và đăng nhập tài khoản, mật khẩu để kịp hủy giao dịch',
      'Tuyệt đối không bấm vào link lạ. Mở trực tiếp App ngân hàng chính thức để kiểm tra số dư',
      'Chia sẻ link lên nhóm chat để hỏi xem có ai bị tương tự không'
    ],
    correctIndex: 1,
    explanation: 'Kẻ xấu sử dụng trạm phát sóng di động giả mạo (Fake BTS) để mạo danh tên ngân hàng. Đường link có tên miền lạ ".top" nhằm đánh cắp thông tin đăng nhập và mã OTP của bạn.'
  },
  {
    id: 4,
    scenarioType: 'Bẫy khẩn cấp: Con cấp cứu tai nạn',
    mockSender: 'Cuộc gọi: Bác sĩ Bệnh viện Đa khoa Đồng Nai',
    question: 'Người gọi báo tin con bạn bị tai nạn giao thông nghiêm trọng đang nguy kịch, yêu cầu chuyển gấp 30 triệu đồng viện phí để kịp thời lên bàn mổ. Bạn nên:',
    options: [
      'Hoảng loạn chuyển tiền ngay vì lo cho tính mạng của con',
      'Bình tĩnh giữ tiền, gọi ngay cho con, giáo viên chủ nhiệm hoặc gọi hotline bệnh viện để kiểm chứng',
      'Vay mượn thêm tiền để gửi cho bác sĩ qua tài khoản cá nhân'
    ],
    correctIndex: 1,
    explanation: 'Kẻ lừa đảo khai thác triệt để tâm lý lo lắng cho con cái để ép nạn nhân chuyển tiền khẩn cấp. Các bệnh viện luôn ưu tiên cứu chữa người bệnh cấp cứu trước khi thu viện phí.'
  },
  {
    id: 5,
    scenarioType: 'Chiếm quyền điều khiển điện thoại (Mã độc APK)',
    mockSender: 'Cổng Dịch vụ công giả mạo',
    question: 'Một người tự xưng là cán bộ phường yêu cầu bạn tải file ".APK" cài vào điện thoại để "cập nhật định danh mức 2" và bảo bạn bật quyền Trợ năng (Accessibility). Bạn nên:',
    options: [
      'Làm theo ngay để hoàn thành thủ tục định danh công dân',
      'Tuyệt đối không tải file APK từ web lạ. Đến trực tiếp Công an phường làm thủ tục',
      'Nhờ người thân cài hộ trên điện thoại của họ'
    ],
    correctIndex: 1,
    explanation: 'File APK giả mạo chứa mã độc gián điệp (Trojan). Khi được cấp quyền Trợ năng, mã độc sẽ tự động đọc màn hình, đánh cắp mật khẩu và mã OTP ngân hàng mà bạn không hề hay biết.'
  }
]

export const QuizScreen: React.FC = () => {
  const { isElderMode } = useElderMode()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = QUIZ_QUESTIONS[currentStep]

  const handleSelectOption = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setSelectedAnswer(null)
    setAnswers([])
    setIsFinished(false)
  }

  const correctCount = answers.reduce((acc, ans, idx) => {
    return ans === QUIZ_QUESTIONS[idx].correctIndex ? acc + 1 : acc
  }, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 pt-16 sm:pt-20 pb-12 sm:px-6">
      {/* Eyebrow Kicker */}
      <div className="text-center mb-4">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          THỬ THÁCH NHẬN DIỆN CHIÊU TRÒ • KIỂM TRA PHẢN XẠ SỐ
        </span>
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1
          className={`font-black tracking-tight text-white ${
            isElderMode ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-5xl'
          }`}
          style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          Kiểm tra kỹ năng{' '}
          <span className="bg-gradient-to-r from-violet-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
            cảnh giác số
          </span>{' '}
          của bạn.
        </h1>
        <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
          5 tình huống mô phỏng thực tế giúp bạn và gia đình không bao giờ trở thành nạn nhân của tội phạm công nghệ cao.
        </p>
      </div>

      {!isFinished ? (
        <div className="bg-[#0d0d10] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/80 pb-4">
            <span className="font-mono">TÌNH HUỐNG SỐ {currentStep + 1} / {QUIZ_QUESTIONS.length}</span>
            <div className="flex gap-1.5">
              {QUIZ_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStep
                      ? 'w-6 bg-white'
                      : idx < currentStep
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-neutral-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Simulated Chat Scenario */}
          <div className="bg-[#141418] border border-neutral-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{currentQuestion.scenarioType}</span>
            </div>
            <div className="text-xs text-neutral-500 font-mono">
              {currentQuestion.mockSender}
            </div>
            <p className="font-bold text-white text-base sm:text-lg leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx
              const isCorrect = idx === currentQuestion.correctIndex
              let btnStyle = 'bg-[#141418] border-neutral-800/80 text-neutral-300 hover:border-neutral-600'

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-600 text-white font-semibold'
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/60 border-rose-600 text-white font-semibold'
                } else {
                  btnStyle = 'bg-[#141418] border-neutral-900 text-neutral-600'
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="font-mono text-xs font-bold text-neutral-500 mt-0.5">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {selectedAnswer !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {selectedAnswer !== null && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {selectedAnswer !== null && (
            <div
              className={`p-4 rounded-xl text-xs sm:text-sm space-y-1.5 border animate-in fade-in duration-200 ${
                selectedAnswer === currentQuestion.correctIndex
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-800 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {selectedAnswer === currentQuestion.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>CHÍNH XÁC! BẠN RẤT CẢNH GIÁC</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>CẢNH BÁO: ĐÂY LÀ BẪY LỪA ĐẢO NGUY HIỂM</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed text-xs">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {selectedAnswer !== null && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{currentStep < QUIZ_QUESTIONS.length - 1 ? 'Tình huống tiếp theo' : 'Xem chứng nhận kết quả'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Certificate matching AgentVet.ai card */
        <div className="max-w-2xl mx-auto bg-[#0d0d10] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-4">
            <span>Chứng nhận hoàn thành thử thách số</span>
            <span className="font-mono text-neutral-400">DN-QUIZ-2026</span>
          </div>

          <div className="space-y-4">
            <div className="font-mono font-black text-6xl text-white">
              {correctCount} / {QUIZ_QUESTIONS.length}
            </div>

            <div className="font-bold text-xl text-white">
              {correctCount === 5
                ? 'Công dân số xuất sắc — Phòng chống lừa đảo'
                : correctCount >= 3
                ? 'Kỹ năng số đạt chuẩn an toàn'
                : 'Cần nâng cao cảnh giác với các chiêu trò lừa đảo'}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Bạn đã hoàn thành 5 tình huống phản xạ số nhận diện các bẫy tâm lý mạo danh công an, việc nhẹ lương cao và link ngân hàng độc hại tại Đồng Nai.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thực hiện lại bài kiểm tra</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
