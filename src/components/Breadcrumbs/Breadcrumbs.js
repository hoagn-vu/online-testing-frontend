import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

// Map đường dẫn thành tên hiển thị
const breadcrumbMap = {
  staff: "Nhân viên",
  dashboard: "Trang chủ",
  organize: "Quản lý kỳ thi",
  accountmanage: "Quản lý tài khoản",
  question: "Ngân hàng câu hỏi",
  "matrix-exam": "Quản lý ma trận đề",
  exam: "Quản lý đề thi",
  room: "Quản lý phòng thi",
  log: "Nhật ký sử dụng",
};

const BreadcrumbComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Trang chủ
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        let breadcrumbLabel = breadcrumbMap[value] || value;

        // Nếu giá trị sau "organize/" là một ID, đổi thành "Quản lý ca thi"
        if (pathnames[index - 1] === "organize" && value.match(/^[0-9a-fA-F]{24}$/)) {
          breadcrumbLabel = "Quản lý ca thi";
        }

        return isLast ? (
          <Typography key={to} color="text.primary">
            {breadcrumbLabel}
          </Typography>
        ) : (
          <Link key={to} component={RouterLink} to={to} underline="hover" color="inherit">
            {breadcrumbLabel}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbComponent;
