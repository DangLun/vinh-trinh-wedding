import type { StoryMilestone } from "@/types/wedding";

/**
 * DỮ LIỆU MẪU để thử giao diện "Chuyện tình mình": độ dài khác nhau, có mốc không ảnh.
 * Nội dung bịa, ảnh lấy từ album mẫu. Thay bằng chuyện thật rồi xoá file này
 * (bỏ import trong src/config/wedding.ts).
 */
export const sampleStory: StoryMilestone[] = [
  {
    date: "03.2020",
    title: "Lần đầu gặp nhau",
    text: "Một buổi chiều cuối tuần ở quán cà phê ven sông, Vinh ngồi bàn bên cạnh và mượn Trinh cục sạc dự phòng. Trả sạc xong thì xin luôn Zalo. Trinh bảo hôm đó chỉ định đi uống một ly rồi về, ai ngờ ngồi tới lúc quán dọn bàn.",
    image: {
      src: "/images/gallery/sample/01.webp",
      alt: "Hai người ngồi ngắm hoàng hôn",
    },
  },
  {
    date: "02.2021",
    title: "Cái Tết đầu tiên",
    text: "Lần đầu Vinh về quê Trinh ăn Tết, bị cả xóm hỏi \"bồ con Trinh hả?\". Ngồi gói bánh tét tới khuya, gói cái nào bung cái đó.",
  },
  {
    date: "08.2022",
    title: "Chính thức hẹn hò",
    text: "Sau hơn hai năm làm \"bạn thân\", trong chuyến đi Đà Lạt bằng chiếc xe van thuê, Vinh lấy hết can đảm nói câu mà ai cũng đoán trước. Trinh không trả lời, chỉ đưa cho Vinh nửa ổ bánh mì đang ăn dở. Tới giờ hai đứa vẫn cãi nhau xem như vậy là đồng ý hay chưa.",
    image: {
      src: "/images/gallery/sample/12.webp",
      alt: "Chuyến đi bằng xe van",
    },
  },
  {
    date: "2023",
    title: "Yêu xa",
    text: "Vinh nhận việc ở Sài Gòn, Trinh ở lại Cần Thơ. Một năm với hơn ba trăm cuộc gọi video, vô số chuyến xe đêm cuối tuần và một quy tắc bất di bất dịch: giận thì giận, nhưng phải chúc ngủ ngon trước 12 giờ. Có những tối mạng chập chờn, hai đứa chỉ nhìn màn hình đứng hình của nhau mà vẫn cười. Có những sáng thứ Hai ra bến xe chia tay mà như chia tay cả tuần. Nhưng chính một năm đó dạy cho hai đứa biết kiên nhẫn, biết tin nhau, và biết rằng khoảng cách chỉ là con số khi cả hai cùng muốn về một nhà.",
    image: {
      src: "/images/gallery/sample/15.webp",
      alt: "Đứng nhìn hồ núi",
    },
  },
  {
    date: "Tết 2025",
    title: "Ra mắt hai bên gia đình",
    text: "Ba mẹ hai bên gặp nhau lần đầu trong một bữa cơm. Run nhất là Vinh, nói nhiều nhất là ba Trinh.",
  },
  {
    date: "14.02.2026",
    title: "Cầu hôn",
    text: "Đúng ngày Valentine, trên cầu tàu nhỏ lúc hoàng hôn, Vinh quỳ xuống và nói được đúng nửa câu thì quên lời. Trinh gật đầu trước khi Vinh kịp nhớ ra nửa còn lại.",
    image: {
      src: "/images/gallery/sample/08.webp",
      alt: "Cầu tàu bên biển",
    },
  },
];
