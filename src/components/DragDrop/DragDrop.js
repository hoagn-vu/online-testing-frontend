import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Typography, Button, Link, List, ListItem } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import uploadFile from "../../assets/file/upload_user.xlsx"

const DragDropModal = ({ open, onClose, onFilesDropped, title = "Kéo Thả Tệp Tài Liệu Vào Đây", sampleFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // ✅ Lưu danh sách file
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]); // ✅ Lưu file nhưng KHÔNG đóng modal
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]); // ✅ Lưu file nhưng KHÔNG đóng modal
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert("Vui lòng chọn ít nhất một file!");
      return;
    }
    onFilesDropped(selectedFiles); // ✅ Gửi file ra ngoài
    setSelectedFiles([]); // reset danh sách
    onClose(); // ✅ Đóng modal sau khi upload
  };

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={onClose}
        >
          <div className="p-4 pb-5 form-fade" 
            style={{
              backgroundColor: "#ffff", 
              borderRadius: "16px", 
              width: 600,
            }}
          >
            <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            ><i className="fa-solid fa-xmark"></i></button>                
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                width: 500,
                background: "#fff",
                borderRadius: "16px",
                padding: "40px",
                textAlign: "center",
                border: dragActive ? "2px dashed #3f8efc" : "2px dashed #d0d7de",
                transition: "0.3s",
                margin: "0 auto",
              }}
            >
              {/* Icon */}
              <i
                className="fa-solid fa-folder-open mb-3"
                style={{ fontSize: 50, color: "#3f8efc" }}
              ></i>

              <p style={{ color: "#444", marginBottom: "8px" }}>
                {title}
              </p>

              <p style={{ color: "#888", margin: "10px 0" }}>─── Hoặc ───</p>

              {/* ✅ Link nhỏ Browse files */}
              <p>
                <span
                  style={{
                    color: "#3f8efc",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={handleBrowseClick}
                >
                  Chọn file
                </span>
              </p>
              
              {sampleFile && (
                <p style={{ marginTop: "8px", fontSize: "14px", color: "#555" }}>
                  Bạn có thể tải file mẫu tại đây:{" "}
                  <a 
                    href={sampleFile.url} 
                    download 
                    style={{ color: "#3f8efc", textDecoration: "underline" }}
                  >
                    {sampleFile.name}
                  </a>
                </p>
              )}

              {/* Hidden input */}
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileSelect}
              />

            </div>
              {/* ✅ Hiển thị file */}
              {selectedFiles.length > 0 && (
                <div style={{ marginTop: "20px", textAlign: "left" }}>
                  <strong>Files selected:</strong>
                  <div
                    style={{
                      maxHeight: 150,
                      overflowY: "auto",
                      marginTop: 8,
                    }}
                  >
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        style={{ fontSize: "14px", padding: "4px 0" }}
                      >
                        📄 {file.name} ({Math.round(file.size / 1024)} KB)
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                style={{
                  marginTop: "20px",
                  backgroundColor: "#3f8efc",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "block",  
                  marginLeft: "auto", 
                  marginRight: "auto",
                }}
                onClick={handleUpload}
              >
                Upload
              </button>
          </div>
        </div>
      )}
    </>
  );
};

DragDropModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilesDropped: PropTypes.func.isRequired,
  title: PropTypes.string,
  sampleFile: PropTypes.string,
};

export default DragDropModal;
