import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import logo from '../../assets/logo/logo.png';
import ApiService from "../../services/apiService";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import "./ChapterSidebar.css";
import PropTypes from 'prop-types';
import { Pointer } from 'lucide-react';

const ChapterSidebar = ({ onFilterSelect, selectedFilter  }) => {
  const { subjectId, questionBankId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  //const [selectedFilter, setSelectedFilter] = useState(null);

   useEffect(() => {
    const fetchChaptersWithLevels = async () => {
      setIsLoading(true);
      try {
        const res = await ApiService.get("/subjects/questions", {
          params: {
            subId: subjectId,
            qbId: questionBankId,
            keyword: "",
            page: 1,
            pageSize: 1000,
          },
        });

        const questions = res.data.questions;
        const grouped = {};

        questions.forEach((q) => {
          const chapter = q.tags[0] || "Chương chưa xác định";
          const level = q.tags[1] || "Mức độ chưa xác định";
          if (!grouped[chapter]) grouped[chapter] = {};
          if (!grouped[chapter][level]) grouped[chapter][level] = [];
          grouped[chapter][level].push(q);
        });

        setGroupedQuestions(grouped);
      } catch (error) {
        console.error("Lỗi khi fetch chapter-level:", error);
      }
      setIsLoading(false);
    };

    fetchChaptersWithLevels();
  }, [subjectId, questionBankId]);

    const [collapsedLevels, setCollapsedLevels] = useState({});
    const toggleChapter = (chapter) => {
    setCollapsedLevels((prev) => ({
      ...prev,
      [chapter]: !prev[chapter],
    }));
  };

  // Khi click chapter
  const handleChapterClick = (chapter) => {
    if (selectedFilter?.chapter === chapter && !selectedFilter?.level) {
      // Nếu đang chọn cùng chapter thì reset -> hiển thị all
      onFilterSelect(null);
    } else {
      onFilterSelect({ chapter }); // Chỉ lọc theo chapter
    }
  };

  // Khi click level
  const handleLevelClick = (chapter, level) => {
    if (selectedFilter?.chapter === chapter && selectedFilter?.level === level) {
      // Nếu click lại đúng chapter + level thì reset
      onFilterSelect(null);
    } else {
      onFilterSelect({ chapter, level }); // Lọc theo chapter + level
    }
  };


  return (
    <div>
      <img className="m-3" src={logo} alt="Logo" style={{ height: 40 }} />
      <h5 className="m-3 p-0 fw-bold">Danh sách chương</h5>

      {isLoading ? (
        <div className="text-center mt-2">
          <CircularProgress size={24} />
        </div>
      ) : (
        
        <List className='p-0'>
          {Object.entries(groupedQuestions).map(([chapter, levels], index) => (
            <Box key={index} sx={{ mb: 0 }}>
              <ListItem 
                onClick={() => handleChapterClick(chapter)}
                sx={{ 
                  backgroundColor:
                selectedFilter?.chapter === chapter && !selectedFilter?.level
                  ? "#e6f2fc"
                  : "#f0f0f0",
                  '&:hover': {
                    backgroundColor: '#e0f0ff',
                    cursor: "pointer",
                  }, 
                  mb: 1,
                }}
                button
              >
                <ListItemText primary={chapter} />
                <button 
                  className="btn btn-link text-decoration-none position p-0 pe-0"
                  style={{color: "black"}}
                  onClick={(e) => { e.stopPropagation(); toggleChapter(chapter); }}
                  
                >            
                  <ArrowDropDownIcon 
                    style={{
                      transform: collapsedLevels[chapter] ? "rotate(0deg)" : "rotate(180deg)",
                      transition: "transform 0.3s ease"
                    }}
                  />
                </button>
              </ListItem>
              {!collapsedLevels[chapter] && (
                <div
                  className={`level-collapse ${collapsedLevels[chapter] ? 'collapsed' : 'expanded'}`}
                >
                  {Object.entries(levels).map(([level, questions], lvlIndex) => (
                    <ListItem
                      key={lvlIndex}
                      sx={{
                        pl: 4,
                        py: 0.6,
                        backgroundColor:
                      selectedFilter?.chapter === chapter &&
                      selectedFilter?.level === level
                        ? "#e6f2fc"
                        : "transparent",
                        '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' },
                      }}
                      button
                      onClick={() => handleLevelClick(chapter, level)}
                    >
                      <ListItemText primary={`${level} (${questions.length})`} />
                    </ListItem>
                  ))}
                </div>

              )}
            </Box>
         ))}
        </List>
      )}
    </div>
  );
};

ChapterSidebar.propTypes = {
  onFilterSelect: PropTypes.func, // Khai báo onChapterSelect là một hàm
  selectedFilter: PropTypes.shape({
    chapter: PropTypes.string,
    level: PropTypes.string,
  }),
};
export default ChapterSidebar;
