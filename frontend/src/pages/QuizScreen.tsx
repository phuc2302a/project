import React, { useState } from 'react'
import { CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react'
import { useElderMode } from '../contexts/ElderModeContext'

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
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-700 p-6 text-white shadow-lg">
        <h1 className={`font-black tracking-tight ${isElderMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
          Kiểm tra Nhận diện Lừa đảo (Quiz An Toàn Số)
        </h1>
        <p className={`mt-2 text-cyan-100 ${isElderMode ? 'text-xl' : 'text-base'}`}>
          Thực hành phản xạ với 5 tình huống lừa đảo thực tế để kiểm tra mức độ cảnh giác của bạn.
        </p>
      </div>

      {!isFinished ? (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          {/* Thanh tiến trình */}
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <span className="font-bold text-gray-500 text-sm">
              Câu hỏi {currentStep + 1} / {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              Điểm hiện tại: {calculateScore()} / 100
            </span>
          </div>

          {/* Câu hỏi */}
          <h2 className={`font-black text-gray-900 leading-snug ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
            {currentQ.question}
          </h2>

          {/* Các lựa chọn */}
          <div className="mt-6 space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = currentSelected === idx
              const isCorrect = idx === currentQ.correctIndex
              const hasAnswered = currentSelected !== undefined

              let borderClass = 'border-gray-200 hover:border-blue-400 bg-white'
              if (hasAnswered) {
                if (isCorrect) {
                  borderClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                } else if (isSelected) {
                  borderClass = 'border-red-500 bg-red-50 text-red-950 font-bold'
                } else {
                  borderClass = 'border-gray-200 opacity-60'
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${borderClass} ${
                    isElderMode ? 'text-xl' : 'text-base'
                  }`}
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 font-bold text-sm flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>

                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Giải thích sau khi chọn */}
          {currentSelected !== undefined && (
            <div className={`mt-6 rounded-xl p-4 border animate-fade-in ${
              currentSelected === currentQ.correctIndex ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'
            }`}>
              <p className="font-bold text-gray-900">
                {currentSelected === currentQ.correctIndex ? ' Chính xác!' : ' Chưa chính xác!'}
              </p>
              <p className="text-gray-700 mt-1 text-sm">{currentQ.explanation}</p>
            </div>
          )}

          {/* Nút Tiếp tục */}
          <div className="mt-6 pt-4 border-t flex justify-end">
            <button
              disabled={currentSelected === undefined}
              onClick={handleNext}
              className="rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white hover:bg-blue-700 disabled:bg-gray-300 shadow"
            >
              {currentStep < QUIZ_QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}
            </button>
          </div>
        </div>
      ) : (
        /* MÀN HÌNH TỔNG KẾT & CẤP CHỨNG NHẬN */
        <div className="rounded-2xl border bg-white p-8 text-center shadow-lg animate-fade-in">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
            <Award className="h-12 w-12" />
          </div>

          <h2 className="text-3xl font-black text-gray-900">Kết quả Đánh giá An toàn số</h2>
          <p className="text-gray-500 mt-1">Đồng hành cùng Đề tài Lá Chắn Số Đồng Nai 2026</p>

          <div className="my-6 inline-block rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 border-2 border-blue-300 shadow-md">
            <div className="text-5xl font-black text-blue-700">{calculateScore()}/100</div>
            <p className="mt-2 text-lg font-bold text-blue-900">
              {calculateScore() >= 80
                ? ' HẠNG XUẤT SẮC: NGƯỜI DÙNG SỐ THÔNG THÁI'
                : calculateScore() >= 60
                ? ' HẠNG KHÁ: CẦN NÂNG CAO CẢNH GIÁC'
                : ' CẦN HỌC THÊM KỸ NĂNG NHẬN DIỆN LỪA ĐẢO'}
            </p>
            <p className="text-xs text-gray-600 mt-2 max-w-sm mx-auto">
              {calculateScore() >= 80
                ? 'Bạn có phản xạ rất tốt trước các thủ đoạn lừa đảo tinh vi. Hãy chia sẻ kiến thức này cho người thân và bạn bè nhé!'
                : 'Bạn vẫn có nguy cơ mắc bẫy trước các kịch bản thao túng tâm lý khẩn cấp. Hãy đọc thêm các bài học 01 phút để nâng cao kỹ năng!'}
            </p>
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 shadow"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Làm lại bài kiểm tra</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
