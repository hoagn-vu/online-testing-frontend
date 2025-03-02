import React, { useState, useEffect, useContext } from 'react';
import './HomeCandidate.css'
import { FaFileAlt, FaUserCircle } from 'react-icons/fa';


const HomeCandidate = () => {
    // Thông tin thí sinh
    const candidate = {
        name: "Phan Thị Phương Linh",
        studentId: "2112203"
    };

    // Danh sách bài thi
    const exams = [
        "Test 4",
        "Test 2",
        "Bài kiểm tra giữa kỳ II (22 toán)",
        "Bài kiểm tra giữa kỳ I (22 toán)",
    ];

    return (
        <div className="home-candi-page">
            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 d-flex info-exam-content">
                    {/* Cột 1: Thông tin thí sinh */}
                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center w-full info-content">
                        {/* Avatar */}
                        <h2>Thông tin thí sinh</h2>
                        <div className=" icon icon-user">
                            <FaUserCircle style={{ fontSize: "130px" }}/>
                        </div>
                        {/* Thông tin thí sinh */}
                        <p className="mt-4 font-semibold"><span className='fw-bold'>Họ tên: </span><span>{candidate.name}</span></p>
                        <p className="text-gray-500"><span className='fw-bold'>Mã sinh viên: </span><span>{candidate.studentId}</span></p>
                    </div>

                    {/* Cột 2: Danh sách bài thi */}
                    <div className="bg-white shadow-md rounded-lg p-6 w-full exam-content">
                        <h2 className="text-xl font-semibold">Bài thi</h2>
                        <ul className="space-y-2 detail-list-exam">
                            {exams.map((exam, index) => (
                                <ol key={index} className="flex items-center space-x-2 text-blue-600 cursor-pointer p-0 pt-3">
                                    <div className="cursor-pointer baithi">
                                        <FaFileAlt className="text-blue-400 icon" />
                                        <span >{exam}</span>
                                    </div>
                                    
                                </ol>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default HomeCandidate;