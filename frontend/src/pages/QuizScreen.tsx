import React, { useState } from 'react'
import { CheckCircle2, XCircle, Award, RotateCcw, CheckSquare } from 'lucide-react'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Bạn nhận được cuộc gọi tự xưng là cán bộ Công an tỉnh Đồng Nai thông báo bạn liên quan đường dây rửa tiền và yêu cầu chuyển tiền vào tài khoản để phục vụ giám định. Bạn nên làm gì?',
    options: [
      'Chuyển ngay tiền để chứng minh mình trong sạch',
      'Cúp máy ngay, không chuyển tiền và báo cho người thân hoặc đến Công an phường xác minh',
      'Cung cấp thông tin thẻ ngân hàng và mã OTP để công an kiểm tra từ xa'
    ],
    correctIndex: 1,
    explanation: 'Cơ quan Công an KHÔNG BAO GIỜ làm việc qua điện thoại hay yêu cầu người dân chuyển tiền vào tài khoản cá nhân để điều tra.'
  },
  {
    id: 2,
    question: 'Một tin nhắn trên Facebook mời bạn tham gia cộng tác viên Shopee làm việc tại nhà, hoa hồng 20-30%, nhưng yêu cầu nạp trước 500.000đ để nhận đơn hàng. Đây là gì?',
    options: [
      'Cơ hội việc làm thêm uy tín, nên rủ bạn bè cùng làm',
      'Chiêu trò lừa đảo "việc nhẹ lương cao", nạp tiền nhỏ thì trả, tiền lớn sẽ bị chiếm đoạt',
      'Chính sách tuyển dụng chính thức của sàn thương mại điện tử'
    ],
    correctIndex: 1,
    explanation: 'Các sàn TMĐT chính thống không tuyển cộng tác viên nạp tiền trước để hưởng hoa hồng. Đây là bẫy lừa đảo phổ biến nhắm vào học sinh, sinh viên.'
  },
  {
    id: 3,
    question: 'Tin nhắn SMS từ tên người gửi mang tên ngân hàng thông báo tài khoản bị trừ 2.500.000đ và đính kèm đường link "vietcombbank-smartbanking.top" để hủy giao dịch. Bạn nên:',
    options: [
      'Bấm ngay vào link và nhập tài khoản, mật khẩu để hủy',
      'Tuyệt đối không bấm vào link, mở trực tiếp App ngân hàng chính thức để kiểm tra biến động số dư',
      'Chuyển tiếp link cho bạn bè nhờ bấm hộ'
    ],
    correctIndex: 1,
    explanation: 'Kẻ xấu dùng trạm BTS giả mạo để gửi SMS Brandname giả. Ngân hàng không bao giờ gửi link yêu cầu đăng nhập qua tin nhắn SMS.'
  },
  {
    id: 4,
    question: 'Một người gọi điện tự xưng là bác sĩ bệnh viện báo con bạn đang bị tai nạn giao thông nguy kịch, cần chuyển gấp 30 triệu viện phí để mổ ngay. Bạn nên xử lý thế nào?',
    options: [
      'Vội vã chuyển tiền ngay vì sợ nguy hiểm đến tính mạng con',
      'Bình tĩnh, không chuyển tiền ngay. Gọi điện trực tiếp cho con, người thân hoặc nhà trường để kiểm chứng',
      'Đăng bài lên mạng xã hội xin cứu trợ'
    ],
    correctIndex: 1,
    explanation: 'Kẻ lừa đảo đánh vào tâm lý hoảng loạn và tạo sự khẩn cấp. Luôn luôn kiểm chứng qua các kênh liên lạc độc lập trước khi thực hiện chuyển tiền.'
  },
  {
    id: 5,
    question: 'Để bảo vệ điện thoại cá nhân không bị chiếm quyền điều khiển tài khoản ngân hàng, bạn cần làm gì?',
    options: [
      'Chỉ cài đặt ứng dụng từ Google Play hoặc App Store, không tải file .APK lạ trên web',
      'Cấp quyền Trợ năng (Accessibility) cho mọi ứng dụng khi được yêu cầu',
      'Ghi mật khẩu ngân hàng và mã OTP vào ghi chú công khai'
    ],
    correctIndex: 0,
    explanation: 'Các mã độc thường giả mạo app dịch vụ công qua file .APK và lừa cấp quyền Trợ năng để đọc lén màn hình và mã OTP của bạn.'
  }
]

export const QuizScreen: React.FC = () => {
  const { isElderMode } = useElderMode()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const handleSelectOption = (index: number) => {
    if (selectedAnswers[currentStep] !== undefined) return
    const updated = [...selectedAnswers]
    updated[currentStep] = index
    setSelectedAnswers(updated)
  }

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setSelectedAnswers([])
    setIsFinished(false)
  }

  const calculateScore = () => {
    let score = 0
    selectedAnswers.forEach((ans, idx) => {
      if (ans === QUIZ_QUESTIONS[idx].correctIndex) score += 20
    })
    return score
  }

  const currentQ = QUIZ_QUESTIONS[currentStep]
  const currentSelected = selectedAnswers[currentStep]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <Badge variant="secondary" className="mb-2 font-bold gap-1">
          <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
          ĐÁNH GIÁ MỨC ĐỘ CẢNH GIÁC
        </Badge>
        <h1 className={`font-black tracking-tight text-slate-950 ${isElderMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
          Trắc nghiệm Kỹ năng Nhận diện
        </h1>
        <p className={`mt-1.5 text-slate-600 ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
          5 tình huống mô phỏng thực tế đời sống để kiểm tra phản xạ phòng vệ số của bạn.
        </p>
      </div>

      {!isFinished ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                Câu hỏi {currentStep + 1} / {QUIZ_QUESTIONS.length}
              </span>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                Điểm: {calculateScore()} / 100
              </span>
            </div>

            {/* Question */}
            <h2 className={`font-black text-slate-900 leading-snug ${isElderMode ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="mt-6 space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = currentSelected === idx
                const isCorrect = idx === currentQ.correctIndex
                const hasAnswered = currentSelected !== undefined

                let borderStyle = 'border-slate-200 hover:border-slate-400 bg-white'
                if (hasAnswered) {
                  if (isCorrect) {
                    borderStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                  } else if (isSelected) {
                    borderStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-semibold'
                  } else {
                    borderStyle = 'border-slate-100 opacity-50'
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 shadow-2xs ${borderStyle} ${
                      isElderMode ? 'text-xl' : 'text-sm'
                    }`}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 font-mono font-bold text-xs text-slate-700 flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>

                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {currentSelected !== undefined && (
              <div className={`mt-6 rounded-xl p-4 border animate-in fade-in duration-200 ${
                currentSelected === currentQ.correctIndex ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50/70 border-amber-300'
              }`}>
                <p className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  {currentSelected === currentQ.correctIndex ? '✓ Phản xạ chính xác!' : '✕ Chưa chính xác!'}
                </p>
                <p className="text-slate-700 mt-1 text-xs sm:text-sm leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <Button
                type="button"
                disabled={currentSelected === undefined}
                onClick={handleNext}
                className="font-bold"
              >
                {currentStep < QUIZ_QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Certificate Screen */
        <Card className="border-slate-200 shadow-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <Award className="h-9 w-9" />
            </div>

            <h2 className="text-2xl font-black text-slate-900">Kết quả Đánh giá Kỹ năng Số</h2>
            <p className="text-xs text-slate-500">Chương trình An toàn số cộng đồng tỉnh Đồng Nai 2026</p>

            <div className="my-6 inline-block rounded-2xl bg-slate-900 text-white p-6 shadow-md max-w-sm">
              <div className="text-5xl font-mono font-black text-emerald-400">{calculateScore()}<span className="text-2xl text-slate-400">/100</span></div>
              <p className="mt-2 text-sm font-bold tracking-wide uppercase text-slate-200">
                {calculateScore() >= 80
                  ? 'Hạng Xuất Sắc: Công Dân Số Thông Thái'
                  : calculateScore() >= 60
                  ? 'Hạng Khá: Cần Nâng Cao Cảnh Giác'
                  : 'Cần Học Thêm Kỹ Năng Nhận Diện'}
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {calculateScore() >= 80
                  ? 'Bạn có phản xạ rất tốt trước các thủ đoạn lừa đảo tinh vi. Hãy chia sẻ kiến thức này cho người thân và bạn bè nhé!'
                  : 'Bạn vẫn có nguy cơ mắc bẫy trước các kịch bản thao túng tâm lý khẩn cấp. Hãy xem thêm các bài học 01 phút để nâng cao kỹ năng!'}
              </p>
            </div>

            <div>
              <Button
                type="button"
                onClick={handleRestart}
                variant="outline"
                className="gap-2 font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại bài kiểm tra</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
