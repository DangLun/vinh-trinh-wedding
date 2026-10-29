import type { MetadataRoute } from "next";

// Link mời riêng và trang quản lý không cho máy tìm kiếm lập chỉ mục
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/m/", "/quan-ly"] },
  };
}
