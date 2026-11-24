import React, { useState } from 'react'
import { CheckCircle2, XCircle, Award, RotateCcw, CheckSquare, Shield, ArrowRight } from 'lucide-react'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-blue-900/40 mb-8">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 px-3 py-1 text-xs font-mono font-semibold text-blue-300 border border-blue-800 mb-4">
            <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>PHÒNG HUẤN LUYỆN PHẢN XẠ AN TOÀN SỐ</span>
          </div>
          <h1 className={`font-black tracking-tight text-white ${isElderMode ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'}`}>
            Đấu trường Nhận diện Lừa đảo
          </h1>
          <p className={`mt-2 text-slate-300 max-w-2xl leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
            Trực tiếp giải quyết 5 tình huống thực tế mô phỏng các cuộc gọi và tin nhắn lừa đảo để rèn luyện phản xạ không bao giờ mắc bẫy.
          </p>
        </div>
      </div>

      {!isFinished ? (
        <Card className="border-2 border-slate-300 shadow-xl bg-white rounded-3xl overflow-hidden">
          {/* Progress Banner */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black bg-blue-600 text-white px-2.5 py-1 rounded-lg">
                CÂU HỎI {currentStep + 1} / {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                TÌNH HUỐNG THỰC TẾ
              </span>
            </div>

            <div className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-lg">
              ĐIỂM TÍCH LŨY: {calculateScore()} / 100
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Question Text */}
            <h2 className={`font-black text-slate-950 leading-snug ${isElderMode ? 'text-3xl' : 'text-xl sm:text-2xl'}`}>
              {currentQ.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = currentSelected === idx
                const isCorrect = idx === currentQ.correctIndex
                const hasAnswered = currentSelected !== undefined

                let borderStyle = 'border-2 border-slate-200 hover:border-slate-950 bg-slate-50/50 hover:bg-white text-slate-900'
                if (hasAnswered) {
                  if (isCorrect) {
                    borderStyle = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  } else if (isSelected) {
                    borderStyle = 'border-2 border-rose-500 bg-rose-50 text-rose-950 font-bold shadow-xs'
                  } else {
                    borderStyle = 'border border-slate-200 opacity-40'
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-5 rounded-2xl transition-all flex items-start gap-4 ${borderStyle} ${
                      isElderMode ? 'text-2xl min-h-[4.5rem]' : 'text-base'
                    }`}
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 font-mono font-black text-sm text-slate-800 flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 font-semibold leading-relaxed">{option}</span>

                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Forensic Explanation */}
            {currentSelected !== undefined && (
              <div className={`rounded-2xl p-5 border-2 animate-in fade-in duration-200 ${
                currentSelected === currentQ.correctIndex
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-center gap-2 font-mono font-black text-xs uppercase tracking-wider mb-1">
                  <Shield className="w-4 h-4" />
                  <span>{currentSelected === currentQ.correctIndex ? '✓ PHẢN XẠ CHUẨN XÁC' : '✕ CẢNH BÁO: BẪY TÂM LÝ'}</span>
                </div>
                <p className="text-sm sm:text-base font-semibold leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Action */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <Button
                type="button"
                disabled={currentSelected === undefined}
                onClick={handleNext}
                className="font-black px-8 py-3 h-auto rounded-xl gap-2 text-base shadow-md"
              >
                <span>{currentStep < QUIZ_QUESTIONS.length - 1 ? 'TÌNH HUỐNG TIẾP THEO' : 'XEM KẾT QUẢ ĐÁNH GIÁ'}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Certificate View */
        <Card className="border-2 border-slate-300 bg-white shadow-2xl rounded-3xl overflow-hidden text-center">
          <div className="bg-slate-950 text-white p-8 space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400 text-slate-950 shadow-lg">
              <Award className="h-12 w-12" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black">CHỨNG CHỈ CÔNG DÂN SỐ AN TOÀN</h2>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              HỘI THI AN TOÀN THÔNG TIN TỈNH ĐỒNG NAI 2026
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            <div className="inline-block rounded-3xl bg-slate-50 border-2 border-slate-200 p-8 shadow-inner max-w-md w-full">
              <div className="text-6xl font-mono font-black text-slate-950">
                {calculateScore()}<span className="text-2xl text-slate-400">/100</span>
              </div>
              <div className="mt-3">
                <span className={`inline-block px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-wider ${
                  calculateScore() >= 80
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : calculateScore() >= 60
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}>
                  {calculateScore() >= 80
                    ? 'HẠNG XUẤT SẮC: MIỄN NHIỄM LỪA ĐẢO SỐ'
                    : calculateScore() >= 60
                    ? 'HẠNG KHÁ: CẦN THẬN TRỌNG TRƯỚC SỰ KHẨN CẤP'
                    : 'HẠNG CẦN BẢO VỆ: DỄ BỊ THAO TÚNG TÂM LÝ'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium">
                {calculateScore() >= 80
                  ? 'Chúc mừng bạn đã hoàn thành xuất sắc bài kiểm tra nhận diện. Hãy chia sẻ ứng dụng Lá Chắn Số để bảo vệ người thân và bạn bè nhé!'
                  : 'Hãy thường xuyên ôn lại 10 bài học 01 phút để luôn giữ sự bình tĩnh và nhận biết ngay các chiêu trò giả danh công an, quà tri ân!'}
              </p>
            </div>

            <div>
              <Button
                type="button"
                onClick={handleRestart}
                variant="outline"
                className="gap-2 font-black px-6 py-3 h-auto rounded-xl border-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>THỰC HÀNH LẠI BÀI THI</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
