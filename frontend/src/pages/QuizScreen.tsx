import React, { useState } from 'react'
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, Sparkles, MessageSquare } from 'lucide-react'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

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
    mockSender: 'Cuộc gọi tự xưng: Cán bộ Điều tra Công an Đồng Nai',
    question: 'Người gọi thông báo bạn liên quan đến đường dây rửa tiền xuyên quốc gia và yêu cầu chuyển 50 triệu đồng vào số tài khoản "Tạm giữ giám định" để chứng minh sự trong sạch. Bạn nên làm gì?',
    options: [
      'Chuyển ngay tiền để chứng minh mình không phạm tội',
      'Cúp máy ngay lập tức, không chuyển tiền và đến trực tiếp Công an phường xác minh',
      'Cung cấp mã OTP và thông tin tài khoản ngân hàng để họ kiểm tra'
    ],
    correctIndex: 1,
    explanation: 'Cơ quan Công an KHÔNG BAO GIỜ làm việc qua điện thoại hay yêu cầu người dân chuyển tiền vào tài khoản cá nhân để "giám định". Đây là 100% lừa đảo.'
  },
  {
    id: 2,
    scenarioType: 'Bẫy tuyển dụng học sinh - sinh viên',
    mockSender: 'Tin nhắn Telegram / Facebook: Tuyển CTV Shopee',
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
    mockSender: 'Cuộc gọi tự xưng: Bác sĩ Bệnh viện Đa khoa Đồng Nai',
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
    if (selectedAnswer !== null) return // Đã chọn rồi thì không đổi
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-2xs">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          <span>Thử Thách Nhận Diện Chiêu Trò Lừa Đảo</span>
        </div>
        <h1 className={`font-black tracking-tight text-slate-950 ${isElderMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
          Kiểm Tra Kỹ Năng Cảnh Giác Số
        </h1>
        <p className={`text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
          5 tình huống mô phỏng thực tế giúp bạn và gia đình không bao giờ trở thành nạn nhân của tội phạm lừa đảo trực tuyến.
        </p>
      </div>

      {!isFinished ? (
        <Card className="border border-slate-200 shadow-md bg-white rounded-3xl overflow-hidden">
          {/* Progress Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              TÌNH HUỐNG SỐ {currentStep + 1} / {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex gap-1.5">
              {QUIZ_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentStep
                      ? 'w-8 bg-blue-600'
                      : idx < currentStep
                      ? 'w-2.5 bg-emerald-500'
                      : 'w-2.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Simulated Chat Scenario */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                <span>{currentQuestion.scenarioType}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 font-mono font-medium">
                {currentQuestion.mockSender}
              </div>
              <p className={`font-bold text-slate-900 leading-relaxed ${isElderMode ? 'text-2xl' : 'text-base sm:text-lg'}`}>
                {currentQuestion.question}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx
                const isCorrect = idx === currentQuestion.correctIndex
                let optionStyle = 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'

                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-200'
                  } else if (isSelected) {
                    optionStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-200'
                  } else {
                    optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60'
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 shadow-2xs ${optionStyle} ${
                      isElderMode ? 'text-xl' : 'text-sm sm:text-base'
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {selectedAnswer !== null && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {selectedAnswer !== null && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation card after answering */}
            {selectedAnswer !== null && (
              <div
                className={`p-5 rounded-2xl border animate-in fade-in duration-200 space-y-2 ${
                  selectedAnswer === currentQuestion.correctIndex
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-300 text-rose-950'
                }`}
              >
                <div className="font-black text-sm flex items-center gap-2">
                  {selectedAnswer === currentQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>CHÍNH XÁC! BẠN RẤT CẢNH GIÁC</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>CẢNH BÁO: ĐÂY LÀ BẪY LỪA ĐẢO NGUY HIỂM</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {selectedAnswer !== null && (
              <Button
                type="button"
                onClick={handleNext}
                className="w-full font-bold py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs gap-2 text-base"
              >
                <span>{currentStep < QUIZ_QUESTIONS.length - 1 ? 'Tình huống tiếp theo' : 'Xem kết quả chung cuộc'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        /* ============= KẾT QUẢ VÀ CHỨNG NHẬN ============= */
        <Card className="border border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-8 text-center space-y-3">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md text-amber-300 border border-white/20 shadow-lg">
              <Award className="h-12 w-12" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">HOÀN THÀNH THỬ THÁCH NHẬN DIỆN</h2>
            <p className="text-blue-100 text-sm max-w-md mx-auto">
              Bạn đã hoàn thành 5/5 câu hỏi rèn luyện kỹ năng an toàn số phòng chống lừa đảo.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Score Card */}
            <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                KẾT QUẢ CỦA BẠN:
              </span>
              <div className="text-5xl font-mono font-black text-blue-700">
                {correctCount} / {QUIZ_QUESTIONS.length}
              </div>
              <p className="font-bold text-slate-800 text-base sm:text-lg">
                {correctCount === 5
                  ? 'Xuất sắc! Bạn có kỹ năng cảnh giác cực kỳ vững vàng.'
                  : correctCount >= 3
                  ? 'Khá tốt! Bạn đã nắm được phần lớn các chiêu trò lừa đảo phổ biến.'
                  : 'Cần cẩn trọng! Hãy đọc kỹ cẩm nang 01 phút để tránh sập bẫy lừa đảo.'}
              </p>
            </div>

            {/* Digital Certificate Box */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border-2 border-amber-300 text-amber-950 space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>CHỨNG NHẬN ĐỒNG NAI AN TOÀN SỐ 2026</span>
              </div>
              <p className="font-black text-xl text-slate-900">
                Công dân số có ý thức phòng chống tội phạm công nghệ cao
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Được cấp bởi nền tảng Lá Chắn Số — Đồng Nai 2026 vì đã hoàn thành khóa rèn luyện phản xạ phòng chống lừa đảo trực tuyến.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                onClick={handleRestart}
                className="flex-1 font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thực hiện lại bài kiểm tra</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
