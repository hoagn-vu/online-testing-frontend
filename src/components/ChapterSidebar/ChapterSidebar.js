import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';

const ChapterSidebar = () => {
  const chapters = [
    { id: 1, name: "Chương 1" },
    { id: 2, name: "Chương 2" },
    { id: 3, name: "Chương 3" }
  ];

  return (
    <div>
      <h6 className="px-3 py-2">Danh sách chương</h6>
      <List>
        {chapters.map((chapter) => (
          <ListItem button key={chapter.id}>
            <ListItemText primary={chapter.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ChapterSidebar;