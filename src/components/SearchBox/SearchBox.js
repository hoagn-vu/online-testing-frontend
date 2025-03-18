import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar() {
    return (
        <TextField
            variant="outlined"
            placeholder="Tìm kiếm..."
            size="small"
            fullWidth
            sx={{
                backgroundColor: "white", // Đổi màu nền thành trắng
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#ccc", // Đổi viền màu xám nhẹ
                    },
                    "&:hover fieldset": {
                        borderColor: "#aaa", // Màu viền khi hover
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#1976d2", // Màu viền khi focus
                    },
                },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
}

export default SearchBar;
